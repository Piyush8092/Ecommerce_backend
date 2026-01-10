let mongoose = require("mongoose");

let carsoleSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
    },
    title: {
      type: String,
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
    isMobile: {
      type: Boolean,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = Carsole = mongoose.model("Carsole", carsoleSchema);
