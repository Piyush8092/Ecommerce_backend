let Wish = require("../../models/wishModel");

const deleteFromWishList = async (req, res) => {
  try {
    let userId = req.user._id;
    let { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const deletedWish = await Wish.findOneAndDelete({ userId, productId });
    res.json({
      message: "Wish deleted successfully",
      status: 200,
      data: deletedWish,
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

module.exports = { deleteFromWishList };
