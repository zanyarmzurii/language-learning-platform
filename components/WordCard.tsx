"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { speakText } from "@/lib/speech";

interface WordCardProps {
  word: {
    word: string;
    translation: string;
    pronunciation: string;
    partOfSpeech: string;
    example: string;
    exampleTranslation: string;
    imageUrl?: string;
    audioUrl?: string;
    difficulty: string;
  };
  onLearned?: () => void;
}

export default function WordCard({ word, onLearned }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [learned, setLearned] = useState(false);

  const handleSpeak = () => {
    speakText(word.word);
  };

  const handleLearned = () => {
    setLearned(true);
    if (onLearned) onLearned();
  };

  const difficultyColors: any = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition transform hover:scale-105"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <CardContent className="p-6 text-center">
        {!isFlipped ? (
          <>
            {word.imageUrl && (
              <img
                src={word.imageUrl}
                alt={word.word}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="text-3xl font-bold mb-2">{word.word}</div>
            <div className="text-lg text-gray-600 mb-2">
              {word.pronunciation}
            </div>
            <div className="flex justify-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${difficultyColors[word.difficulty]}`}
              >
                {word.difficulty}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {word.partOfSpeech}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              کلیک بکە بۆ بینینی وەرگێڕان
            </p>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-purple-600 mb-4">
              {word.translation}
            </div>
            <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-1">📝 نموونە:</p>
              <p className="text-gray-700">{word.example}</p>
              <p className="text-gray-500 text-sm mt-1">
                {word.exampleTranslation}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={handleSpeak}>
                🔊 گوێگرتن
              </Button>
              {!learned && (
                <Button size="sm" onClick={handleLearned}>
                  ✅ فێربووم
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
