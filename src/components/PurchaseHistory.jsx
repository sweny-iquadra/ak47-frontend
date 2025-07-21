
import React, { useState, useEffect } from 'react';

const PurchaseHistory = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock purchase history data
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      time: '14:30',
      status: 'Delivered',
      total: '$1,299.99',
      items: [
        {
          id: 1,
          name: 'ASUS ROG Strix G15 Gaming Laptop',
          price: '$1,199.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=150&h=150&fit=crop&crop=center'
        },
        {
          id: 2,
          name: 'Gaming Mouse Pad',
          price: '$29.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=150&h=150&fit=crop&crop=center'
        },
        {
          id: 3,
          name: 'Laptop Sleeve',
          price: '$39.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop&crop=center'
        }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      time: '09:15',
      status: 'Shipped',
      total: '$89.97',
      items: [
        {
          id: 4,
          name: 'Wireless Bluetooth Headphones',
          price: '$59.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&crop=center'
        },
        {
          id: 5,
          name: 'Phone Case',
          price: '$19.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=150&h=150&fit=crop&crop=center'
        },
        {
          id: 6,
          name: 'USB-C Cable',
          price: '$9.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=center'
        }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-05',
      time: '16:45',
      status: 'Processing',
      total: '$249.98',
      items: [
        {
          id: 7,
          name: 'Mechanical Keyboard',
          price: '$129.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=150&h=150&fit=crop&crop=center'
        },
        {
          id: 8,
          name: 'Gaming Mouse',
          price: '$79.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=150&h=150&fit=crop&crop=center'
        },
        {
          id: 9,
          name: 'Monitor Stand',
          price: '$39.99',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150&h=150&fit=crop&crop=center'
        }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: 'TRK456789123'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'bg-green-100 text-green-800',
      'Shipped': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Orders</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
            {selectedOrder.status}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Order ID: <span className="font-medium text-gray-900">{selectedOrder.id}</span></p>
                <p className="text-sm text-gray-600">Date: <span className="font-medium text-gray-900">{formatDate(selectedOrder.date)} at {selectedOrder.time}</span></p>
                <p className="text-sm text-gray-600">Total: <span className="font-medium text-gray-900">{selectedOrder.total}</span></p>
                <p className="text-sm text-gray-600">Tracking: <span className="font-medium text-gray-900">{selectedOrder.trackingNumber}</span></p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered ({selectedOrder.items.length})</h3>
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>{orders.length} orders</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatDate(order.date)} at {order.time}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.total}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{order.total}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">Start shopping to see your purchase history here.</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
