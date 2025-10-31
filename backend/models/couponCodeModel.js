let mongoose = require('mongoose');

let couponCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    
},
    { timestamps: true }

);

module.exports = CouponCode = mongoose.model('CouponCode', couponCodeSchema);

