import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/productSlice';

const ProductList = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);
    const safeProducts = Array.isArray(products) ? products : [];

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div>
            <h2>Products</h2>
            <div className="product-list">
                {safeProducts.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '10px' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>${product.price}</strong></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;