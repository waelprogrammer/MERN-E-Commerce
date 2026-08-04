import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProductDetail = () => {
    const { id } = useParams();
    const product = useSelector((state) =>
        state.products.products.find((p) => String(p._id) === id)
    );

    if (!product) return <p>Product not found</p>;

    return (
        <div>
            <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>${product.price}</strong></p>
        </div>
    );
};

export default ProductDetail;

