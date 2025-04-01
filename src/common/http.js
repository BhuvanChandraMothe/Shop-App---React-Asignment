import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:2000", // Make sure this is correct
    headers: {
        "Content-Type": "application/json",
    },
});

export default http;
