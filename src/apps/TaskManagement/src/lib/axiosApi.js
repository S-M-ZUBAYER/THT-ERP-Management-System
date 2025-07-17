import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "https://grozziie.zjweiting.com:57683/tht/taskManagement/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
