let Order = require('../../models/orderModel');

const updateOrderStatusEmploye = async (req, res) => {
    try {
        let id = req.params.id;
        let {status} = req.body;
        let existOrder = await Order.findById(id);
        if (!existOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if(req.user.role !== 'EMPLOYEE' ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
if(existOrder.status !== 'ACCEPTED') {
    return res.status(400).json({ message: 'Order already accepted' });
}
if(status !== 'SHIPPED'  ) {
    return res.status(400).json({ message: 'Invalid status' });
}
        existOrder.status = 'SHIPPED';
        await existOrder.save();
        res.json({ message: 'Order accepted successfully', status: 200, data: existOrder, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { updateOrderStatusEmploye };


