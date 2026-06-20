import { useState } from "react";

export const PasswordModal = ({ onSuccess, onClose, onError }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!password.trim()) return;
    onSuccess(password);
  };

  return (
    <div className="modal-overlay   ">
      <h5>Admin Access</h5>
      <div className="modal-box">
        <p className="modal-sub">Enter admin password to continue :</p>

        <div className="input-error">
          <input
            type="password"
            className="modal-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />

          {onError && <p className="modal-error">{onError}</p>}
        </div>

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
