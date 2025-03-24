import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BannerList = () => {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "https://man-mandir.onrender.com";

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }
    fetchBanners();
  }, [navigate]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      const response = await axios.get(`${API_URL}/banner/admin/get`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data.success) {
        setBanners(response.data.data || []);
      } else {
        console.error("Error from server:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        navigate("/login");
        return;
      }

      const newStatus = !currentStatus;
      const response = await axios.patch(
        `${API_URL}/banner/update-status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.data.success) {
        setBanners((prevBanners) =>
          prevBanners.map((banner) =>
            banner._id === id ? { ...banner, status: newStatus } : banner
          )
        );
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
      alert("Failed to update status.");
    }
  };

  return (
    <div className="container">
      <h3 className="text-primary">Banner List</h3>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : banners.length === 0 ? (
        <p className="text-center text-muted">No banners available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover shadow-sm rounded">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, index) => (
                <tr key={banner._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`${API_URL}/${banner.imagePath}`}
                      alt="Banner"
                      width="100"
                      style={{ borderRadius: "5px" }}
                    />
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        banner.status ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {banner.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={banner.status}
                        onChange={() => toggleStatus(banner._id, banner.status)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BannerList;
