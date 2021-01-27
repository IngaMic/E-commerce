import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const {
        user: { _id, name, email, role },
    } = isAuthenticated();

    const adminLinks = () => {
        return (
            <div className="card ml-lg-5">
                <h4 className="card-header">Admin Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/category">
                            Create Category
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/product">
                            Create Product
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/orders">
                            View Orders
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/products">
                            Manage Products
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    const adminInfo = () => {
        return (
            <div className="col-lg-8 offset-lg-2">
                <div className="card mb-lg-5">
                    <h3 className="card-header">User Information</h3>
                    <ul className="list-group">
                        <li className="list-group-item">{name}</li>
                        <li className="list-group-item">{email}</li>
                        <li className="list-group-item">
                            {role === 1 ? "Admin" : "Registered User"}
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`Hello ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-lg-3">{adminLinks()}</div>
                <div className="col-lg-9 mt-5 mb-5">{adminInfo()}</div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;