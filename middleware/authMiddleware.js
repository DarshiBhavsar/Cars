const JWT = require('jsonwebtoken');
const User = require('../models/userModel');


module.exports = async (req, resp, next) => {
    try {
        // Get token from req.headers
        const token = req.headers['authorization'].split(' ')[1];
        JWT.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                return resp.json({
                    status: false,
                    message: 'Unauthorized',
                });
            } else {
                // Check if user exists in the database
                const user = await User.findById(decode.id);
                if (!user) {
                    return resp.json({
                        status: false,
                        message: 'Unauthorized - Please provide correct token',
                    });
                }
                req.user.id = decode.id;
                next();
            }
        });
    } catch (error) {
        console.log(error);
        resp.json({
            status: false,
            message: 'Please provide auth token',
        });
    }
};
