let Subscription = require('../../models/subscriptionModle');


    const getAllSubscription = async (req, res) => {
        try {
            let page = req.query.page || 1;
            let limit = req.query.limit || 10;

                let skip = (page - 1) * limit;
                let total = await Subscription.countDocuments();
                let totalPages = Math.ceil(total / limit);
                if(req.user.role !== 'ADMIN') {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const subscription = await Subscription.find().skip(skip).limit(limit).populate('userId', 'name email');
                res.json({ message: 'Subscription fetched successfully', status: 200, data: subscription, success: true, error: false, total, totalPages});

                     }
                     catch (e) {
                        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
                    }
                };

module.exports = { getAllSubscription };


