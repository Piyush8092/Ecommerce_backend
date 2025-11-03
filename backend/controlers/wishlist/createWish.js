let Wish = require('../../models/wishModel');

const createWish = async (req, res) => {
    try {
        let userId = req.user._id;
        let { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'All fields are required' });
        }
            // Create new wish
            const newWish = new Wish({
                userId,
                productId,
            });

const savedWish = await newWish.save();
await savedWish.populate('productId', 'name price image description catagory discount stock limit');
              
            res.json({ message: 'Wish created successfully', status: 200, data: savedWish, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { createWish };



