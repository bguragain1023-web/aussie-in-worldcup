import { useState } from "react";

export const PasswordModal = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      onSuccess(password);
    } else {
      setError("Wrong password. Try again.");
      setPassword("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h5>Admin Access</h5>
        <p className="modal-sub">Enter admin password to continue</p>

        <input
          type="password"
          className="modal-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
        />

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-buttons">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-submit" onClick={handleSubmit}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};
