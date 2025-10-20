import React, { useState, useEffect } from 'react';
import { blogAPI, normalizeResponse } from '../../services/api';
import Modal from '../Modal';

const BlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    heading: '',
    image: '',
    catagory: '',
    description: '',
    productLink: '',
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await blogAPI.getAll();
      setBlogs(normalizeResponse(response));
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error(err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        heading: blog.heading || '',
        image: blog.image || '',
        catagory: blog.catagory || '',
        description: blog.description || '',
        productLink: blog.productLink || '',
      });
    } else {
      setEditingBlog(null);
      setFormData({
        heading: '',
        image: '',
        catagory: '',
        description: '',
        productLink: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
  };

  const handleViewBlog = (blog) => {
    setViewingBlog(blog);
  };

  const handleCloseViewModal = () => {
    setViewingBlog(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Submitting blog:', formData);
      if (editingBlog) {
        console.log('Updating blog:', editingBlog._id);
        await blogAPI.update(editingBlog._id, formData);
      } else {
        console.log('Creating new blog');
        await blogAPI.create(formData);
      }
      console.log('Blog saved successfully');
      fetchBlogs();
      handleCloseModal();
    } catch (err) {
      console.error('Save blog error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save blog';
      setError(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        console.log('Deleting blog:', id);
        await blogAPI.delete(id);
        console.log('Blog deleted successfully');
        fetchBlogs();
      } catch (err) {
        console.error('Delete blog error:', err);
        const errorMsg = err.response?.data?.message || 'Failed to delete blog';
        setError(errorMsg);
      }
    }
  };

  const filteredBlogs = Array.isArray(blogs) ? blogs.filter(
    (blog) =>
      blog.heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.catagory?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="section">
      <div className="section-header">
        <h2>Blogs Management</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add New Blog
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Heading</th>
                <th>Category</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.heading}</td>
                  <td>{blog.catagory}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewBlog(blog)}
                        title="View blog details"
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(blog)}
                        title="Edit blog"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(blog._id)}
                        title="Delete blog"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBlog ? 'Edit Blog' : 'Add New Blog'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Heading</label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="catagory"
              value={formData.catagory}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Link</label>
            <input
              type="text"
              name="productLink"
              value={formData.productLink}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={!!viewingBlog}
        onClose={handleCloseViewModal}
        title="View Blog"
      >
        {viewingBlog && (
          <div className="view-blog-container">
            <div className="blog-view-header">
              <h3>{viewingBlog.heading}</h3>
              <p className="blog-category">Category: <strong>{viewingBlog.catagory}</strong></p>
              <p className="blog-date">Created: <strong>{new Date(viewingBlog.createdAt).toLocaleDateString()}</strong></p>
            </div>

            {viewingBlog.image && (
              <div className="blog-view-image">
                <img src={viewingBlog.image} alt={viewingBlog.heading} />
              </div>
            )}

            <div className="blog-view-content">
              <h4>Description</h4>
              <p>{viewingBlog.description}</p>
            </div>

            {viewingBlog.productLink && (
              <div className="blog-view-link">
                <h4>Product Link</h4>
                <a href={viewingBlog.productLink} target="_blank" rel="noopener noreferrer">
                  {viewingBlog.productLink}
                </a>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-edit"
                onClick={() => {
                  handleOpenModal(viewingBlog);
                  handleCloseViewModal();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={() => {
                  handleDelete(viewingBlog._id);
                  handleCloseViewModal();
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCloseViewModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogsSection;

