import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import "../styles/SubmitLaundry.css";

const LaundryStatus = () => {
  const [laundryStatus, setLaundryStatus] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    numberOfClothes: 0,
    items: {
      Shirt: 0,
      Pant: 0,
      Jeans: 0,
      Tshirt: 0,
      PlayPant: 0,
      Bermuda: 0,
      InnerBan: 0,
      Bedsheet: 0,
      Blanket: 0,
      Lunkey: 0,
      Overcoat: 0,
      Thorth: 0,
      Turkey: 0,
      Pillow: 0,
      Sweater: 0,
    },
  });

  useEffect(() => {
    const fetchLaundryStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/laundry/status', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch laundry status');
        }

        const data = await response.json();
        setLaundryStatus(data);
        setFormData({
          numberOfClothes: data.numberOfClothes,
          items: data.items,
        });
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load laundry status');
      }
    };

    fetchLaundryStatus();
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();

    const totalClothes = Object.values(formData.items).reduce((sum, count) => sum + parseInt(count || 0, 10), 0);

    if (totalClothes > 20) {
      swal({
        title: "Error!",
        text: "The total number of clothes cannot exceed 20. Please adjust your items.",
        icon: "warning",
        button: "Okay",
      });
      return;
    }

    const updatedFormData = { ...formData, numberOfClothes: totalClothes };

    try {
      const response = await fetch('http://localhost:3000/api/laundry/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to edit laundry submission');
      }

      const data = await response.json();
      swal({
        title: "Success!",
        text: data.message,
        icon: "success",
        button: "Great!",
      }).then(() => {
        setLaundryStatus(data.submission);
        setFormData(updatedFormData);
        setIsEditing(false);
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to edit laundry submission');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/laundry/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete laundry submission');
      }

      const data = await response.json();
      swal({
        title: "Deleted!",
        text: data.message,
        icon: "error",
        button: "Okay",
      }).then(() => {
        setLaundryStatus(null);
      });
    } catch (err) {
      swal({
        title: "Error!",
        text: err.message || "An unexpected error occurred while deleting.",
        icon: "warning",
        button: "Try Again",
      });
    }
  };

  if (errorMessage) {
    return <div className="laundry-error">{errorMessage}</div>;
  }

  if (!laundryStatus) {
    return <div className="laundry-loading">Loading your laundry status...</div>;
  }

  return (
    <div className="laundry-status-page">
      <h2 className="laundry-title">Laundry Submission Status</h2>
      <div className="laundry-info">
        <p><strong>Submission Date:</strong> {new Date(laundryStatus.submissionDate).toLocaleDateString()}</p>
        <p><strong>Number of Clothes:</strong> {laundryStatus.numberOfClothes}</p>
        <p><strong>Items:</strong></p>
        <ul className="laundry-items-list">
          {Object.entries(laundryStatus.items).map(([item, count]) => (
            <li key={item} className="laundry-item">{item}: {count}</li>
          ))}
        </ul>
        <p><strong>Status:</strong> {laundryStatus.status}</p>
      </div>

      {isEditing ? (
        <form className="laundry-edit-form" onSubmit={handleEdit}>
          <h3 className="edit-title">Edit Submission</h3>
          {Object.entries(formData.items).map(([item, count]) => (
            <div key={item} className="form-group">
              <label>{item}: </label>
              <input
                type="number"
                value={count}
                onChange={(e) => setFormData({
                  ...formData,
                  items: { ...formData.items, [item]: e.target.value },
                })}
              />
            </div>
          ))}
          <button type="submit" className="form-button save-button">Save Changes</button>
          <button type="button" className="form-button cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div className="button-group">
          {laundryStatus.status !== 'Pending' && laundryStatus.status !== 'Completed' && (
            <>
              <button className="status-button edit-button" onClick={() => setIsEditing(true)}>Edit Submission</button>
              <button className="status-button delete-button" onClick={handleDelete}>Delete Submission</button>
            </>
          )}
          {laundryStatus.status === 'Pending' || laundryStatus.status === 'Completed' ? (
            <p className="status-restriction-message">Editing and deleting are not allowed when the status is {laundryStatus.status}.</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default LaundryStatus;
