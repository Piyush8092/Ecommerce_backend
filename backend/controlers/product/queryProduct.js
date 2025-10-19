let Product = require('../../models/productModel');

const queryProduct = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let searchConditions = {};

        if (query) {
            const numericQuery = Number(query);

            // Build a flexible search with $or
            searchConditions = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { catagory: { $regex: query, $options: 'i' } },
                    ...(isNaN(numericQuery) ? [] : [
                        { price: numericQuery },
                        { stock: numericQuery },
                        { discount: numericQuery }
                    ])
                ]
            };
        }

        const products = await Product.find(searchConditions)
            .skip(skip)
            .limit(Number(limit));

        res.json({
            message: 'Products fetched successfully',
            status: 200,
            data: products,
            success: true,
            error: false
        });

    } catch (e) {
        console.error(e);
        res.json({
            message: 'Something went wrong',
            status: 500,
            data: e,
            success: false,
            error: true
        });
    }
};

module.exports = { queryProduct };
