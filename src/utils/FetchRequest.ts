import axios from "axios";
import { VITE_BACKEND_URL } from "./Backend_Url";

const FetchRequest = axios.create({
  baseURL: VITE_BACKEND_URL,
  headers: {
    "Content-type": "application/json",
    "authtoken": localStorage.getItem("authtoken")
      ? localStorage.getItem("authtoken")
      : "",
  },
});

export default FetchRequest;
