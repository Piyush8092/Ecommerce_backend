const shiprocketConfig = require("../../config/shiprocket.config");
const ShiprocketService = require("../../services/shiprocket.service");

/**
 * Check delivery availability & ETA by pincode
 * Responsibility:
 * - Validate input
 * - Call Shiprocket serviceability
 * - Normalize response for frontend
 * - Fail gracefully
 */
const checkPincodeDelivery = async (req, res) => {
  try {
    // 1. Read input (GET-friendly, REST-correct)
    const { pincode, cod = 0, weight } = req.query;

    // 2. Input validation (STRICT)
    if (!pincode) {
      return res.status(400).json({ message: "Pincode is required" });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: "Invalid pincode format" });
    }

    const shipmentWeight =
      Number(weight) > 0 ? Number(weight) : shiprocketConfig.options.weight;

    const codFlag = Number(cod) === 1 ? 1 : 0;

    // 3. Authenticated Shiprocket client
    const client = await ShiprocketService.getAuthenticatedClient();

    // 4. Call serviceability API
    const response = await client.get("/courier/serviceability", {
      params: {
        pickup_postcode: shiprocketConfig.defaultPickupLocation,
        delivery_postcode: pincode,
        cod: codFlag,
        weight: shipmentWeight,
        length: shiprocketConfig.options.length || 10,
        breadth: shiprocketConfig.options.breadth || 10,
        height: shiprocketConfig.options.height || 10,
        declared_value: shiprocketConfig.options.declaredValue || 500,
      },
    });

    const serviceData = response?.data?.data;

    // 5. Defensive checks
    const couriers = serviceData?.available_courier_companies || [];

    if (!couriers.length) {
      return res.json({
        deliverable: false,
        message: "Delivery not available at this pincode",
      });
    }

    // 6. Normalize courier data
    const deliveryDaysList = couriers
      .map((c) => Number(c.estimated_delivery_days))
      .filter((d) => !Number.isNaN(d));

    if (!deliveryDaysList.length) {
      return res.json({
        deliverable: false,
        message: "Delivery information unavailable",
      });
    }

    const minDays = Math.min(...deliveryDaysList);
    const maxDays = Math.max(...deliveryDaysList);

    // COD availability should be courier-based, not global
    const codAvailable = couriers.some((c) => c.cod === 1);

    // 7. Final frontend-safe response
    return res.json({
      deliverable: true,
      codAvailable,
      minDays,
      maxDays,
      message:
        minDays === maxDays
          ? `Delivery in ${minDays} days`
          : `Delivery in ${minDays}–${maxDays} days`,
    });
  } catch (error) {
    // 8. Graceful degradation (never break UX)
    console.error(
      "Shiprocket serviceability error:",
      error.response?.data || error.message
    );

    return res.json({
      deliverable: true,
      minDays: 4,
      maxDays: 7,
      message: "Estimated delivery in 4–7 days",
    });
  }
};

module.exports = { checkPincodeDelivery };
