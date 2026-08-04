import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from '../config/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  stock: '',
  active: true,
  featured: false,
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const [productsResponse, usersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/products`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE_URL}/api/admin/users`, { headers: getAuthHeaders() }),
      ]);
      setProducts(productsResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load admin data');
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole !== 'admin') {
      navigate('/home');
      return;
    }

    loadData();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      active: Boolean(form.active),
      featured: Boolean(form.featured),
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/Products/${editingId}`, payload, { headers: getAuthHeaders() });
        setMessage('Product updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/Products`, payload, { headers: getAuthHeaders() });
        setMessage('Product created successfully');
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      image: product.image || '',
      stock: product.stock || '',
      active: Boolean(product.active),
      featured: Boolean(product.featured),
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/Products/${productId}`, { headers: getAuthHeaders() });
      setMessage('Product deleted');
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete product');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <h2>Admin Panel</h2>
      {message ? <p>{message}</p> : null}

      <form onSubmit={handleSubmit} style={{ marginBottom: '24px', display: 'grid', gap: '10px' }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required />

        <label>
          <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
          Active
        </label>

        <label>
          <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
          Featured
        </label>

        <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
      </form>

      <section style={{ marginBottom: '24px' }}>
        <h3>All Products</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {products.map((product) => (
            <div key={product._id} style={{ border: '1px solid #ddd', padding: '12px' }}>
              <strong>{product.name}</strong> - ${product.price} - Stock: {product.stock} - Featured: {product.featured ? 'Yes' : 'No'}
              <div style={{ marginTop: '8px' }}>
                <button onClick={() => handleEdit(product)} style={{ marginRight: '8px' }}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>All User Names</h3>
        <ul>
          {users.map((user) => (
            <li key={user.username}>{user.username}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
