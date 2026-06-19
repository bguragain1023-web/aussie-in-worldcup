import { useEffect, useState } from "react";
import { getDocuments, uploadDocs, deleteDocs } from "../api/axios";

export const Adminpage = ({ onLogout, password }) => {
  console.log("onLogout received:", typeof onLogout);
  const [form, setForm] = useState({ title: "", type: "", content: "" });
  const [allDocs, setAllDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (password) fetchDocs();
  }, [password]);

  const fetchDocs = async () => {
    try {
      const data = await getDocuments(password);

      setAllDocs(data.documents);
    } catch (error) {
      console.error("Error Fetching Docs", error);
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleUpload = async () => {
    if (!form.title || !form.type || !form.content) {
      setMessage("please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await uploadDocs(form.title, form.type, form.content, password);
      setMessage("Documents successfully uploaded");
      setForm({ title: "", type: "", content: "" });
      fetchDocs();
    } catch (error) {
      console.error("something went wrong", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnDelete = async (id) => {
    try {
      await deleteDocs(id, password);
      fetchDocs();
    } catch (error) {
      console.error("Error deleting Document", error);
    }
  };

  return (
    <>
      <div className=" admin-wrapper">
        <div className="hero-bg"></div>

        <div className="admin-content d-flex flex-column align-items-center justify-content-center ">
          <div className="d-flex justify-content-center align-items-center mb-4 gap-4">
            <h2 className="admin-title">Admin Dashboard</h2>
            <button type="button" className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>

          <div className="admin-form-box ">
            <h5>Upload Documents</h5>

            {message && <p className="upload-message text-white">{message}</p>}
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                id="doc-title"
                name="title"
                className="form-control"
                placeholder="e.g Team history"
                value={form.title}
                onChange={handleOnChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>Type</label>
              <select
                name="type"
                className="form-control"
                value={form.type}
                onChange={handleOnChange}
              >
                <option value="" disabled>
                  Select type...
                </option>
                <option value="player">Player</option>
                <option value="team">Team</option>
                <option value="match">Match</option>
                <option value="opponent">Opponent</option>
                <option value="staff">Staff</option>
                <option value="history">History</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <label>Content</label>
              <textarea
                name="content"
                className="form-control"
                rows="8"
                placeholder="Type or paste scouting report here..."
                value={form.content}
                onChange={handleOnChange}
              />
            </div>

            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-docs-box mt-4">
        <div className="sub-title">Documents</div>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Chunks</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allDocs.map((doc, i) => (
              <tr key={doc._id}>
                <td>{i + 1}</td>
                <td>{doc.title}</td>
                <td>{doc.type}</td>
                <td>{doc.chunkCount}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleOnDelete(doc._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
