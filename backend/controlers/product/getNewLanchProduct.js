let Product = require('../../models/productModel');

const getNewLaunchProduct = async (req, res) => {
    try {
        // Calculate the date 7 days ago from now
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Find all products created in the last 7 days
        const products = await Product.find({
            createdAt: { $gte: oneWeekAgo } // greater than or equal to 1 week ago
        })
        .sort({ createdAt: -1 }) // newest first
        .limit(10);

        res.json({
            message: 'Newly launched products fetched successfully',
            status: 200,
            data: products,
            success: true,
            error: false
        });
    } catch (e) {
        res.json({
            message: 'Something went wrong',
            status: 500,
            data: e,
            success: false,
            error: true
        });
    }
};

module.exports = { getNewLaunchProduct };



