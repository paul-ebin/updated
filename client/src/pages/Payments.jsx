import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch('/api/payments', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        if (res.status === 401) {
          navigate('/login');
          return;
        }
        const data = await res.json();
        setPayments(data);
      } catch (error) {
        console.error('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [navigate]);

  if (loading) return <div className="text-slate-500">Loading payments...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments Hub</h1>
        <p className="text-slate-500 mt-1">Track your pending payouts and historical earnings.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        {payments.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
               <CreditCard className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-slate-500 font-medium">No payment records found.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Payment ID</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Amount</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                  key={payment._id} 
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 text-slate-500 font-medium">#{payment._id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{formatPrice(payment.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      payment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      payment.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
