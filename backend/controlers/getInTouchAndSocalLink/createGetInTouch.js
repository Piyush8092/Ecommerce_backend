let GetInTouch = require('../../models/GetInTouchModel');

const createGetInTouch = async (req, res) => {
    try {
        const payload = req.body;

            if(req.user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!payload.email || !payload.phone || !payload.address || !payload.businessHours || !payload.socialMedia) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Create new get in touch
        const newGetInTouch = new GetInTouch(payload);
        const savedGetInTouch = await newGetInTouch.save();
        
        res.json({ message: 'Get in touch created successfully', status: 200, data: savedGetInTouch, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { createGetInTouch };


