import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (nom_utilisateur, mot_de_passe, email) => {
  const res = await axios.post(`${API_URL}/login`, { nom_utilisateur, mot_de_passe, email });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
