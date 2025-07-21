
import React, { useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';

const PurchaseHistory = ({ onClose }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const apiOrders = await orderAPI.getOrders();
        // Sort by created_at descending
        apiOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        // Map API response to expected structure for UI
        const mappedOrders = apiOrders.map(order => ({
          id: order.id,
          date: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : '',
          time: order.created_at ? new Date(order.created_at).toLocaleTimeString() : '',
          status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing',
          total: `$${(order.total_amount + order.shipping_cost + order.taxes).toFixed(2)}`,
          items: [
            {
              id: order.product_id,
              name: order.product_name || 'Product',
              price: `$${order.total_amount.toFixed(2)}`,
              quantity: 1,
              image: order.product_image || 'https://via.placeholder.com/150',
            }
          ],
          shippingAddress: order.shipping_address ? Object.values(order.shipping_address).join(', ') : '',
          trackingNumber: order.tracking_info?.tracking_number || 'N/A',
        }));
        setOrders(mappedOrders);
      } catch (e) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleOrderClick = async (order) => {
    setDetailLoading(true);
    try {
      const detail = await orderAPI.getOrder(order.id);
      // Map API response to detail view structure
      setSelectedOrder({
        id: detail.id,
        date: detail.created_at ? new Date(detail.created_at).toISOString().split('T')[0] : '',
        time: detail.created_at ? new Date(detail.created_at).toLocaleTimeString() : '',
        status: detail.status ? detail.status.charAt(0).toUpperCase() + detail.status.slice(1) : 'Processing',
        total: `$${(detail.total_amount + detail.shipping_cost + detail.taxes).toFixed(2)}`,
        items: [
          {
            id: detail.product_id,
            name: detail.product_name || 'Product',
            price: `$${detail.total_amount.toFixed(2)}`,
            quantity: 1,
            image: detail.product_image || 'https://via.placeholder.com/150',
          }
        ],
        shippingAddress: detail.shipping_address ? Object.values(detail.shipping_address).join(', ') : '',
        trackingNumber: detail.tracking_info?.tracking_number || 'N/A',
      });
    } catch (e) {
      setSelectedOrder(null);
    }
    setDetailLoading(false);
  };

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
              onClick={() => handleOrderClick(order)}
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
