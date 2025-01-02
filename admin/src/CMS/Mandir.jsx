import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MandirList from "../LIst/MandirList";

const Mandir = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
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
  const [images, setImages] = useState([]); // New state for images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const imagePromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // This will give you base64 encoded string
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // Convert image to base64
      });
    });

    Promise.all(imagePromises)
      .then((base64Images) => {
        setImages(base64Images); // Store base64 images in state
      })
      .catch((err) => {
        setError("Failed to read image files.");
        console.error("Image conversion error:", err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/mandir", {
        title,
        nickname,
        description,
        images, // Send base64 encoded image strings
        youtube_live_link: youtubeLink,
        offline_video_morning: offlineVideos.offline_video_morning,
        offline_video_evening: offlineVideos.offline_video_evening,
        offline_video_night: offlineVideos.offline_video_night,
        aarti_time_morning: aartiTimes.aarti_time_morning,
        aarti_time_evening: aartiTimes.aarti_time_evening,
        aarti_time_night: aartiTimes.aarti_time_night,
        map_link: mapLink,
      });

      alert("Mandir added successfully!");
      setTitle("");
      setNickname("");
      setDescription("");
      setYoutubeLink("");
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
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error adding mandir:", err);
      setError("Failed to add Mandir. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return <MandirList />;
  }

  return (
    <div
      className="modal-wrapper"
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        className="text-center"
        style={{ color: "#333", marginBottom: "20px" }}
      >
        Add New Mandir
      </h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Nickname */}
        <div className="mb-3">
          <label htmlFor="nickname" className="form-label">
            Nickname
          </label>
          <input
            type="text"
            className="form-control"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Upload Images
          </label>
          <input
            type="file"
            className="form-control"
            id="images"
            onChange={handleImageChange}
            multiple
          />
        </div>

        {/* YouTube Link */}
        <div className="mb-3">
          <label htmlFor="youtubeLink" className="form-label">
            YouTube Live Link
          </label>
          <input
            type="url"
            className="form-control"
            id="youtubeLink"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>

        {/* Offline Video Links */}
        <div className="mb-3">
          <label className="form-label">Offline Video Links</label>
          <input
            type="url"
            className="form-control mb-2"
            placeholder="Morning Aarti Video"
            value={offlineVideos.offline_video_morning}
            onChange={(e) =>
              setOfflineVideos({
                ...offlineVideos,
                offline_video_morning: e.target.value,
              })
            }
          />
          <input
            type="url"
            className="form-control mb-2"
            placeholder="Evening Aarti Video"
            value={offlineVideos.offline_video_evening}
            onChange={(e) =>
              setOfflineVideos({
                ...offlineVideos,
                offline_video_evening: e.target.value,
              })
            }
          />
          <input
            type="url"
            className="form-control"
            placeholder="Night Aarti Video"
            value={offlineVideos.offline_video_night}
            onChange={(e) =>
              setOfflineVideos({
                ...offlineVideos,
                offline_video_night: e.target.value,
              })
            }
          />
        </div>

        {/* Aarti Times */}
        <div className="mb-3">
          <label className="form-label">Aarti Times</label>
          <input
            type="time"
            className="form-control mb-2"
            value={aartiTimes.aarti_time_morning}
            onChange={(e) =>
              setAartiTimes({
                ...aartiTimes,
                aarti_time_morning: e.target.value,
              })
            }
          />
          <input
            type="time"
            className="form-control mb-2"
            value={aartiTimes.aarti_time_evening}
            onChange={(e) =>
              setAartiTimes({
                ...aartiTimes,
                aarti_time_evening: e.target.value,
              })
            }
          />
          <input
            type="time"
            className="form-control"
            value={aartiTimes.aarti_time_night}
            onChange={(e) =>
              setAartiTimes({
                ...aartiTimes,
                aarti_time_night: e.target.value,
              })
            }
          />
        </div>

        {/* Map Link */}
        <div className="mb-3">
          <label htmlFor="mapLink" className="form-label">
            Map Link
          </label>
          <input
            type="url"
            className="form-control"
            id="mapLink"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Adding Mandir..." : "Add Mandir"}
        </button>
      </form>
    </div>
  );
};

export default Mandir;
