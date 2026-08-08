import ProductCart from "../components/ProductCart";
import { useEffect } from "react";
import API from "../services/axios"
import { useState } from "react";

const Home = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProducts = async () => {
            try {

                const response = await API.get("/products");
                setProducts(response.data.products);

            } 
            catch (error) {
                console.log(error);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchProducts();

    },[]);

    if (loading) {
        return (

            <div className="flex justify-center items-center h-screen">
                <h2 className="text-2xl font-semibold">

                    Loading Products...

                </h2>
            </div>
        );
    }
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            {/* Hero Section */}
            <section className="text-center py-20">

                <span className="text-blue-600 font-semibold uppercase tracking-wider">
                    Welcome to Our Store
                </span>

                <h1 className="text-5xl md:text-6xl font-bold mt-4 leading-tight">
                    Find Everything <br />
                    You Need
                </h1>

                <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
                    Shop from thousands of products with amazing prices,
                    secure payments and fast delivery.
                </p>

                <button className="mt-10 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition">
                    Shop Now
                </button>

            </section>


            {/* Featured Products */}
            <section>
                <div className="flex justify-between items-center mb-8">
                    
                    <h2 className="text-3xl font-bold">
                        Featured Products
                    </h2>
                    
                    <button className="text-blue-600 hover:underline">
                        View All
                    </button>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        products.length === 0 ? (
                            <div>
                                <h2>
                                    No Products Found
                                </h2>
                            </div>
                        ): (
                            products.map(product => (
                                <ProductCart
                                    key={product._id}
                                    product={product}
                                />
                            ))
                        )
                    }
                </div>
            </section>

        
        </div>
    )
}

export default Home;