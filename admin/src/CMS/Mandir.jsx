import React, { useState } from "react";
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
  const [city, setCity] = useState(""); // New state
  const [country, setCountry] = useState(""); // New state
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
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // const handleImageChange = (e) => {
  //   const files = e.target.files;

  //   if (files.length > 5) {
  //     alert("You can only upload a maximum of 5 images.");
  //     e.target.value = ""; // Clear the file input
  //     return;
  //   }

  //   const imagePromises = validImages.map((file) => {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => resolve(reader.result);
  //       reader.onerror = reject;
  //       reader.readAsDataURL(file);
  //     });
  //   });

  //   Promise.all(imagePromises)
  //     .then((base64Images) => setImages(base64Images))
  //     .catch((err) => {
  //       setError("Failed to read image files.");
  //       console.error("Image conversion error:", err);
  //     });
  // };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array

    if (files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      e.target.value = "";
      return;
    }

    const imagePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then((base64Images) => setImages(base64Images))
      .catch((err) => {
        setError("Failed to read image files.");
        console.error("Image conversion error:", err);
      });
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

    try {
      const response = await axios.post(`${API_URL}/api/mandir`, {
        title,
        nickname,
        description,
        city, // Sending city
        country, // Sending country
        youtube_live_link: youtubeLink,
        offline_video_morning: offlineVideos.offline_video_morning,
        offline_video_evening: offlineVideos.offline_video_evening,
        offline_video_night: offlineVideos.offline_video_night,
        aarti_time_morning: aartiTimes.aarti_time_morning,
        aarti_time_evening: aartiTimes.aarti_time_evening,
        aarti_time_night: aartiTimes.aarti_time_night,
        map_link: mapLink,
        images,
      });

      alert("Mandir added successfully!");
      setTitle("");
      setNickname("");
      setDescription("");
      setYoutubeLink("");
      setCity(""); // Reset city
      setCountry(""); // Reset country
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
        </div>

        <div className="form-group">
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
            multiple
          />
        </div>

        <div className="form-group">
          <label htmlFor="youtubeLink">YouTube Live Link</label>
          <input
            type="url"
            id="youtubeLink"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Offline Video Links</label>
          <input
            type="url"
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

        <div className="form-group">
          <label>Aarti Times</label>
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

        <div className="form-group">
          <label htmlFor="mapLink">Map Link</label>
          <input
            type="url"
            id="mapLink"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
          />
        </div>

        {/* New City Input */}
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

        {/* New Country Input */}
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

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Adding Mandir..." : "Add Mandir"}
        </button>
      </form>
    </div>
  );
};

export default Mandir;
