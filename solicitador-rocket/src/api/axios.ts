import axios from "axios";

export const api = axios.create({
    baseURL: "https://refund-project.onrender.com"
});