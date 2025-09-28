require('dotenv').config()
const express = require('express');
let app=express();
let cookieParser = require('cookie-parser');
let cors = require('cors');
const port = process.env.PORT || 3000;  
const passport = require('passport');
 
 app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(
    {
        origin: ['http://localhost:3000','*'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        header: ['Content-Type', 'Authorization']

    }
));

 
app.use(require('./Route/router'))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
