require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./Route/router');
 const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB=require('./DB/connnection');
// Increase payload size limit
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
app.use(cors({
  origin: ["https://www.softerint.com","http://localhost:5173","https://localhost:5173"  ], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.use('/api', router);

connectDB(); 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
