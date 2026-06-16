import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, ArrowRight } from 'lucide-react';

export const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Trust Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-emerald-900 font-bold text-lg mb-1">Your payment is 100% protected.</h3>
            <p className="text-emerald-800 text-sm font-medium">
              To protect you from fraud, your payment is securely held in Locyfy Escrow and is only released to the vendor after successful verification and event completion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Payment UI */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Payment Method</h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* M-PESA Option */}
                <div 
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'mpesa' ? 'border-emerald-500' : 'border-gray-300'}`}>
                    {paymentMethod === 'mpesa' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                  <Smartphone className={`w-6 h-6 ${paymentMethod === 'mpesa' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`font-bold ${paymentMethod === 'mpesa' ? 'text-gray-900' : 'text-gray-600'}`}>M-PESA (STK Push)</span>
                </div>

                {/* Card Option */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-emerald-500' : 'border-gray-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`font-bold ${paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-600'}`}>Credit / Debit Card</span>
                </div>
              </div>

              {/* M-PESA Form */}
              {paymentMethod === 'mpesa' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <label className="block text-sm font-bold text-gray-700 mb-2">M-PESA Phone Number</label>
                   <div className="flex gap-2">
                     <span className="inline-flex items-center px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-bold">
                       +254
                     </span>
                     <input 
                       type="text" 
                       placeholder="712 345 678" 
                       className="flex-grow w-full border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
                     />
                   </div>
                   <p className="text-xs text-gray-500 mt-2 font-medium">You will receive a prompt on your phone to enter your M-PESA PIN.</p>
                </div>
              )}

              {/* Card Form Mock */}
              {paymentMethod === 'card' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                     <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                   </div>
                   <div className="flex gap-4">
                     <div className="flex-1">
                       <label className="block text-sm font-bold text-gray-700 mb-2">Expiry</label>
                       <input type="text" placeholder="MM/YY" className="w-full border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                     </div>
                     <div className="flex-1">
                       <label className="block text-sm font-bold text-gray-700 mb-2">CVC</label>
                       <input type="text" placeholder="123" className="w-full border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none" />
                     </div>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown Sidebar */}
          <aside>
            <div className="bg-gray-900 rounded-3xl p-8 text-white sticky top-8 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Booking Summary</h2>
              
              <div className="mb-6">
                <p className="text-gray-400 text-sm font-medium mb-1">Venue</p>
                <p className="font-bold text-lg">Karura Forest Event Grounds</p>
                <p className="text-gray-400 text-sm">Oct 24, 2025 • Full Day</p>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Traditional Ruracio Package</span>
                  <span className="font-bold">Ksh 150,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Backup Generator Add-on</span>
                  <span className="font-bold">Ksh 15,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Locyfy Service Fee (2%)</span>
                  <span className="font-bold">Ksh 3,300</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-300 font-medium">Total Due Today</span>
                <span className="text-2xl font-black text-emerald-400">Ksh 168,300</span>
              </div>

              <button className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                Confirm & Pay <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure Encrypted Checkout
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
