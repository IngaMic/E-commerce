import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";

const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] },
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);

    const init = async () => {
        try {
            const result = await getCategories();
            if (result.error) {
                setError(result.error);
            } else {
                setCategories(result);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadFilteredResults = async (newFilters) => {
        // console.log(newFilters);
        try {
            const result = await getFilteredProducts(skip, limit, newFilters);
            if (result.error) {
                setError(result.error);
            } else {
                setFilteredResults(result.data);
                setSize(result.size);
                setSkip(0);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadMore = async () => {
        let toSkip = skip + limit;

        try {
            const result = await getFilteredProducts(
                toSkip,
                limit,
                myFilters.filters
            );
            if (result.error) {
                setError(result.error);
            } else {
                setFilteredResults([...filteredResults, ...result.data]);
                setSize(result.size);
                setSkip(toSkip);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        );
    };

    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilters.filters);
    }, []);

    const handleFilters = (filters, filterBy) => {
        // console.log("SHOP", filters, filterBy);
        const newFilters = { ...myFilters };
        newFilters.filters[filterBy] = filters;

        if (filterBy === "price") {
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }
        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    };

    const handlePrice = (value) => {
        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    };

    return (
        <Layout
            title="Shop Page"
            description="Nice to see you!"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-lg-3 ml-lg-4 mt-5">
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox
                            categories={categories}
                            handleFilters={(filters) =>
                                handleFilters(filters, "category")
                            }
                        />
                    </ul>

                    <h4>Filter by price range</h4>
                    <div>
                        <RadioBox
                            prices={prices}
                            handleFilters={(filters) =>
                                handleFilters(filters, "price")
                            }
                        />
                    </div>
                </div>

                <div className="col-lg-8">
                    <h2 className="mb-4 mt-3">Products</h2>
                    <div className="row">
                        {filteredResults.map((product, i) => (
                            <div key={i} className="col-lg-4 mb-3">
                                <Card product={product} />
                            </div>
                        ))}
                    </div>
                    <hr />
                    {loadMoreButton()}
                </div>
            </div>
        </Layout>
    );
};

export default Shop;
