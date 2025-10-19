const userModel = require('../../models/userModel');

const queryAdminUser = async (req, res) => {
    try {
        let query = req.query.query || '';
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;

        if (!query.trim()) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: 'Invalid page or limit value' });
        }

        const filter = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        };

        const total = await userModel.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        if (total === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        if (page > totalPages) {
            return res.status(400).json({ message: 'Page number exceeds total pages' });
        }

        const skip = (page - 1) * limit;

        const result = await userModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // optional: sort newest first

        res.json({
            message: 'Users retrieved successfully',
            status: 200,
            data: result,
            total,
            totalPages,
            currentPage: page,
            success: true,
            error: false
        });
    } catch (e) {
        console.error('Error in queryAdminUser:', e);
        res.json({
            message: 'Something went wrong',
            status: 500,
            data: e,
            success: false,
            error: true
        });
    }
};

module.exports = { queryAdminUser };
