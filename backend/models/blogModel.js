let mongoose = require("mongoose");

let blogSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    catagory: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    faq: [
      {
        question: {
          type: String,
          required: false,
        },
        answer: {
          type: String,
          required: false,
        },
      },
    ],
    productLink: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = Blog = mongoose.model("Blog", blogSchema);
