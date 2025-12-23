const mongoose = require("mongoose");

const contactSchama = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  // for not having phone no at this time i left but i will return
  phone: {
    type: Number,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
});

const ContactModel = mongoose.model("ContactModel", contactSchama);

module.exports = ContactModel;
