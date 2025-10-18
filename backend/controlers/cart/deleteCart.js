let Cart = require('../../models/cartModel');

const deleteCart = async (req, res) => {
    try {
        let id = req.params.id;
        let existCart = await Cart.findById(id);
        if (!existCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        if(req.user.role !== 'ADMIN' && req.user._id.toString()!== existCart.userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const deletedCart = await Cart.findByIdAndDelete(id);
        res.json({ message: 'Cart deleted successfully', status: 200, data: deletedCart, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { deleteCart };



