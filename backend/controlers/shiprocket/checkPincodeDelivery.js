const shiprocketConfig = require("../../config/shiprocket.config");
const ShiprocketService = require("../../services/shiprocket.service");

const checkPincodeDelivery = async (req, res) => {
  try {
    const {
      pincode,
      cod = 0,
      weight = shiprocketConfig.options.weight,
    } = req.body;

    if (!pincode) {
      return res.status(400).json({ message: "Pincode is required" });
    }

    const client = await ShiprocketService.getAuthenticatedClient();

    const response = await client.get("/courier/serviceability", {
      params: {
        pickup_postcode: shiprocketConfig.defaultPickupLocation, // Default pickup postcode (default: 122001)
        delivery_postcode: pincode,
        cod,
        weight,
      },
    });

    const data = response.data;

    if (!data.data.available_courier_companies?.length) {
      return res.json({
        deliverable: false,
        message: "Delivery not available at this pincode",
      });
    }

    console.log("pincodeDelivery", data.data);

    return res.json({
      deliverable: true,
      codAvailable: data.data.cod,
      estimatedDays:
        data.data.available_courier_companies[0].estimated_delivery_days,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Failed to check pincode" });
  }
};

module.exports = { checkPincodeDelivery };
