import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../redux/productSlice';

const ProductList = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div>
            <h2>Products</h2>
            <div className="product-list">
                {
                    products.map((product) => (
                        <div key={product._id} style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '10px' }}>
                            <Link to={`/products/${product._id}`}>
                                <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }} />
                                <h3>{product.name}</h3>
                            </Link>
                            <p>{product.description}</p>
                            <p><strong>Stock:</strong> {product.stock}</p>
                            <p><strong>${product.price}</strong></p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default ProductList;