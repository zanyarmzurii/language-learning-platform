"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { toast } from "sonner";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments);
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (paymentId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchPayments();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ name: "ئەدمین", role: "admin" }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">بەڕێوەبردنی پارەدانەکان</h1>

        {loading ? (
          <div className="text-center py-20">⏳ چاوەڕێ بکە...</div>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-lg text-gray-600">هیچ پارەدانێک نییە</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : payment.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status === "pending"
                            ? "چاوەڕوان"
                            : payment.status === "approved"
                            ? "پەسەندکراو"
                            : "ڕەتکراوە"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {payment.paymentMethod}
                        </span>
                      </div>
                      <p>
                        <span className="font-semibold">بڕ:</span>{" "}
                        {payment.amount.toLocaleString()} {payment.currency}
                      </p>
                      <p>
                        <span className="font-semibold">نێرەر:</span>{" "}
                        {payment.senderName} - {payment.senderPhone}
                      </p>
                      {payment.userId && (
                        <p className="text-sm text-gray-600">
                          بەکارهێنەر: {payment.userId.name} ({payment.userId.email})
                        </p>
                      )}
                      {payment.courseId && (
                        <p className="text-sm text-gray-600">
                          خول: {payment.courseId.title}
                        </p>
                      )}
                      {payment.transactionId && (
                        <p className="text-sm text-gray-600">
                          ID: {payment.transactionId}
                        </p>
                      )}
                    </div>

                    {payment.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleUpdateStatus(payment._id, "approved")
                          }
                          size="sm"
                        >
                          پەسەند
                        </Button>
                        <Button
                          onClick={() =>
                            handleUpdateStatus(payment._id, "rejected")
                          }
                          variant="destructive"
                          size="sm"
                        >
                          ڕەت
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
