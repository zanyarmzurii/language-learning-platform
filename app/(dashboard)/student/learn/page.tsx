"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import WordCard from "@/components/WordCard";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function LearnPage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("basic");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchWords();
  }, [category]);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ai/vocabulary?language=English&category=${category}&count=10`
      );
      const data = await res.json();
      if (res.ok && data.words) {
        setWords(data.words);
        setCurrentIndex(0);
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    } finally {
      setLoading(false);
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: "قوتابی", role: "student" }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">فێربوونی وشە</h1>
          <select
            className="border rounded-lg px-4 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="basic">سەرەتایی</option>
            <option value="food">خواردن</option>
            <option value="travel">گەشت</option>
            <option value="business">بزنس</option>
            <option value="daily">ڕۆژانە</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⏳</div>
            <p>وشەکان بەهۆی AI دروست دەکرێن...</p>
          </div>
        ) : words.length > 0 ? (
          <>
            <div className="mb-8">
              <WordCard word={words[currentIndex]} />
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={prevWord}
                disabled={currentIndex === 0}
                variant="outline"
              >
                → پێشوو
              </Button>

              <span className="text-gray-600">
                {currentIndex + 1} / {words.length}
              </span>

              <Button
                onClick={nextWord}
                disabled={currentIndex === words.length - 1}
              >
                داهاتوو ←
              </Button>
            </div>

            <div className="text-center mt-8">
              <Button onClick={fetchWords} variant="outline" size="lg">
                وشەی نوێ بەدەست بهێنە 🔄
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p>هیچ وشەیەک نەدۆزرایەوە</p>
          </div>
        )}
      </div>
    </div>
  );
}
