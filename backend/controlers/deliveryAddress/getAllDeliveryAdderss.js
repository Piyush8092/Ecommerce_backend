let DeliveryAddress = require('../../models/deliveryAddressModel');

const getAllDeliveryAdderss = async (req, res) => {
    try {
        let userId = req.user._id;
        const deliveryAddress = await DeliveryAddress.find({userId});
        res.json({ message: 'Delivery address fetched successfully', status: 200, data: deliveryAddress, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getAllDeliveryAdderss };



