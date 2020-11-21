import axios from "axios";

export default axios.create({
    baseURL: process.env.SERVER || "http://localhost:8080/api/v1",
    headers: {
        "Content-type": "application/json"
    }
});