import React, { useState, useEffect } from 'react';
import { carouselAPI, normalizeResponse } from '../../services/api';
import Modal from '../Modal';

const CarouselSection = () => {
  const [carousels, setCarousels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [viewingCarousel, setViewingCarousel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    heading: '',
    title: '',
    image: '',
    catagory: '',
    link: '',
  });

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await carouselAPI.getAll();
      setCarousels(normalizeResponse(response));
    } catch (err) {
      setError('Failed to fetch carousel items');
      console.error(err);
      setCarousels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (carousel = null) => {
    if (carousel) {
      setEditingCarousel(carousel);
      setFormData({
        heading: carousel.heading || '',
        title: carousel.title || '',
        image: carousel.image || '',
        catagory: carousel.catagory || '',
        link: carousel.link || '',
      });
    } else {
      setEditingCarousel(null);
      setFormData({
        heading: '',
        title: '',
        image: '',
        catagory: '',
        link: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCarousel(null);
  };

  const handleViewCarousel = (carousel) => {
    setViewingCarousel(carousel);
  };

  const handleCloseViewModal = () => {
    setViewingCarousel(null);
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
    try {
      if (editingCarousel) {
        await carouselAPI.update(editingCarousel._id, formData);
      } else {
        await carouselAPI.create(formData);
      }
      fetchCarousels();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save carousel item');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this carousel item?')) {
      try {
        await carouselAPI.delete(id);
        fetchCarousels();
      } catch (err) {
        setError('Failed to delete carousel item');
        console.error(err);
      }
    }
  };

  const filteredCarousels = Array.isArray(carousels) ? carousels.filter(
    (carousel) =>
      carousel.heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carousel.catagory?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="section">
      <div className="section-header">
        <h2>Carousel Management</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          + Add New Carousel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search carousel items..."
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
                <th>Title</th>
                <th>Category</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarousels.map((carousel) => (
                <tr key={carousel._id}>
                  <td>{carousel.heading}</td>
                  <td>{carousel.title}</td>
                  <td>{carousel.catagory}</td>
                  <td>{carousel.link || 'N/A'}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewCarousel(carousel)}
                        title="View carousel details"
                      >
                        View
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenModal(carousel)}
                        title="Edit carousel"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(carousel._id)}
                        title="Delete carousel"
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

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingCarousel ? 'Edit Carousel' : 'Add New Carousel'}
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
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
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
            <label>Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
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
        isOpen={!!viewingCarousel}
        onClose={handleCloseViewModal}
        title="View Carousel"
      >
        {viewingCarousel && (
          <div className="view-blog-container">
            <div className="blog-view-header">
              <h3>{viewingCarousel.heading}</h3>
              <p className="blog-category">Title: <strong>{viewingCarousel.title}</strong></p>
              <p className="blog-date">Category: <strong>{viewingCarousel.catagory}</strong></p>
            </div>

            {viewingCarousel.image && (
              <div className="blog-view-image">
                <img src={viewingCarousel.image} alt={viewingCarousel.heading} />
              </div>
            )}

            {viewingCarousel.link && (
              <div className="blog-view-link">
                <h4>Link</h4>
                <a href={viewingCarousel.link} target="_blank" rel="noopener noreferrer">
                  {viewingCarousel.link}
                </a>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="btn-edit"
                onClick={() => {
                  handleOpenModal(viewingCarousel);
                  handleCloseViewModal();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={() => {
                  handleDelete(viewingCarousel._id);
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

export default CarouselSection;

