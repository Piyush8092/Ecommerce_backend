let mongoose = require('mongoose');

let subscriptionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
  email:{
        type: String,
        required: true,
    }
},
    { timestamps: true }

);

module.exports = Subscription = mongoose.model('Subscription', subscriptionSchema);


