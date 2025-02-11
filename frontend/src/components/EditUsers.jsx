import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import "../styles/Admin.css";

function EditUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Adjust the number of items per page as needed

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`http://localhost:3000/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.users) {
        const filteredUsers = response.data.users.filter(
          (user) => user.role !== "admin"
        );
        setUsers(filteredUsers);
      } else {
        setError("Users data not found or is in an unexpected format");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (user) => {
    const form = document.createElement("form");
    form.innerHTML = `
      <div>
        <label for="edit-name">Name:</label>
        <input type="text" id="edit-name" value="${user.fullName}" />
      </div>
      <div>
        <label for="edit-email">Email:</label>
        <input type="email" id="edit-email" value="${user.email}" />
      </div>
    `;

    const confirm = await swal({
      title: "Edit User Details",
      content: form,
      buttons: ["Cancel", "Save"],
    });

    if (confirm) {
      const newName = form.querySelector("#edit-name").value.trim();
      const newEmail = form.querySelector("#edit-email").value.trim();

      if (newName !== user.fullName || newEmail !== user.email) {
        setLoading(true);
        try {
          const token = localStorage.getItem("authToken");
          await axios.put(
            `http://localhost:3000/api/admin/users/${user._id}`,
            { fullName: newName, email: newEmail },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u._id === user._id
                ? { ...u, fullName: newName, email: newEmail }
                : u
            )
          );

          swal("Success", "User details updated successfully!", "success");
        } catch (error) {
          console.error("Error updating user:", error);
          swal("Error", "Failed to update user. Please try again.", "error");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setLoading(true);
        try {
          const token = localStorage.getItem("authToken");
          await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUsers(users.filter((user) => user._id !== userId));

          swal("Poof! The user has been deleted!", {
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          setError("Failed to delete user. Please try again.");
          swal("Error", "Failed to delete user. Please try again.", "error");
        } finally {
          setLoading(false);
        }
      } else {
        swal("The user is safe!");
      }
    });
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <section className="admin-section">
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Laundry ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.laundryId || "N/A"}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        </>
      )}
    </section>
  );
}

export default EditUsers;
