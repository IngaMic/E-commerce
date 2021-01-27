import React, { useState } from "react";

const Checkbox = ({ categories, handleFilters }) => {
    const [checked, setCheked] = useState([]);

    //function returning other function, syntax:
    const handleToggle = (c) => () => {
        //returning the first index or -1
        const currentCategoryId = checked.indexOf(c);
        const newCheckedCategoryId = [...checked];
        // if currently checked was not in checked state > push
        // else pull
        if (currentCategoryId === -1) {
            //this categoty is not in the state
            newCheckedCategoryId.push(c);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        // console.log(newCheckedCategoryId);
        setCheked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    };

    return categories.map((c, i) => (
        <li key={i} className="list-unstyled">
            <input
                onChange={handleToggle(c._id)}
                value={checked.indexOf(c._id === -1)}
                type="checkbox"
                className="form-check-input checkboxes"
            />
            <label className="form-check-label">{c.name}</label>
        </li>
    ));
};

export default Checkbox;
