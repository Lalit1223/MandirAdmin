import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "animate.css/animate.min.css"; // For animations

const Mandir = () => {
  const navigate = useNavigate();

  // State for form fields
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // Multiple images
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

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      // await axios.post("/api/mandir", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      alert("Mandir added successfully!");

      // Reset form fields
      setTitle("");
      setNickname("");
      setDescription("");
      setImages([]);
      setYoutubeLink("");
      setOfflineVideos({ morning: "", evening: "", night: "" });
      setAartiTimes({ morning: "", evening: "", night: "" });
      setMapLink("");

      // Navigate to the mandir list page
      navigate("/mandir");
    } catch (error) {
      console.error("Error adding mandir:", error);
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <h2 className="text-center mb-4">Add New Mandir</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
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
          <label htmlFor="nickname" className="form-label">
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
          <label htmlFor="description" className="form-label">
            Description (100 words max)
          </label>
          <textarea
            className="form-control"
            id="description"
            placeholder="Enter description"
            maxLength="100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Images (Max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="form-control"
            id="images"
            onChange={(e) => setImages([...e.target.files])}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="youtubeLink" className="form-label">
            YouTube Live Link
          </label>
          <input
            type="url"
            className="form-control"
            id="youtubeLink"
            placeholder="Enter YouTube live link"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Offline Video Links</label>
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
          <label className="form-label">Aarti Times</label>
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
          <label htmlFor="mapLink" className="form-label">
            Map Link
          </label>
          <input
            type="url"
            className="form-control"
            id="mapLink"
            placeholder="Enter map link"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Mandir
        </button>
      </form>
    </div>
  );
};

export default Mandir;
