import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Calendar, CheckCircle2, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      const response = await apiClient.post('/bookings/process-payment/', {
        venue_id: location.state?.venueId,
        location_id: location.state?.locationId,
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

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  if (step === 'success') {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white/80 backdrop-blur-xl max-w-md w-full rounded-[2rem] p-10 text-center shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-white/50 relative z-10"
              >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner relative"
                  >
                      <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-[2rem]"></div>
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 relative z-10" />
                  </motion.div>
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Booking Confirmed!</h1>
                  <p className="text-gray-500 font-medium mb-10 text-lg">Your payment was securely verified and held in Escrow.</p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/60 rounded-3xl p-6 mb-10 text-left border border-gray-100 shadow-sm backdrop-blur-md"
                  >
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">TRANSACTION REF</p>
                      <p className="font-mono text-gray-900 font-bold mb-5 tracking-wide">{bookingRef}</p>
                      
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">VENUE</p>
                      <p className="text-gray-900 font-black mb-5 tracking-tight">{venueName}</p>
                      
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">AMOUNT PAID</p>
                      <p className="text-emerald-500 font-black text-3xl tracking-tight">Ksh {totalAmount.toLocaleString()}</p>
                  </motion.div>

                  <Link to="/" className="w-full block py-4 bg-gray-900 text-white font-black tracking-wide rounded-2xl hover:bg-emerald-500 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95">
                      BACK TO DASHBOARD
                  </Link>
              </motion.div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-10"
        >
          <div className={`flex items-center gap-2 transition-colors duration-300 ${step === 'details' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step === 'details' ? 'bg-emerald-100' : 'bg-gray-200'}`}>1</div>
            <span className="font-bold text-sm">Booking Details</span>
          </div>
          <div className="w-16 h-px bg-gray-300 mx-4 relative">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-emerald-500" 
              initial={{ width: '0%' }}
              animate={{ width: step === 'payment' ? '100%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className={`flex items-center gap-2 transition-colors duration-300 ${step === 'payment' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step === 'payment' ? 'bg-emerald-100' : 'bg-gray-200'}`}>2</div>
            <span className="font-bold text-sm">Escrow Payment</span>
          </div>
        </motion.div>

        {/* Trust Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-emerald-900 font-bold text-lg mb-1">Your payment is 100% protected.</h3>
            <p className="text-emerald-800 text-sm font-medium">
              To protect you from fraud, your payment is securely held in Locyfy Escrow and is only released to the vendor after successful verification and event completion.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column */}
          <div className="lg:col-span-2 relative min-h-[400px]">
             <AnimatePresence mode="wait">
              {/* Step 1: Details */}
              {step === 'details' && (
                <motion.div 
                  key="details"
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 absolute w-full"
                >
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-gray-900 transition-shadow"
                    />
                  </div>
                  <button 
                    disabled={!date}
                    onClick={() => setStep('payment')}
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95"
                  >
                    Continue to Payment <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <motion.div 
                  key="payment"
                  variants={pageVariants}
                  initial="initial"
                  animate="in"
                  exit="out"
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 absolute w-full"
                >
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

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6 relative overflow-hidden group hover:border-emerald-200 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
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
                        className="flex-grow w-full pl-4 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 text-lg tracking-wide transition-shadow"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 font-medium relative z-10">A payment prompt will be sent to this number.</p>
                  </div>

                  {paymentStatus === 'failed' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100"
                    >
                      <AlertCircle className="w-5 h-5" /> Payment failed or was cancelled. Try again.
                    </motion.div>
                  )}

                  <button 
                    onClick={handleMpesaPayment}
                    disabled={processing || !phoneNumber}
                    className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95"
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
                </motion.div>
              )}
             </AnimatePresence>
          </div>

          {/* Price Breakdown Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-8 h-fit z-10"
          >
            <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden border border-gray-800 transition-transform duration-300 hover:shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent mix-blend-overlay"></div>
              <h2 className="text-2xl font-black mb-8 tracking-tight relative z-10">Booking Summary</h2>
              
              <div className="mb-8 relative z-10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">VENUE</p>
                <p className="font-black text-xl tracking-tight leading-tight">{venueName}</p>
                {date && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 text-sm mt-2 font-bold">{new Date(date).toLocaleDateString()} • Full Day</motion.p>}
              </div>

              <div className="space-y-5 mb-8 pb-8 border-b border-gray-800 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 font-semibold text-sm max-w-[60%]">{packageType || 'Base Venue Booking'}</span>
                  <span className="font-black text-lg">Ksh {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 font-semibold text-sm">Escrow Fee (1.5%)</span>
                  <span className="font-black">Ksh {(totalAmount * 0.015).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-10 relative z-10">
                <span className="text-gray-300 font-bold tracking-wide">Total Due Today</span>
                <span className="text-3xl font-black text-emerald-400 tracking-tight">Ksh {(totalAmount * 1.015).toLocaleString()}</span>
              </div>
              
              <p className="text-center text-[10px] text-gray-500 mt-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 relative z-10 bg-black/20 py-2 rounded-full backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURE ENCRYPTED CHECKOUT
              </p>
            </div>
          </motion.aside>

        </div>
      </div>
    </div>
  );
};
