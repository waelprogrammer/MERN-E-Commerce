import FeaturedProducts from '../Product/FeaturedProducts';
import ProductList from '../Product/ProductList';


const Home = () => {
    return (
        <div>
            <h1>Welcome to Our Store</h1>
            <FeaturedProducts />
            <ProductList />
        </div>
    );
}
export default Home;