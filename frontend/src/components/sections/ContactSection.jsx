import React, { useState, useEffect } from 'react';
import { contactAPI, normalizeResponse } from '../../services/api';
import Modal from '../Modal';

const ContactSection = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewingContact, setViewingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await contactAPI.getAll();
      setContacts(normalizeResponse(response));
    } catch (err) {
      setError('Failed to fetch contact messages');
      console.error(err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (contact) => {
    setViewingContact(contact);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setViewingContact(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        await contactAPI.delete(id);
        fetchContacts();
      } catch (err) {
        setError('Failed to delete contact message');
        console.error(err);
      }
    }
  };

  const filteredContacts = Array.isArray(contacts) ? contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="section">
      <div className="section-header">
        <h2>Contact Messages</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search contacts..."
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
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact._id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td>{contact.phone || 'N/A'}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleOpenModal(contact)}
                      >
                        View
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(contact._id)}
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
        title="View Contact Message"
      >
        {viewingContact && (
          <div>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={viewingContact.name}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={viewingContact.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={viewingContact.phone || 'N/A'}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={viewingContact.subject}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={viewingContact.message}
                disabled
                rows="6"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactSection;

