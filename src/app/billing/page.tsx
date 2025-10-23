"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Smartphone,
  Building,
  Wallet,
  QrCode,
  Lock
} from "lucide-react";

interface BillingData {
  gameId: number;
  gameName: string;
  price: number;
  platform: string;
  imageUrl: string;
}

type PaymentMethod = 'card' | 'gcash' | 'bdo' | 'chinabank' | 'pnb' | 'maya' | 'paypal';

// Create a separate component that uses useSearchParams
function BillingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card');

  // Form state
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    country: "Philippines",
    zipCode: "",
    mobileNumber: "",
    accountNumber: "",
    referenceNumber: ""
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
        const purchaseData = {
          id: Date.now(),
          gameId: billingData.gameId,
          gameName: billingData.gameName,
          price: billingData.price,
          platform: billingData.platform,
          imageUrl: billingData.imageUrl,
          purchaseDate: new Date().toISOString().split('T')[0],
          userId: "current-user-id",
          downloadUrl: `/download/${billingData.gameName.toLowerCase().replace(/\s+/g, '-')}`,
          playable: true,
          category: "Unknown",
          paymentMethod: selectedPayment,
          transactionId: `TXN${Date.now()}`
        };
        
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

  const formatMobileNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length <= 4) return v;
    if (v.length <= 7) return `${v.slice(0, 4)} ${v.slice(4)}`;
    return `${v.slice(0, 4)} ${v.slice(4, 7)} ${v.slice(7, 11)}`;
  };

  const paymentMethods = [
    { id: 'card' as PaymentMethod, name: 'Credit/Debit Card', icon: CreditCard, description: 'Pay with Visa, Mastercard, or UnionPay' },
    { id: 'gcash' as PaymentMethod, name: 'GCash', icon: Smartphone, description: 'Pay using your GCash wallet' },
    { id: 'bdo' as PaymentMethod, name: 'BDO Online Banking', icon: Building, description: 'Bank transfer via BDO' },
    { id: 'chinabank' as PaymentMethod, name: 'China Bank', icon: Building, description: 'Bank transfer via China Bank' },
    { id: 'pnb' as PaymentMethod, name: 'PNB Online', icon: Building, description: 'Bank transfer via PNB' },
    { id: 'maya' as PaymentMethod, name: 'Maya Wallet', icon: Wallet, description: 'Pay using Maya (formerly PayMaya)' },
    { id: 'paypal' as PaymentMethod, name: 'PayPal', icon: CreditCard, description: 'Pay with your PayPal account' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg">
          <p className="text-red-600 mb-4 text-lg">Invalid game data</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (purchaseComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-lg border border-green-200">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Complete!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for purchasing <strong>{billingData.gameName}</strong>
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-700">
              Transaction ID: <strong>TXN{Date.now()}</strong>
            </p>
            <p className="text-sm text-green-700 mt-1">
              Payment Method: <strong>{paymentMethods.find(p => p.id === selectedPayment)?.name}</strong>
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to your games library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition"
          >
            <ArrowLeft size={20} />
            Back to Game
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Purchase</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
              
              <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
                <img
                  src={billingData.imageUrl}
                  alt={billingData.gameName}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{billingData.gameName}</h3>
                  <p className="text-sm text-gray-600">{billingData.platform}</p>
                  <p className="text-xl font-bold text-indigo-600 mt-2">
                    ₱{billingData.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₱{billingData.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₱0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span>₱0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span className="text-gray-800">Total</span>
                  <span className="text-indigo-600">₱{billingData.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={18} className="text-green-600" />
                  <span className="text-sm font-semibold text-green-800">100% Secure Payment</span>
                </div>
                <p className="text-xs text-green-700 leading-relaxed">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                </p>
              </div>

              {/* Support Info */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Need Help?</span>
                </div>
                <p className="text-xs text-blue-700">
                  Contact support: <strong>support@gamevault.com</strong><br />
                  Phone: <strong>+63 2 8555 1234</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <CreditCard size={24} />
                Payment Method
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedPayment === method.id
                          ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${
                          selectedPayment === method.id ? 'bg-indigo-100' : 'bg-gray-100'
                        }`}>
                          <method.icon size={20} className={
                            selectedPayment === method.id ? 'text-indigo-600' : 'text-gray-600'
                          } />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{method.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Forms */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Credit Card Form */}
                {selectedPayment === 'card' && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800">Card Details</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={formData.cardholderName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="MM/YY"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                          maxLength={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* GCash Form */}
                {selectedPayment === 'gcash' && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800">GCash Payment</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <QrCode size={18} className="text-yellow-600" />
                        <span className="font-semibold text-yellow-800">How to Pay with GCash</span>
                      </div>
                      <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                        <li>Open your GCash app</li>
                        <li>Go to "Pay QR" or "Send Money"</li>
                        <li>Enter the amount: <strong>₱{billingData.price.toFixed(2)}</strong></li>
                        <li>Use our GCash number: <strong>0917 123 4567</strong></li>
                        <li>Enter the reference number below</li>
                      </ol>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GCash Mobile Number
                      </label>
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={(e) => {
                          const formatted = formatMobileNumber(e.target.value);
                          setFormData(prev => ({ ...prev, mobileNumber: formatted }));
                        }}
                        required
                        maxLength={13}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0917 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GCash Reference Number
                      </label>
                      <input
                        type="text"
                        name="referenceNumber"
                        value={formData.referenceNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter reference number from GCash"
                      />
                    </div>
                  </div>
                )}

                {/* Bank Transfer Forms */}
                {['bdo', 'chinabank', 'pnb'].includes(selectedPayment) && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selectedPayment === 'bdo' && 'BDO Online Banking'}
                      {selectedPayment === 'chinabank' && 'China Bank Transfer'}
                      {selectedPayment === 'pnb' && 'PNB Online Banking'}
                    </h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building size={18} className="text-blue-600" />
                        <span className="font-semibold text-blue-800">Bank Transfer Details</span>
                      </div>
                      <div className="text-sm text-blue-700 space-y-2">
                        <div className="flex justify-between">
                          <span>Bank:</span>
                          <strong>
                            {selectedPayment === 'bdo' && 'BDO (Banco de Oro)'}
                            {selectedPayment === 'chinabank' && 'China Banking Corporation'}
                            {selectedPayment === 'pnb' && 'Philippine National Bank'}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Name:</span>
                          <strong>GameVault Inc.</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Number:</span>
                          <strong>
                            {selectedPayment === 'bdo' && '0012 3456 7890'}
                            {selectedPayment === 'chinabank' && '1012 3456 7890'}
                            {selectedPayment === 'pnb' && '2012 3456 7890'}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <strong>₱{billingData.price.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Bank Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your bank account number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Reference Number
                      </label>
                      <input
                        type="text"
                        name="referenceNumber"
                        value={formData.referenceNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter reference number from bank transaction"
                      />
                    </div>
                  </div>
                )}

                {/* Maya Wallet */}
                {selectedPayment === 'maya' && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800">Maya Wallet Payment</h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet size={18} className="text-purple-600" />
                        <span className="font-semibold text-purple-800">Pay with Maya</span>
                      </div>
                      <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
                        <li>Open your Maya app</li>
                        <li>Go to "Send Money" or "Pay Bills"</li>
                        <li>Enter amount: <strong>₱{billingData.price.toFixed(2)}</strong></li>
                        <li>Send to Maya number: <strong>0918 765 4321</strong></li>
                        <li>Enter reference number below</li>
                      </ol>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maya Mobile Number
                      </label>
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={(e) => {
                          const formatted = formatMobileNumber(e.target.value);
                          setFormData(prev => ({ ...prev, mobileNumber: formatted }));
                        }}
                        required
                        maxLength={13}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0918 765 4321"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maya Reference Number
                      </label>
                      <input
                        type="text"
                        name="referenceNumber"
                        value={formData.referenceNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter reference number from Maya"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {selectedPayment === 'paypal' && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800">PayPal Payment</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={18} className="text-blue-600" />
                        <span className="font-semibold text-blue-800">Redirect to PayPal</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        You will be redirected to PayPal to complete your payment securely.
                        After successful payment, you will be returned to GameVault.
                      </p>
                    </div>
                  </div>
                )}

                {/* Common Fields */}
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="Philippines">Philippines</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="1234"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-indigo-600 hover:underline font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-indigo-600 hover:underline font-medium">
                      Privacy Policy
                    </a>
                    . I understand that all purchases are final and non-refundable.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Pay ₱{billingData.price.toFixed(2)} with {paymentMethods.find(p => p.id === selectedPayment)?.name}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  <Shield size={12} className="inline mr-1" />
                  Your payment is secure and encrypted. We never store your payment details.
                </p>
              </form>
            </div>
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading billing page...</p>
          </div>
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}