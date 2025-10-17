let Product = require('../../models/productModel');

const createProductFAQ = async (req, res) => {
    try {
        let id = req.params.id;
        let { question, answer } = req.body;
        if (!question || !answer) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.userCaseFAQ.push({
            question,
            answer,
        });
        await product.save();
        res.json({ message: 'FAQ created successfully', status: 200, data: product, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { createProductFAQ };


