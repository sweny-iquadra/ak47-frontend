
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Extract payment details from URL params
        const paymentId = searchParams.get('payment_id');
        const orderId = searchParams.get('order_id');
        const amount = searchParams.get('amount');

        // Mock order details - in real app, you'd fetch from API
        setOrderDetails({
            paymentId: paymentId || 'pay_' + Math.random().toString(36).substr(2, 9),
            orderId: orderId || 'order_' + Math.random().toString(36).substr(2, 9),
            amount: amount || '$99.99',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            status: 'completed'
        });
    }, [searchParams]);

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleViewOrders = () => {
        navigate('/profile', { state: { activeTab: 'history' } });
    };

    if (!orderDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-white/30">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-8 text-lg">Thank you for your purchase. Your order has been confirmed.</p>

                {/* Order Details */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 text-left border border-blue-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Order Details
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Order ID:</span>
                            <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{orderDetails.orderId}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Payment ID:</span>
                            <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{orderDetails.paymentId}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Amount:</span>
                            <span className="font-bold text-blue-700 text-xl">{orderDetails.amount}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Date:</span>
                            <span className="font-semibold text-gray-900">{orderDetails.date}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200">
                            <span className="text-gray-700 font-medium">Time:</span>
                            <span className="font-semibold text-gray-900">{orderDetails.time}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 font-medium">Status:</span>
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold capitalize shadow-sm border border-green-200">
                                ✓ {orderDetails.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleViewOrders}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            View My Orders
                        </span>
                    </button>
                    <button
                        onClick={handleContinueShopping}
                        className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
                    >
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Continue Shopping
                        </span>
                    </button>
                </div>

                {/* Additional Info */}
                {/* <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200 shadow-inner">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-bold text-blue-900 mb-1">What's Next?</p>
                            <p className="text-blue-800 leading-relaxed">
                                You'll receive an email confirmation shortly. Your order will be processed within 24 hours and shipped to your address.
                            </p>
                        </div>
                    </div>
                </div>*/}

                {/* Decorative Elements */}
                <div className="mt-6 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
