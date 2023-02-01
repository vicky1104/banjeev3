import axios from "axios";

export const methodType = (type) => {
  switch (type) {
    case "GET":
      return axios.get;
    case "POST":
      return axios.post;
    case "PUT":
      return axios.put;
    case "DELETE":
      return axios.delete;
    default:
      break;
  }
};
