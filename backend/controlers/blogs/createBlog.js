let Blog = require('../../models/blogModel');

const createBlog = async (req, res) => {
    try {
        let userId = req.user._id;
        let payload= req.body;
        if (!payload.heading || !payload.image || !payload.catagory || !payload.description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new blog
        const newBlog = new Blog(payload);
payload.userId=userId;
          const savedBlog = await newBlog.save();
          
        res.json({ message: 'Blog created successfully', status: 200, data: savedBlog, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { createBlog };

