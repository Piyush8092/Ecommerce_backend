let Blog = require('../../models/blogModel');

const getQueryBlog = async (req, res) => {
    try {
        let query = req.query.query;
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let skip = (page - 1) * limit;
        let queryObj = {};
        if (query) {
            queryObj.heading = { $regex: query, $options: 'i' };
            queryObj.description = { $regex: query, $options: 'i' };
            queryObj.catagory = { $regex: query, $options: 'i' };
        }

        let total = await Blog.countDocuments(queryObj);
        let totalPages = Math.ceil(total / limit);

        const blog = await Blog.find(queryObj).skip(skip).limit(limit).populate('userId', 'name email');
        res.json({ message: 'Blog fetched successfully', status: 200, data: blog, success: true, error: false, total, totalPages});

             }
             catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { getQueryBlog };



