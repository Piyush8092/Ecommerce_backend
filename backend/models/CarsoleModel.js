let mongoose = require('mongoose');

let carsoleSchema = new mongoose.Schema({

        heading:{
            type:String,
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        image:{
            type:String,
            required:true,
        },
        catagory:{
            type:String,
            required:true,
        },
        link:{
            type:String,
            required:false,
        }
    },
    { timestamps: true }
);

module.exports = Carsole = mongoose.model('Carsole', carsoleSchema);

