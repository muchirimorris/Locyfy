import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, CheckCircle2, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Read dynamic values passed from the Venue Details page
  const { venueId, venueName, totalAmount, packageType } = location.state || {};

  const [date, setDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    // If someone manually goes to /checkout without selecting a venue, bounce them back to the home page.
    if (!venueId) {
      navigate('/');
    }
  }, [venueId, navigate]);

  if (!venueId) return null;

  const handleMpesaPayment = async () => {
    if (!phoneNumber.match(/^(?:254|\+254|0)?(7[0-9]{8}|1[0-9]{8})$/)) {
      alert("Please enter a valid Kenyan phone number.");
      return;
    }

    setProcessing(true);
    setPaymentStatus('pending');

    try {
      // 1. Hit our Process Payment Endpoint
      const response = await apiClient.post('/bookings/process_payment/', {
        venue_id: venueId,
        booking_date: date,
        total_amount: totalAmount,
        phone_number: phoneNumber
      });

      // 2. STK Push simulated success
      setBookingRef(response.data.booking.transaction.transaction_reference);
      setPaymentStatus('success');
      setStep('success');

    } catch (error) {
      console.error("Payment failed", error);
      setPaymentStatus('failed');
    } finally {
      setProcessing(false);
    }
  };

  if (step === 'success') {
      return (
          <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
              <div className="bg-white max-w-md w-full rounded-3xl p-10 text-center shadow-xl border border-emerald-100">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
                  <p className="text-gray-500 font-medium mb-8">Your payment was securely verified and held in Escrow.</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction Ref</p>
                      <p className="font-mono text-gray-900 font-bold mb-4">{bookingRef}</p>
                      
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Venue</p>
                      <p className="text-gray-900 font-bold mb-4">{venueName}</p>
                      
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Amount Paid</p>
                      <p className="text-emerald-600 font-black text-xl">Ksh {totalAmount.toLocaleString()}</p>
                  </div>

                  <Link to="/" className="w-full block py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                      Back to Dashboard
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-10">
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 'details' ? 'bg-emerald-100' : 'bg-gray-200'}`}>1</div>
            <span className="font-bold text-sm">Booking Details</span>
          </div>
          <div className="w-16 h-px bg-gray-300 mx-4"></div>
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 'payment' ? 'bg-emerald-100' : 'bg-gray-200'}`}>2</div>
            <span className="font-bold text-sm">Escrow Payment</span>
          </div>
        </div>

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
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Details */}
              {step === 'details' && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-emerald-500" /> Secure Your Date
                  </h2>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Event Date</label>
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900"
                    />
                  </div>
                  <button 
                    disabled={!date}
                    onClick={() => setStep('payment')}
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Continue to Payment <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Lock className="w-6 h-6 text-emerald-500" /> Escrow Payment
                    </h2>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                      Protected by Locyfy
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                    Your funds are held securely in a Locyfy Escrow account. The vendor only receives payment 48 hours after your event concludes successfully.
                  </p>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 relative z-10">M-PESA Phone Number</label>
                    <div className="relative z-10 flex gap-2 items-center">
                      <span className="inline-flex items-center px-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-500 font-bold">
                        +254
                      </span>
                      <input 
                        type="tel" 
                        placeholder="712 345 678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-grow w-full pl-4 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 text-lg tracking-wide"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 font-medium relative z-10">A payment prompt will be sent to this number.</p>
                  </div>

                  {paymentStatus === 'failed' && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
                      <AlertCircle className="w-5 h-5" /> Payment failed or was cancelled. Try again.
                    </div>
                  )}

                  <button 
                    onClick={handleMpesaPayment}
                    disabled={processing || !phoneNumber}
                    className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Waiting for STK Push Pin...</>
                    ) : (
                      `Pay Ksh ${(totalAmount * 1.015).toLocaleString()} via M-PESA`
                    )}
                  </button>
                  <button 
                    onClick={() => setStep('details')}
                    className="w-full py-3 text-gray-500 font-bold hover:text-gray-900 mt-2 transition-colors text-center"
                  >
                    Back to Details
                  </button>
                </div>
              )}
          </div>

          {/* Price Breakdown Sidebar */}
          <aside>
            <div className="bg-gray-900 rounded-3xl p-8 text-white sticky top-8 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Booking Summary</h2>
              
              <div className="mb-6">
                <p className="text-gray-400 text-sm font-medium mb-1">Venue</p>
                <p className="font-bold text-lg">{venueName}</p>
                {date && <p className="text-gray-400 text-sm mt-1">{new Date(date).toLocaleDateString()} • Full Day</p>}
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">{packageType || 'Base Venue Booking'}</span>
                  <span className="font-bold">Ksh {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">Locyfy Escrow Fee (1.5%)</span>
                  <span className="font-bold">Ksh {(totalAmount * 0.015).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-300 font-medium">Total Due Today</span>
                <span className="text-2xl font-black text-emerald-400">Ksh {(totalAmount * 1.015).toLocaleString()}</span>
              </div>
              
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
