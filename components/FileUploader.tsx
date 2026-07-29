"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface FileUploaderProps {
  type: "video" | "pdf" | "word" | "ppt" | "image" | "voice";
  onUpload: (url: string) => void;
}

export default function FileUploader({ type, onUpload }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setProgress(100);
        onUpload(data.url);
        toast.success("فایلەکە بە سەرکەوتوویی ئەپلۆد کرا!");
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setUploading(false);
      }
    },
    [type, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      video: { "video/*": [] },
      pdf: { "application/pdf": [] },
      word: {
        "application/msword": [],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      },
      ppt: {
        "application/vnd.ms-powerpoint": [],
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": [],
      },
      image: { "image/*": [] },
      voice: { "audio/*": [] },
    }[type],
  });

  const typeLabels: any = {
    video: "ڤیدیۆ",
    pdf: "PDF",
    word: "Word",
    ppt: "PowerPoint",
    image: "وێنە",
    voice: "دەنگ",
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-purple-400"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg">ئەپلۆد دەکرێت...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : isDragActive ? (
          <div>
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg">فایلەکە ئازاد بکە</p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4">📤</div>
            <p className="text-lg">
              فایلی {typeLabels[type]} ئەپلۆد بکە
            </p>
            <p className="text-sm text-gray-500 mt-2">
              کلیک بکە یان فایلەکە ڕابکێشە
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
