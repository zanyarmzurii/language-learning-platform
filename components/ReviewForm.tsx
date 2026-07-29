"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import StarRating from "@/components/StarRating";
import { toast } from "sonner";

interface ReviewFormProps {
  courseId: string;
  onReviewAdded?: () => void;
}

export default function ReviewForm({
  courseId,
  onReviewAdded,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("تکایە هەڵسەنگاندن دیاری بکە");
      return;
    }

    if (!comment.trim()) {
      toast.error("تکایە کۆمێنت بنووسە");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("هەڵسەنگاندن زیاد کرا!");
      setComment("");
      setRating(0);
      if (onReviewAdded) onReviewAdded();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          هەڵسەنگاندن
        </label>
        <StarRating rating={rating} onRate={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          کۆمێنت
        </label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="بۆچوونی خۆت بنووسە..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "ناردن..." : "ناردنی هەڵسەنگاندن"}
      </Button>
    </form>
  );
}
