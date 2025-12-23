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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    contentHTML: { type: String }, // Storing Tiptap HTML output
    contentJSON: { type: mongoose.Schema.Types.Mixed },
    productLink: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = Blog = mongoose.model("Blog", blogSchema);
