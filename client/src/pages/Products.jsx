import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', quantity: '', category: '', description: '', image_url: '' });
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [navigate]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        quantity: editingProduct.quantity,
        category: editingProduct.category || '',
        description: editingProduct.description || '',
        image_url: editingProduct.image_url || ''
      });
      setIsModalOpen(true);
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ name: '', price: '', quantity: '', category: '', description: '', image_url: '' });
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', quantity: '', category: '', description: '', image_url: '' });
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-slate-500">Loading products...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products Inventory</h1>
          <p className="text-slate-500 mt-1">Manage all your products, pricing, and stock levels.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((product, idx) => (
          <motion.div 
            key={product._id} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 group relative hover:shadow-md transition-shadow"
          >
            <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 z-20">
               <button onClick={() => setEditingProduct(product)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"><Edit2 className="w-4 h-4" /></button>
               <button onClick={() => handleDelete(product._id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
            </div>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            ) : (
              <div className="w-full h-48 bg-slate-100 rounded-xl mb-4 flex items-center justify-center">
                 <Package className="w-10 h-10 text-slate-300" />
              </div>
            )}
            <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-slate-500 mb-3">{product.category}</p>
            <div className="flex items-center justify-between mt-2">
               <span className="text-lg font-black text-blue-600">{formatPrice(product.price)}</span>
               <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${product.quantity > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {product.quantity} in stock
               </span>
            </div>
          </motion.div>
        ))}
        {products.length === 0 && (
          <div className="col-span-12 text-center p-12 bg-white/50 border border-slate-200 border-dashed rounded-2xl">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No products found. Add your first product!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}></div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-6 h-6"/></button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (USD)</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                    <input type="number" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                  <div className="flex gap-3 items-center">
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const formDataPayload = new FormData();
                      formDataPayload.append('image', file);
                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formDataPayload
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setFormData({...formData, image_url: data.imageUrl});
                        } else {
                          alert(data.message || 'Upload failed');
                        }
                      } catch (err) {
                        console.error(err);
                        alert('Upload failed');
                      }
                    }} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Preview" className="w-12 h-12 rounded object-cover border border-slate-200" />
                    )}
                  </div>
               </div>
               <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors mt-2">{editingProduct ? 'Update Product' : 'Create Product'}</button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
