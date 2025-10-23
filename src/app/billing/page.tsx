"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";

interface BillingData {
  gameId: number;
  gameName: string;
  price: number;
  platform: string;
  imageUrl: string;
}

// Create a separate component that uses useSearchParams
function BillingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    country: "United States",
    zipCode: ""
  });

  // Get game data from URL parameters
  useEffect(() => {
    const gameId = searchParams.get('gameId');
    const gameName = searchParams.get('gameName');
    const price = searchParams.get('price');
    const platform = searchParams.get('platform');
    const imageUrl = searchParams.get('imageUrl');

    if (gameId && gameName && price) {
      setBillingData({
        gameId: parseInt(gameId),
        gameName: decodeURIComponent(gameName),
        price: parseFloat(price),
        platform: platform ? decodeURIComponent(platform) : "Unknown Platform",
        imageUrl: imageUrl ? decodeURIComponent(imageUrl) : "/placeholder.png"
      });
    } else {
      // Redirect back if no game data
      router.push('/dashboard');
    }
    setLoading(false);
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save purchase to user's library
      if (billingData) {
        // In a real app, you would send this to your API
        const purchaseData = {
          id: Date.now(), // Generate unique ID
          gameId: billingData.gameId,
          gameName: billingData.gameName,
          price: billingData.price,
          platform: billingData.platform,
          imageUrl: billingData.imageUrl,
          purchaseDate: new Date().toISOString().split('T')[0],
          userId: "current-user-id", // You would get this from your auth system
          downloadUrl: `/download/${billingData.gameName.toLowerCase().replace(/\s+/g, '-')}`,
          playable: true,
          category: "Unknown" // You might want to pass this from the dashboard too
        };
        
        // Save to localStorage for demo purposes
        // In a real app, you would save to your database via API
        const existingPurchases = JSON.parse(localStorage.getItem('purchasedGames') || '[]');
        const updatedPurchases = [...existingPurchases, purchaseData];
        localStorage.setItem('purchasedGames', JSON.stringify(updatedPurchases));
        
        console.log("Purchase saved:", purchaseData);
      }
      
      setPurchaseComplete(true);
      
      // Redirect to library after 2 seconds
      setTimeout(() => {
        router.push('/library');
      }, 2000);
      
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Invalid game data</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (purchaseComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-lg">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Complete!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for purchasing <strong>{billingData.gameName}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your games library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back to Game
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Complete Your Purchase</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <img
                src={billingData.imageUrl}
                alt={billingData.gameName}
                className="w-20 h-20 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-800">{billingData.gameName}</h3>
                <p className="text-sm text-gray-600">{billingData.platform}</p>
                <p className="text-lg font-bold text-indigo-600 mt-2">
                  ${billingData.price.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${billingData.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-indigo-600">${billingData.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">Secure Payment</span>
              </div>
              <p className="text-xs text-green-700">
                Your payment information is encrypted and secure. We do not store your card details.
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Payment Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setFormData(prev => ({ ...prev, cardNumber: formatted }));
                  }}
                  required
                  maxLength={19}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      setFormData(prev => ({ ...prev, expiryDate: formatted }));
                    }}
                    required
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="MM/YY"
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="123"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="12345"
                  />
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  required
                  className="mt-1"
                />
                <span className="text-gray-600">
                  I agree to the{" "}
                  <a href="/terms" className="text-indigo-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay ${billingData.price.toFixed(2)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your payment is secure and encrypted
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function BillingPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p>Loading billing page...</p>
          </div>
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}