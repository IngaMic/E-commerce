import React, { useState, useEffect } from "react";
import {
    getBraintreeClientToken,
    processPayment,
    createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import "braintree-web";
import DropIn from "braintree-web-drop-in-react";

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {},
        address: "",
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = async (userId, token) => {
        try {
            const result = await getBraintreeClientToken(userId, token);
            if (result.error) {
                // console.log(result.error);
                setData({ ...data, error: result.error });
            } else {
                setData({ clientToken: result.clientToken });
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getToken(userId, token);
    }, []);

    const handleAddress = (event) => {
        setData({ ...data, address: event.target.value });
    };

    const getTotal = () => {
        //Array reduce method [1.2.3] => 1+2+3
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        );
    };

    let deliveryAddress = data.address;

    const buy = () => {
        setData({ loading: true });
        // send the nonce to server
        // nonce = data.instance.requestPaymentMethod()
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then((data) => {
                // console.log(data);
                nonce = data.nonce;
                // once nonce is set (card type, card number) -> sending nonce as 'paymentMethodNonce'

                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products),
                };

                processPayment(userId, token, paymentData)
                    .then((response) => {
                        console.log(response);
                        // empty cart
                        // create order

                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress,
                        };
                        //before clearing the inputs creating Order

                        createOrder(userId, token, createOrderData)
                            .then((response) => {
                                emptyCart(() => {
                                    setRun(!run); // run useEffect in parent Cart
                                    console.log(
                                        "payment success and empty cart"
                                    );
                                    setData({
                                        loading: false,
                                        success: true,
                                    });
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                setData({ loading: false });
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                        setData({ loading: false });
                    });
            })
            .catch((error) => {
                // console.log("dropin error: ", error);
                setData({ ...data, error: error.message });
            });
    };

    const showDropIn = () => (
        //onBlur -> taking the error off-screen when typing for UX
        <div onBlur={() => setData({ ...data, error: "" })}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Your delivery address"
                        />
                    </div>

                    <DropIn
                        options={{
                            authorization: data.clientToken,
                            paypal: {
                                flow: "vault",
                            },
                        }}
                        onInstance={(instance) => (data.instance = instance)}
                    />
                    <button
                        onClick={buy}
                        className="btn btn-success btn-block pay"
                    >
                        Pay
                    </button>
                </div>
            ) : null}
        </div>
    );

    const showError = (error) => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const showSuccess = (success) => (
        <div
            className="alert alert-info"
            style={{ display: success ? "" : "none" }}
        >
            Thanks! Your payment was successful!
        </div>
    );

    const showLoading = (loading) =>
        loading && <h2 className="text-danger">Loading...</h2>;

    return (
        <div className="mt-5">
            <h2 className="mt-5">Total: € {getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    );
};

export default Checkout;
