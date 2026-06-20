import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

export const queryAPI = async (question, history) => {
  const response = await API.post("/query", { question, history });
  return response.data;
};

export const uploadDocs = async (title, type, content, password) => {
  const response = await API.post(
    "/admin/upload",
    { title, type, content },
    { headers: { "x-admin-password": password } },
  );
  return response.data;
};

export const getDocuments = async (password) => {
  const response = await API.get("/admin/documents", {
    headers: { "x-admin-password": password },
  });
  return response.data;
};
export const deleteDocs = async (id, password) => {
  const response = await API.delete(`/admin/documents/${id}`, {
    headers: { "x-admin-password": password },
  });

  return response.data;
};
