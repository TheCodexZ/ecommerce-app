import { Link } from "react-router-dom"

const ProductCart = ({product}) => {
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <img src={product.image?.url || "placeholder-product.png"} 
                alt="product" 
                onError={(e) => {
                    e.currentTarget.src = "placeholder-product.png"
                }}
                className="w-full h-52 object-cover rounded" 
            />

            <h2 className="text-xl font-bold mt-3">
                {product.name}
            </h2>

            <p className="text-gray-600">
                {product.price}
            </p>

            <Link
                to={`/products/${product._id}`}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                View Details
            </Link>
        </div>
    );
}

export default ProductCart;