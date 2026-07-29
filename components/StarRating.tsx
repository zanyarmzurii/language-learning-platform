"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  onRate,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes: any = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${sizes[size]} transition ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${
            (hoverRating || rating) >= star
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        >
          ★
        </button>
      ))}
      {!readonly && (
        <span className="text-sm text-gray-500 ml-2">
          {rating > 0 ? `${rating}/5` : "هەڵسەنگاندن"}
        </span>
      )}
    </div>
  );
}
