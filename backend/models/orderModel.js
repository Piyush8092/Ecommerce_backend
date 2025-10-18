let mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deliveryAddressId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryAddress',
        required: true,
    },
    productId:
        [{
            type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        }],
    
    status:{
        type: String,
        enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED','ACCEPTED'],
        default: 'PENDING',
    },
    paymentMethod:{
        type: String,
        enum: ['CASH', 'CARD', 'UPI'],
        default: 'CASH',
    },
    totalAmount:{
        type: Number,
        required: true,
    },
    paymentStatus:{
        type: String,
        enum: ['PAID', 'UNPAID'],
        default: 'UNPAID'
    },
},
    { timestamps: true }

);

module.exports = Order = mongoose.model('Order', orderSchema);

