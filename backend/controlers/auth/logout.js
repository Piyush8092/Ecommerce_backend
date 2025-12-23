const user = require("../../models/userModel");
const LogoutRout = async (req, res) => {
  try {
    // Clear the jwt cookie with the same options used when setting it
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    // Also clear adminToken cookie if it exists
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({
      message: "Logout successful",
      status: 200,
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

module.exports = { LogoutRout };
