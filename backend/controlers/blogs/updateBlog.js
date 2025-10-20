let Blog = require('../../models/blogModel');

const updateBlog = async (req, res) => {
    try {
        let id = req.params.id;
        let payload = req.body;
        if (!payload) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        let existBlog = await Blog.findById(id);
        if (!existBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        payload.userId = req.user._id;

        if(req.user.role !== 'ADMIN' || req.user._id.toString() !== existBlog.userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updatedBlog = await Blog.findByIdAndUpdate({_id:id},
           payload
        , { new: true });

        res.json({ message: 'Blog updated successfully', status: 200, data: updatedBlog, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { updateBlog };



