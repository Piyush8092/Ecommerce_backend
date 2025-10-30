let userModel = require('../../models/userModel');

const updateUserSelf = async (req, res) => {
    try {           
        let id = req.user._id;
        let payload = req.body;
        let ExistUser = await userModel.findById(id);
        if (!ExistUser) {
            return res.status(404).json({message: 'User not found'});
        }
        const result = await userModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
        
        res.json({
            message: 'User updated successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });

    }
    catch (e) {
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
};

module.exports = { updateUserSelf };


