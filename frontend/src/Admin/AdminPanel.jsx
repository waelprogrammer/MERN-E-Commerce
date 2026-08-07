import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from '../config/api';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [productsResponse, usersResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/admin/products`, { headers: getAuthHeaders() }),
      axios.get(`${API_BASE_URL}/admin/users`, { headers: getAuthHeaders() }),
    ]);
    setProducts(productsResponse.data);
    setUsers(usersResponse.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name,
      description,
      price: Number(price),
      image,
      stock: Number(stock),
    };

    if (editingId) {
      await axios.put(`${API_BASE_URL}/admin/products/${editingId}`, payload, { headers: getAuthHeaders() });
    } else {
      await axios.post(`${API_BASE_URL}/admin/products`, payload, { headers: getAuthHeaders() });
    }

    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setStock('');
    setEditingId(null);
    await loadData();
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setImage(product.image);
    setStock(product.stock);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    await axios.delete(`${API_BASE_URL}/admin/products/${productId}`, { headers: getAuthHeaders() });
    await loadData();
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
      </form>

      <section>
        <h3>All Products</h3>
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <strong>{product.name}</strong> - ${product.price} - Stock: {product.stock}
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>All Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.username} - {user.role}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
