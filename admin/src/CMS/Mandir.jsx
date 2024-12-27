import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "animate.css/animate.min.css"; // For animations

const Mandir = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [offlineVideos, setOfflineVideos] = useState({
    morning: "",
    evening: "",
    night: "",
  });
  const [aartiTimes, setAartiTimes] = useState({
    morning: "",
    evening: "",
    night: "",
  });
  const [mapLink, setMapLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("nickname", nickname);
    formData.append("description", description);
    images.forEach((image) => formData.append("images", image));
    formData.append("youtubeLink", youtubeLink);
    formData.append("offlineVideosMorning", offlineVideos.morning);
    formData.append("offlineVideosEvening", offlineVideos.evening);
    formData.append("offlineVideosNight", offlineVideos.night);
    formData.append("aartiTimesMorning", aartiTimes.morning);
    formData.append("aartiTimesEvening", aartiTimes.evening);
    formData.append("aartiTimesNight", aartiTimes.night);
    formData.append("mapLink", mapLink);

    try {
      await axios.post("/api/mandir", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Mandir added successfully!");
      setTitle("");
      setNickname("");
      setDescription("");
      setImages([]);
      setYoutubeLink("");
      setOfflineVideos({ morning: "", evening: "", night: "" });
      setAartiTimes({ morning: "", evening: "", night: "" });
      setMapLink("");
      navigate("/mandir");
    } catch (error) {
      console.error("Error adding mandir:", error);
    }
  };

  return (
    <div
      className="modal-wrapper animate__animated animate__fadeIn"
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
        <div className="mb-3">
          <label
            htmlFor="title"
            className="form-label"
            style={{ fontWeight: "bold" }}
          >
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="nickname"
            className="form-label"
            style={{ fontWeight: "bold" }}
          >
            Nickname
          </label>
          <input
            type="text"
            className="form-control"
            id="nickname"
            placeholder="Enter nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="description"
            className="form-label"
            style={{ fontWeight: "bold" }}
          >
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            maxLength="100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label
            htmlFor="images"
            className="form-label"
            style={{ fontWeight: "bold" }}
          >
            Images (Max 5)
          </label>
          <input
            type="file"
            className="form-control"
            multiple
            id="images"
            onChange={(e) => setImages([...e.target.files])}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="youtubeLink"
            className="form-label"
            style={{ fontWeight: "bold" }}
          >
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

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: "bold" }}>
            Offline Video Links
          </label>
          <input
            type="url"
            className="form-control mb-2"
            placeholder="Morning Aarti Video"
            value={offlineVideos.morning}
            onChange={(e) =>
              setOfflineVideos({ ...offlineVideos, morning: e.target.value })
            }
          />
          <input
            type="url"
            className="form-control mb-2"
            placeholder="Evening Aarti Video"
            value={offlineVideos.evening}
            onChange={(e) =>
              setOfflineVideos({ ...offlineVideos, evening: e.target.value })
            }
          />
          <input
            type="url"
            className="form-control"
            placeholder="Night Aarti Video"
            value={offlineVideos.night}
            onChange={(e) =>
              setOfflineVideos({ ...offlineVideos, night: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ fontWeight: "bold" }}>
            Aarti Times
          </label>
          <input
            type="time"
            className="form-control mb-2"
            placeholder="Morning Aarti Time"
            value={aartiTimes.morning}
            onChange={(e) =>
              setAartiTimes({ ...aartiTimes, morning: e.target.value })
            }
          />
          <input
            type="time"
            className="form-control mb-2"
            placeholder="Evening Aarti Time"
            value={aartiTimes.evening}
            onChange={(e) =>
              setAartiTimes({ ...aartiTimes, evening: e.target.value })
            }
          />
          <input
            type="time"
            className="form-control"
            placeholder="Night Aarti Time"
            value={aartiTimes.night}
            onChange={(e) =>
              setAartiTimes({ ...aartiTimes, night: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="mapLink"
            className="form-label"
            style={{ fontWeight: "bold" }}
          >
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

        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{
            backgroundColor: "#ff5722",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Add Mandir
        </button>
      </form>
    </div>
  );
};

export default Mandir;
