import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts } from '../../redux/productSlice';

const FeaturedProducts = () => {
    const dispatch = useDispatch();
    const featured = useSelector((state) => state.products.featured);

    useEffect(() => {
        dispatch(fetchFeaturedProducts());
    }, [dispatch]);

    return (
        <div>
            <h2>Featured Products</h2>
            <div className="featured-products">
                {
                    featured.map((product) => (
                        <div key={product._id} style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '10px' }}>
                            <Link to={`/products/${product._id}`}>
                                <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover' }} />
                                <h3>{product.name}</h3>
                            </Link>
                            <p>{product.description}</p>
                            <p><strong>${product.price}</strong></p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default FeaturedProducts;