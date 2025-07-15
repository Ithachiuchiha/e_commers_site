import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';
import { getOrder } from '../lib/orders';
import { OrderDetails } from '../types/order';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;
      const orderData = await getOrder(orderId);
      setOrder(orderData);
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find the order you're looking for.</p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green/10 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We'll send you updates about your delivery.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Package className="text-green" />
              <h2 className="text-xl font-semibold">Order Details</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Number</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium">Cash on Delivery</p>
              </div>
              <div>
                <p className="text-gray-600">Order Status</p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <MapPin className="text-green" />
                <h2 className="text-xl font-semibold">Delivery Address</h2>
              </div>

              <div className="bg-cream rounded-lg p-4">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-2 pb-4">
                <Truck className="text-green" />
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x Item {index + 1}
                    </span>
                    <span className="font-medium">
                      ₹{item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{order.orderSummary.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>₹{order.orderSummary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{order.orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Link to="/" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;