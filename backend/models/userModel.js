const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
         required: true,
        sparse: true,
    },
    phone: {
        type: Number,
         sparse: true,
         
    },
   
    role: {
        type: String,
        // order accept delete and fororder,  emplye => diplsy employ section 
        enum: ['GENERAL', 'ADMIN','order-manager','employee'],
        default: 'GENERAL'
    },
    token: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: true
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
}, { timestamps: true });

/**
 * Custom validation: require at least email or phone
 */
userSchema.pre('validate', function (next) {
    if (!this.email && !this.phone) {
        this.invalidate('email', 'Either email or phone is required');
        this.invalidate('phone', 'Either email or phone is required');
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
