import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    const loadProductsBySell = async () => {
        try {
            const result = await getProducts("sold");
            if (result.error) {
                setError(result.error);
            } else {
                setProductsBySell(result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadProductsByArrival = async () => {
        try {
            const result = await getProducts("createdAt");
            if (result.error) {
                setError(result.error);
            } else {
                setProductsByArrival(result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    return (
        <Layout
            title="Welcome"
            description="Feel free to look around and click some buttons"
            className="container-fluid ml-lg-1 w-100"
        >
            <Search />
            <h2 className="mb-4 ml-lg-3">New Arrivals</h2>
            <div className="row mt-5">
                {productsByArrival.map((product, i) => (
                    <div key={i} className="col-lg-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>

            <h2 className="mb-5 mt-5 ml-lg-3">Best Sellers</h2>
            <div className="row">
                {productsBySell.map((product, i) => (
                    <div key={i} className="col-lg-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Home;
