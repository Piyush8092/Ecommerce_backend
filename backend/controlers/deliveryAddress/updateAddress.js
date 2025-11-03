let DeliveryAddress = require('../../models/deliveryAddressModel');

const updateAddress = async (req, res) => {
    try {
        let id = req.params.id;
        let payload = req.body;
        
        if (!payload) {
            return res.status(400).json({ message: 'All fields are required' });
        }

let existAddress = await DeliveryAddress.findById(id);
if (!existAddress) {
    return res.status(404).json({ message: 'Address not found' });
}
 if(req.user.role !== 'ADMIN' && req.user._id.toString()!== existAddress.userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

if(payload.isDefault){
let existDefaultAddress = await DeliveryAddress.findOne({userId: req.user._id, isDefault: true});
if(existDefaultAddress){
    existDefaultAddress.isDefault = false;
    await existDefaultAddress.save();
}
}
        const updatedAddress = await DeliveryAddress.findByIdAndUpdate({_id:id}, 
           payload
        , { new: true });
        res.json({ message: 'Address updated successfully', status: 200, data: updatedAddress, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { updateAddress };


