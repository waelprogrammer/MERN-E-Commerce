import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Pages/Home';
import ProductList from './components/Product/ProductList';
import FeaturedProducts from './components/Product/FeaturedProducts';
import ProductDetail from './components/Product/ProductDetail';
import AdminPanel from './Admin/AdminPanel';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/featured" element={<FeaturedProducts />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
