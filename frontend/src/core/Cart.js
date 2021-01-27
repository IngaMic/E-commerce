import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import Checkout from "./Checkout";

const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const showItems = (items) => {
        return (
            <div className="col-lg-12 ml-lg-5">
                <h2>Your cart has {`${items.length}`} items</h2>
                <hr />
                {items.map((product, i) => (
                    <Card
                        key={i}
                        product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun}
                        run={run}
                    />
                ))}
            </div>
        );
    };

    const noItemsMessage = () => (
        <div className="offset-2">
            <h2 className="ml-lg-5">
                <strong>Your cart is empty.</strong> <br />{" "}
                <small>
                    <Link to="/shop">Back to the shop</Link>
                </small>
            </h2>
        </div>
    );

    return (
        <Layout
            title="Shopping Cart"
            description="Manage your cart items. Add, remove, checkout or continue shopping."
            className="container-fluid"
        >
            <div className="row">
                <div className="col-lg-6 mt-sm-5">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>

                <div className="col-lg-4 offset-lg-1 mt-lg-4">
                    <h2 className="mb-4 mt-5">Your cart summary</h2>
                    <hr />
                    <Checkout products={items} setRun={setRun} run={run} />
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
