import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Package, RefreshCw, Truck } from 'lucide-react';
import { ShipmentService } from '../services/shipmentService';
import { getErrorMessage } from '../utils/safeAsync';

const getCustomerName = (order: any) => {
  if (order.profiles?.full_name) return order.profiles.full_name;
  if (!order.address) return order.profiles?.email || 'Customer';

  try {
    const address = typeof order.address === 'string' ? JSON.parse(order.address) : order.address;
    return address.fullName || address.full_name || address.name || order.profiles?.email || 'Customer';
  } catch {
    return order.profiles?.email || 'Customer';
  }
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshingOrderId, setRefreshingOrderId] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    const result = await ShipmentService.getAdminOrders();

    if (!result.success) {
      setError(result.error || 'Could not load admin orders');
      setOrders([]);
    } else {
      setOrders(result.orders || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders().catch(err => {
      setError(getErrorMessage(err));
      setOrders([]);
      setIsLoading(false);
    });
  }, []);

  const refreshTracking = async (orderId: string) => {
    setRefreshingOrderId(orderId);
    try {
      await ShipmentService.refreshTracking(orderId);
      await loadOrders();
    } finally {
      setRefreshingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="mb-6 inline-flex items-center text-gray-900 hover:text-black">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Orders</h1>
            <p className="mt-1 text-sm text-gray-600">Shipment, payment, and tracking overview.</p>
          </div>
          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-black"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-lg bg-white">
            <Package className="mr-3 h-6 w-6 animate-pulse text-gray-400" />
            <span className="text-gray-600">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {['Customer', 'Payment Method', 'Courier', 'AWB', 'Shipment Status', 'Tracking Link', 'Download Shipping Label'].map(header => (
                      <th key={header} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order.id} className="align-top">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{getCustomerName(order)}</p>
                        <p className="mt-1 text-xs text-gray-500">#{order.order_number || order.id}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        <p>{order.payment_method || 'Razorpay'}</p>
                        <p className="mt-1 text-xs text-gray-500">{order.payment_status || 'Pending'}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{order.courier_name || 'Not assigned'}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{order.awb_number || '-'}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          <Truck className="mr-1.5 h-3.5 w-3.5" />
                          {order.shipment_status || 'Pending'}
                        </span>
                        {order.awb_number && (
                          <button
                            type="button"
                            onClick={() => refreshTracking(order.id)}
                            disabled={refreshingOrderId === order.id}
                            className="mt-2 flex items-center text-xs font-semibold text-gray-700 hover:text-black disabled:opacity-50"
                          >
                            <RefreshCw className={`mr-1 h-3.5 w-3.5 ${refreshingOrderId === order.id ? 'animate-spin' : ''}`} />
                            Update tracking
                          </button>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {order.tracking_url ? (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900"
                          >
                            Track
                            <ExternalLink className="ml-1 h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">Unavailable</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {order.shipping_label_url ? (
                          <a
                            href={order.shipping_label_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-black"
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Label
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">Not ready</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

