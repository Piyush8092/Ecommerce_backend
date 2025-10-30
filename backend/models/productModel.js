let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },


    image: [{
        type: String,
        required: true,
    }],
    price:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    catagory:{
        type: String,
        required: true,
    },
    discount:{
        type: Number,
        required: false,
    },
    stock:{
        type: Number,
        required: true,
    },
    limit:{
        type: Number,
        required: true,
        default: 1,
    },

    comments:[{
        comment:{
            type: String,
            required: false,
        },
        rating:{
            type: Number,
            required: false,
        },
        // reviews:{
        //     type: String,
        //     required: false,
        // },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    }],
    Availability:{
        type: String,
        enum: ['AVAILABLE', 'OUT_OF_STOCK'],
        default: 'AVAILABLE',
    },
    userCaseFAQ:[
        {
            question:{
                type: String,
                required: false,
            },
            answer:{
                type: String,
                required: false,
            }
        }
    ]
    },
    // color:{

    // },
    // size:{

    // }

    { timestamps: true }
);

module.exports = Product = mongoose.model('Product', productSchema);
