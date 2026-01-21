import axios from "axios";

const API_URL = "http://localhost:8080/api/keuangan";

export const getKeuangan = () => axios.get(API_URL);
export const tambahKeuangan = (data) => axios.post(API_URL, data);
export const hapusKeuangan = (id) => axios.delete(`${API_URL}/${id}`);
