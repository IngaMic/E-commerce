import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false,
    });

    const { categories, category, search, results, searched } = data;

    const loadCategories = async () => {
        try {
            const result = await getCategories();
            if (result.error) {
                console.log(result.error);
            } else {
                setData({ ...data, categories: result });
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const searchData = async () => {
        // console.log(search, category);
        if (search) {
            try {
                const response = await list({
                    search: search || undefined,
                    category: category,
                });
                if (response.error) {
                    console.log(response.error);
                } else {
                    setData({ ...data, results: response, searched: true });
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const searchSubmit = (e) => {
        e.preventDefault();
        searchData();
    };

    const handleChange = (name) => (event) => {
        setData({ ...data, [name]: event.target.value, searched: false });
    };

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            return `Search result: ${results.length} products`;
        }
        if (searched && results.length < 1) {
            return `No products found`;
        }
    };
    //for results passing the default of an empty array:
    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>

                <div className="row">
                    {results.map((product, i) => (
                        <div className="col-4 mb-3">
                            <Card key={i} product={product} />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text catDropdown1">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend catDropdown p-1">
                        <select
                            className="btn mr-2"
                            onChange={handleChange("category")}
                        >
                            <option value="All">All</option>
                            {categories.map((c, i) => (
                                <option key={i} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="search"
                        className="form-control catDropdown"
                        onChange={handleChange("search")}
                        placeholder="Search by name"
                    />
                </div>
                <div
                    className="btn input-group-appendcatDropdown"
                    style={{ border: "none" }}
                >
                    <button className="input-group-text submitBtn">
                        Search
                    </button>
                </div>
            </span>
        </form>
    );

    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    );
};

export default Search;
