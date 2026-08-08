import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";




const ProductDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const { isAuthenticated } = useSelector(
        (state) => state.auth
    );

    console.log("id" , id);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const response = await API.get(`/reviews/product/${id}`);
            setReviews(response.data.reviews);

        } catch (error) {
            console.log(error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await API.get(`/products/${id}`);
            setProduct(response.data.product);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2 className="text-2xl">
                    Loading Product...
                </h2>
            </div>
        );
    }


    if (!product) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-bold">
                    Product Not Found
                </h2>
            </div>
        );
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if(!isAuthenticated) {
            alert("Please login to write a review.");
            navigate("/login", {
                state: {
                    from: `/products/${id}`
                }
            });
            return;
        }

        try {
            await API.post(`/reviews/product/${id}`, {
                rating,
                comment,
            });

            alert("Review added successfully!");

            setRating(5);
            setComment("");

            fetchReviews();
            fetchProduct();

        } catch (error) {
            console.log(error.response?.data);
        }
    };


    const handleAddToCart = async () => {
        if(!isAuthenticated) {
            alert("Please login to add itmes to cart");

            navigate("/login", {
                state: {
                    from: `/products/${id}`,
                },
            });
            return
        }

        try {
            const response = await API.post("/cart", {
                product: product._id,
                quantity: 1,
            });

            const cartResponse = await API.get("/cart");
            dispatch(setCart(cartResponse.data.cart));

            alert(response.data.message);

        }
        catch (error) {
            alert(error.response?.data?.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="grid md:grid-cols-2 gap-12">

                {/* Left Side - Image */}

                <div>
                    <img
                        src={product?.image?.url || "placeholder-product.png"}
                        alt={product?.name || "Product"}
                        onError={(e) => {
                            e.currentTarget.src = "/placeholder-product.png"
                        }}
                        className="w-full rounded-xl shadow-lg"
                    />
                </div>


                {/* Right Side */}

                <div>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {product.category}
                    </span>

                    <h1 className="text-4xl font-bold mt-4">
                        {product.name}
                    </h1>

                    <h2 className="text-3xl text-green-600 font-bold mt-5">
                        ₹{product.price}
                    </h2>

                    <p className="mt-6 text-gray-600 leading-7">
                        {product.description}
                    </p>

                    <div className="mt-6">
                        {
                            product.stock > 0 ? (

                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                                    In Stock ({product.stock})
                                </span>

                            ) : (

                                <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full">
                                    Out of Stock
                                </span>

                            )
                        }
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="mt-8 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Add To Cart
                    </button>

                </div>
            </div>


            {/* all reviews */}
            <div className="mt-16">

                <h2 className="text-3xl font-bold mb-8">
                    Customer Reviews
                </h2>

                {
                    reviews.length === 0 ? (
                        <p className="text-gray-500">
                            No reviews yet.
                        </p>

                    ) : (

                        reviews.map((review) => (
                            <div
                                key={review._id}
                                className="border rounded-lg p-5 mb-4 shadow-sm"
                            >

                                <h3 className="font-semibold text-lg">
                                    {review.user.name}
                                </h3>

                                <p className="text-yellow-500 mt-1">
                                    {"⭐".repeat(review.rating)}
                                </p>

                                <p className="mt-3 text-gray-700">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    )
                }
            </div>


            {/* give review and comment */}

            <div className="mt-12 border rounded-lg p-6 shadow">

                <h2 className="text-2xl font-bold mb-6">
                    Write a Review
                </h2>

                <form onSubmit={handleReviewSubmit}>

                    <div className="mb-4">

                        <label className="block mb-2 font-medium">
                            Rating
                        </label>

                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="border rounded w-full p-3"
                        >
                            <option value={5}>5 ⭐</option>
                            <option value={4}>4 ⭐</option>
                            <option value={3}>3 ⭐</option>
                            <option value={2}>2 ⭐</option>
                            <option value={1}>1 ⭐</option>
                        </select>

                    </div>

                    <div className="mb-4">

                        <label className="block mb-2 font-medium">
                            Comment
                        </label>

                        <textarea
                            rows="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border rounded w-full p-3"
                            placeholder="Write your review..."
                        />

                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                    >
                        Submit Review
                    </button>

                </form>

            </div>
        </div>

        

        
        

        
    );
}

export default ProductDetails;