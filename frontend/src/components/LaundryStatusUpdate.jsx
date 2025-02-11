import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import "../styles/Admin.css";

function LaundryStatusUpdate() {
  const [laundryRecords, setLaundryRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchLaundryRecords();
  }, []);

  const fetchLaundryRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:3000/api/admin/laundry/submissions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLaundryRecords(response.data.submissions);
      setFilteredRecords(response.data.submissions);
    } catch (error) {
      setError("Failed to fetch laundry records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (recordId, newStatus, userId, username) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://localhost:3000/api/admin/laundry/submissions/${recordId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update the state without refetching the data
        setLaundryRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === recordId
              ? {
                  ...record,
                  status: newStatus,
                  pushMessageSent:
                    newStatus === "Completed" ? false : record.pushMessageSent,
                }
              : record
          )
        );
        handleFilterChange(filter);
        swal("Success", "Laundry status updated successfully!", "success");
      }
    } catch (error) {
      swal("Error", "Failed to update laundry status. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (recordId, userId, message) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        "http://localhost:3000/api/notifications/create",
        { userId, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update `pushMessageSent` to true in the backend and frontend state
      await axios.put(
        `http://localhost:3000/api/admin/laundry/submissions/${recordId}`,
        { pushMessageSent: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state to reflect the new pushMessageSent status
      setLaundryRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === recordId
            ? { ...record, pushMessageSent: true }
            : record
        )
      );

      swal(
        "Notification Sent",
        "The user has been notified successfully!",
        "success"
      );
    } catch (error) {
      swal("Error", "Failed to send notification. Please try again.", "error");
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    setFilteredRecords(
      status === "All"
        ? laundryRecords
        : laundryRecords.filter((record) => record.status === status)
    );
  };

  const generateItemTooltip = (items) => {
    const itemList = Object.entries(items)
      .map(([item, count]) => (count > 0 ? `${item}: ${count}` : null))
      .filter(Boolean)
      .join(", ");
    return itemList || "No items listed";
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  return (
    <section className="admin-section">
      {loading ? (
        <p className="loading-message">Loading laundry records...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="filter-container">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select
              className="filter-dropdown"
              id="statusFilter"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Submitted">Submitted</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="table-container">
            <table className="laundry-table">
              <thead>
                <tr className="table-header">
                  <th className="table-cell">Student Name</th>
                  <th className="table-cell">Email</th>
                  <th className="table-cell">Number of Clothes</th>
                  <th className="table-cell">Status</th>
                  <th className="table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record) => (
                  <tr key={record._id} className="table-row">
                    <td className="table-cell">
                      {record.userId?.fullName || "Unknown"}
                    </td>
                    <td className="table-cell">
                      {record.userId?.email || "Not Provided"}
                    </td>
                    <td
                      title={generateItemTooltip(record.items)}
                      className="table-cell"
                    >
                      {record.numberOfClothes || 0}
                    </td>
                    <td className="table-cell">{record.status}</td>
                    <td className="table-cell">
                      {record.status === "Submitted" && (
                        <button
                          className="action-button update-button"
                          onClick={() =>
                            updateStatus(
                              record._id,
                              "Pending",
                              record.userId._id,
                              record.userId.fullName
                            )
                          }
                        >
                          Mark as Pending
                        </button>
                      )}
                      {record.status === "Pending" && (
                        <button
                          className="action-button update-button"
                          onClick={() =>
                            updateStatus(
                              record._id,
                              "Completed",
                              record.userId._id,
                              record.userId.fullName
                            )
                          }
                        >
                          Mark as Completed
                        </button>
                      )}
                      {record.status === "Completed" &&
                        !record.pushMessageSent && (
                          <button
                            className="action-button update-button"
                            onClick={() =>
                              createNotification(
                                record._id,
                                record.userId._id,
                                `Dear ${record.userId.fullName}, your laundry is ready for collection.`
                              )
                            }
                          >
                            Push Message
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-container">
              <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`pagination-button ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default LaundryStatusUpdate;
