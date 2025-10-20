let Blog = require('../../models/blogModel');

const deleteBlog = async (req, res) => {
    try {
        let id = req.params.id;
        let existBlog = await Blog.findById(id);
        if (!existBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check authorization: must be ADMIN or the blog owner
        if(req.user.role !== 'ADMIN' && req.user._id.toString() !== existBlog.userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json({ message: 'Blog deleted successfully', status: 200, data: deletedBlog, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { deleteBlog };


