const User = require("../models/user");
exports.userById = (req, res, ext, id) => {
    User.findById(id).exet((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        req.profile = user;
        next();
    });
};
