import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (itemId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders(); // Refresh list to reflect latest changes
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading) return <div className="text-slate-500">Loading orders...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Orders</h1>
        <p className="text-slate-500 mt-1">Review your recent orders and update fulfillment statuses.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        {orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
               <ShoppingCart className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-slate-500 font-medium">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Customer</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Items</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Total</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    key={order.order_id} 
                    className="hover:bg-slate-50 transition-colors group align-top"
                  >
                    <td className="px-6 py-6 border-b border-slate-100">
                      <p className="font-bold text-slate-800">{order.customer_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100">
                      <div className="space-y-4">
                        {order.items.map(item => (
                          <div key={item.item_id} className="flex gap-4">
                            {item.image_url ? (
                              <img src={item.image_url} alt="" className="w-12 h-12 rounded bg-slate-100 object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-700">{item.product_name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                                <select 
                                  value={item.item_status}
                                  onChange={(e) => updateStatus(item.item_id, e.target.value)}
                                  className={`text-xs px-2.5 py-1 rounded-full font-bold outline-none border-0 ${
                                    item.item_status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                    item.item_status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                    item.item_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100 font-bold text-emerald-600">
                      {formatPrice(order.seller_total)}
                    </td>
                    <td className="px-6 py-6 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Date: {new Date(order.order_date).toLocaleDateString()}</p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
