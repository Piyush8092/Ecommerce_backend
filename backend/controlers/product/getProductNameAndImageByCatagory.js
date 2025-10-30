let Product = require('../../models/productModel');

const getProductNameAndImageByCatagory = async (req, res) => {
    try {
        const products = await Product.find({}, 'catagory image name')
            .lean();

        // Filter unique categories
        const uniqueProducts = [];
        const seenCategories = new Set();

        for (const item of products) {
            if (!seenCategories.has(item.catagory)) {
                seenCategories.add(item.catagory);
                uniqueProducts.push({
                    name: item.name,
                    catagory: item.catagory,
                    image: item.image && item.image.length > 0 ? item.image[0] : null
                });
            }
        }

        res.json({
            message: 'Unique category products fetched successfully',
            status: 200,
            data: uniqueProducts,
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

module.exports = { getProductNameAndImageByCatagory };
