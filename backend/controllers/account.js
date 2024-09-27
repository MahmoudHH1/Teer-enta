const User = require('../models/Users/User');
const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({message: 'Invalid user id'});
        }
        const user = await User.findOne(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({message: 'User deleted successfully'});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.createAccount = async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).send({message: 'User created successfully.'});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}