import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MandirList from "../LIst/MandirList";
import "./FormStyles.css"; // Common styling for all forms

const Mandir = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [offlineVideos, setOfflineVideos] = useState({
    offline_video_morning: "",
    offline_video_evening: "",
    offline_video_night: "",
  });
  const [aartiTimes, setAartiTimes] = useState({
    aarti_time_morning: "",
    aarti_time_evening: "",
    aarti_time_night: "",
  });
  const [mapLink, setMapLink] = useState("");
  const [images, setImages] = useState([]); // Store as File objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (!authToken || isAuth !== "true") {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array

    if (files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      e.target.value = "";
      return;
    }

    setImages(files); // Store files directly
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Description word count validation
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 150) {
      setError("Description cannot exceed 150 words.");
      setLoading(false);
      return;
    }

    // Get auth token
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You are not authenticated. Please login first.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("nick_name", nickname);
      formData.append("description", description);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("youtubeURL", youtubeLink);
      formData.append("map_link", mapLink);

      // Append images to FormData
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Append offline URLs
      formData.append(
        "offlineURL",
        JSON.stringify({
          morning: offlineVideos.offline_video_morning,
          evening: offlineVideos.offline_video_evening,
          night: offlineVideos.offline_video_night,
        })
      );

      // Append aarti times
      formData.append(
        "aarti_time",
        JSON.stringify({
          morning: aartiTimes.aarti_time_morning,
          evening: aartiTimes.aarti_time_evening,
          night: aartiTimes.aarti_time_night,
        })
      );

      // Send request with auth token
      const response = await axios.post(
        "https://man-mandir.onrender.com/mandir/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      alert("Mandir added successfully!");
      setTitle("");
      setNickname("");
      setDescription("");
      setYoutubeLink("");
      setCity("");
      setCountry("");
      setOfflineVideos({
        offline_video_morning: "",
        offline_video_evening: "",
        offline_video_night: "",
      });
      setAartiTimes({
        aarti_time_morning: "",
        aarti_time_evening: "",
        aarti_time_night: "",
      });
      setMapLink("");
      setImages([]);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error adding mandir:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      } else {
        setError("Failed to add Mandir. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="loading">Checking authentication...</div>;
  }

  if (isSubmitted) {
    return <MandirList />;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Mandir</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">
            Title<span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description<span className="required">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <small>{description.trim().split(/\s+/).length}/150 words</small>
        </div>

        <div className="form-group">
          <label htmlFor="city">
            City<span className="required">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">
            Country<span className="required">*</span>
          </label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">
            Upload Images (Max: 5)<span className="required">*</span>
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="youtubeLink">YouTube Live Link</label>
          <input
            type="url"
            id="youtubeLink"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        <div className="form-group">
          <label>Offline Video Links</label>
          <div className="time-inputs">
            <div className="time-input-group">
              <label>Morning</label>
              <input
                type="url"
                placeholder="https://example.com/morning.mp4"
                value={offlineVideos.offline_video_morning}
                onChange={(e) =>
                  setOfflineVideos({
                    ...offlineVideos,
                    offline_video_morning: e.target.value,
                  })
                }
              />
            </div>
            <div className="time-input-group">
              <label>Evening</label>
              <input
                type="url"
                placeholder="https://example.com/evening.mp4"
                value={offlineVideos.offline_video_evening}
                onChange={(e) =>
                  setOfflineVideos({
                    ...offlineVideos,
                    offline_video_evening: e.target.value,
                  })
                }
              />
            </div>
            <div className="time-input-group">
              <label>Night</label>
              <input
                type="url"
                placeholder="https://example.com/night.mp4"
                value={offlineVideos.offline_video_night}
                onChange={(e) =>
                  setOfflineVideos({
                    ...offlineVideos,
                    offline_video_night: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Aarti Times</label>
          <div className="time-inputs">
            <div className="time-input-group">
              <label>Morning</label>
              <input
                type="time"
                value={aartiTimes.aarti_time_morning}
                onChange={(e) =>
                  setAartiTimes({
                    ...aartiTimes,
                    aarti_time_morning: e.target.value,
                  })
                }
              />
            </div>
            <div className="time-input-group">
              <label>Evening</label>
              <input
                type="time"
                value={aartiTimes.aarti_time_evening}
                onChange={(e) =>
                  setAartiTimes({
                    ...aartiTimes,
                    aarti_time_evening: e.target.value,
                  })
                }
              />
            </div>
            <div className="time-input-group">
              <label>Night</label>
              <input
                type="time"
                value={aartiTimes.aarti_time_night}
                onChange={(e) =>
                  setAartiTimes({
                    ...aartiTimes,
                    aarti_time_night: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mapLink">Map Link</label>
          <input
            type="url"
            id="mapLink"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Adding Mandir..." : "Add Mandir"}
        </button>
      </form>
    </div>
  );
};

export default Mandir;
