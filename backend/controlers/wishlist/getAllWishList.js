let Wish = require("../../models/wishModel");

const getAllWishList = async (req, res) => {
  try {
    let userId = req.user._id;
    let wish = await Wish.find({ userId }).populate(
      "productId",
      "name price image description category discount stock limit "
    );
    res.json({
      message: "Wish fetched successfully",
      status: 200,
      data: wish,
      success: true,
      error: false,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true,
    });
  }
};

module.exports = { getAllWishList };
