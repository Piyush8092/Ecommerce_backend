let Product = require('../../models/productModel');

const deleteProductFAQ = async (req, res) => {
    try {
        let id = req.params.id;
        let faqArrayId = req.params.faqId;
        if(req.user.role !== 'ADMIN' ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.userCaseFAQ.id(faqArrayId).remove();
        await product.save();
        res.json({ message: 'FAQ deleted successfully', status: 200, data: product, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { deleteProductFAQ };


