"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Download, Home } from "lucide-react";
import { useEffect } from "react";

export default function PurchaseSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-lg">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your game has been added to your library.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Dashboard
          </button>
          
          <button
            onClick={() => router.push('/library')}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
          >
            <Download size={18} />
            View My Games
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting to dashboard in 5 seconds...
        </p>
      </div>
    </div>
  );
}