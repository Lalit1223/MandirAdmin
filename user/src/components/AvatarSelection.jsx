import React, { useState } from "react";

const AvatarSelection = () => {
  const [avatars, setAvatars] = useState([
    { id: 1, filename: "avatar1.png" },
    { id: 2, filename: "avatar2.png" },
    { id: 3, filename: "avatar3.png" },
    { id: 4, filename: "avatar4.png" },
  ]); // Simulated avatar list

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [message, setMessage] = useState("");

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSave = () => {
    if (!selectedUser || !selectedAvatar) {
      setMessage("Please select a user and an avatar.");
      return;
    }

    // Simulate save operation
    console.log("Saving selection:", {
      userId: selectedUser,
      avatarId: selectedAvatar.id,
    });

    setMessage(`Avatar ${selectedAvatar.id} saved for User ${selectedUser}!`);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Select User and Avatar</h2>

      {/* User Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="userSelect" style={{ marginRight: "10px" }}>
          Select User:
        </label>
        <select
          id="userSelect"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{
            padding: "5px",
            fontSize: "16px",
          }}
        >
          <option value="">-- Select User --</option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((id) => (
            <option key={id} value={id}>
              User {id}
            </option>
          ))}
        </select>
      </div>

      {/* Avatar Selection */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {avatars.map((avatar) => (
          <img
            key={avatar.id}
            src={`http://localhost:3000/avatars/${avatar.filename}`}
            alt={`Avatar ${avatar.id}`}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border:
                selectedAvatar?.id === avatar.id
                  ? "3px solid green"
                  : "1px solid gray",
              cursor: "pointer",
            }}
            onClick={() => handleAvatarSelect(avatar)}
          />
        ))}
      </div>

      {/* Save Button */}
      {selectedUser && selectedAvatar && (
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          Save Avatar
        </button>
      )}

      {/* Message */}
      {message && (
        <p
          style={{
            marginTop: "20px",
            color: message.includes("saved") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AvatarSelection;
