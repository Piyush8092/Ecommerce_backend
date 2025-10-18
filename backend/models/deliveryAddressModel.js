let mongoose = require('mongoose');

let deliveryAddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phoneNo:{
        type: Number,
        // required: true,
    },
    optionalPhoneNo:{
        type: Number,
        required: false,
    },
    Address:{
        type: String,
        required: true,
    },
    landmark:{
        type: String,
        required: false,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    zip:{
        type: Number,
        required: true,
    }
    },
    { timestamps: true }
);

module.exports = DeliveryAddress = mongoose.model('DeliveryAddress', deliveryAddressSchema);

