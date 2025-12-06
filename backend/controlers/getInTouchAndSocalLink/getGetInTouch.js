let GetInTouch = require("../../models/GetInTouchModel");

const getGetInTouch = async (req, res) => {
  try {
    const getInTouch = await GetInTouch.find();
    res.json({
      message: "Get in touch fetched successfully",
      status: 200,
      data: getInTouch,
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

module.exports = { getGetInTouch };
