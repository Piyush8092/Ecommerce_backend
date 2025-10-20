let Order = require('../../models/orderModel');

const updateOrder = async (req, res) => {
    try {
        let id = req.params.id;
        let payload = req.body;
        if (!payload) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        let existOrder = await Order.findById(id);
        if (!existOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if(req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updatedOrder = await Order.findByIdAndUpdate({_id:id}, 
           payload
        , { new: true });
        res.json({ message: 'Order updated successfully', status: 200, data: updatedOrder, success: true, error: false });
    }
    
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { updateOrder };

