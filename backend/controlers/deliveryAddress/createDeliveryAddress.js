let DeliveryAddress = require('../../models/deliveryAddressModel');

const createDeliveryAddress = async (req, res) => {
    try {
        let userId = req.user._id;
        let name = req.user.name;
        let email = req.user.email;
        let {  phoneNo, optionalPhoneNo, Address, landmark, city, state, zip } = req.body;
        if (!name || !email || !Address || !city || !state || !zip) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Create new delivery address
        const newDeliveryAddress = new DeliveryAddress({
            userId,
            name,
            email,
            phoneNo,
            optionalPhoneNo,
            Address,
            landmark,
            city,
            state,
            zip,
        });

          const savedDeliveryAddress = await newDeliveryAddress.save();
          
        res.json({ message: 'Delivery address created successfully', status: 200, data: savedDeliveryAddress, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { createDeliveryAddress };

