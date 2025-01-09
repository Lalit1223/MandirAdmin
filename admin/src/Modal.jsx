// Modal.js
import React from "react";

const Modal = ({
  showModal,
  handleCloseModal,
  currentModal,
  renderModalContent,
}) => {
  if (!showModal) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div
            className="modal-header"
            style={{ backgroundColor: "#ff5722", color: "#ffffff" }}
          >
            <h5 className="modal-title">{currentModal}</h5>
            <button
              type="button"
              className="btn-close"
              style={{ backgroundColor: "#ffffff", color: "#ff5722" }}
              onClick={handleCloseModal}
            ></button>
          </div>
          <div
            className="modal-body"
            style={{ backgroundColor: "#fef3eb", color: "#333333" }}
          >
            {renderModalContent()}
          </div>
          <div
            className="modal-footer"
            style={{ backgroundColor: "#f4f6f9", borderTop: "1px solid #ddd" }}
          >
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: "#ff5722", // Primary theme color
                color: "#ffffff", // White text for contrast
              }}
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
