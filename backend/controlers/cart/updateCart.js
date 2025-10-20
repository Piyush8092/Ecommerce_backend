let Cart = require('../../models/cartModel');

const updateCart = async (req, res) => {
    try {

        let id = req.params.id;
        let payload = req.body;
        if (!payload) {
            
            return res.status(400).json({ message: 'All fields are required' });
        }

        let existCart = await Cart.findById(id);
        if (!existCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        if(req.user.role !== 'ADMIN' && req.user._id.toString()!== existCart.userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updatedCart = await Cart.findByIdAndUpdate({_id:id}, 
           payload
        , { new: true });
        res.json({ message: 'Cart updated successfully', status: 200, data: updatedCart, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { updateCart };



