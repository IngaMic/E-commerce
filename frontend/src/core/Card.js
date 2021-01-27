import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment"; //for a user friendly timestamp
import { addItem, updateItem, removeItem } from "./cartHelpers";

const Card = ({
    product,
    showViewProductButton = true,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false,
    setRun = (f) => f,
    run = undefined,
    // changeCartSize
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);

    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`} className="mr-2">
                    <button className="btn viewProduct mt-2 mb-2 card-btn-1">
                        View Product
                    </button>
                </Link>
            )
        );
    };
    const addToCart = () => {
        // console.log('added');
        addItem(product, setRedirect(true));
    };

    const shouldRedirect = (redirect) => {
        if (redirect) {
            return <Redirect to="/cart" />;
        }
    };

    const showAddToCartBtn = (showAddToCartButton, prodQ) => {
        if (prodQ < 1) {
            return (
                <button className="btn mt-2 mb-2 card-btn-1 text-muted back-soon">
                    Coming Back Soon!
                </button>
            );
        }
        return (
            showAddToCartButton && (
                <button
                    onClick={addToCart}
                    className="btn addToCart mt-2 mb-2 card-btn-1"
                >
                    Add to cart
                </button>
            )
        );
    };

    const showStock = (quantity) => {
        return quantity > 0 ? (
            <span className="badge inStock badge-pill">In Stock </span>
        ) : (
            <span className="badge outStock badge-pill">Out of Stock </span>
        );
    };

    const handleChange = (productId) => (event) => {
        //productId -> increasing quantity of this product
        setRun(!run); // run useEffect in parent component
        //when runs, making sure quantity is not 0, but starting at 1
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
            updateItem(productId, event.target.value);
        }
    };

    const showCartUpdateOptions = (cartUpdate) => {
        return (
            cartUpdate && (
                <div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Quantity: </span>
                        </div>
                        <input
                            type="number"
                            className="form-control"
                            value={count}
                            onChange={handleChange(product._id)}
                        />
                    </div>
                </div>
            )
        );
    };
    const showRemoveButton = (showRemoveProductButton) => {
        return (
            showRemoveProductButton && (
                <button
                    onClick={() => {
                        removeItem(product._id);
                        setRun(!run); // run useEffect in parent Cart
                    }}
                    className="btn btn-outline-danger mt-2 mb-2"
                >
                    Remove Product
                </button>
            )
        );
    };
    return (
        <div className="card ">
            <div className="card-header card-header-1 ">{product.name}</div>
            <div className="card-body">
                {shouldRedirect(redirect)}
                <ShowImage item={product} url="product" />
                {/* substring to shorten the description => handling page layout:*/}
                <p className="card-p  mt-2">
                    {product.description.substring(0, 40)}
                    {" . . . "}
                </p>
                <p className="card-p black-10"> € {product.price}</p>
                <p className="black-9">
                    Category: {product.category && product.category.name}
                </p>
                <p className="text-muted">
                    <small>Added {moment(product.createdAt).fromNow()}</small>{" "}
                </p>
                {showStock(product.quantity)}
                <br />

                {showViewButton(showViewProductButton)}

                {showAddToCartBtn(showAddToCartButton, product.quantity)}

                {showRemoveButton(showRemoveProductButton)}

                {showCartUpdateOptions(cartUpdate)}
            </div>
        </div>
    );
};

export default Card;
