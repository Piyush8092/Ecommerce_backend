let DeliveryAddress = require('../../models/deliveryAddressModel');

const deleteDeliveryAddress = async (req, res) => {
    try {
        let id = req.params.id;
        let existAddress = await DeliveryAddress.findById(id);
        if (!existAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        if(req.user.role !== 'ADMIN' && req.user._id.toString()!== existAddress.userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const deletedAddress = await DeliveryAddress.findByIdAndDelete(id);
        res.json({ message: 'Address deleted successfully', status: 200, data: deletedAddress, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { deleteDeliveryAddress };



