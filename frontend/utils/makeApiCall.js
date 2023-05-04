import axios from "axios";
import APIbaseURL from "./request/APIbaseURL";

let apiUrl = process.env.API_URL;

class makeApiCall {
  constructor() {}

  async post(urlPath, object) {
    console.log(object, "OBJECT");
    const { data } = await axios.post(`${APIbaseURL}/${urlPath}`, object);
    console.log(data, "RES DATAA");
    return data;
  }

  async get(urlPath, body) {
    const { data } = await axios.get(`${APIbaseURL}/${urlPath}`, body);
    return data;
  }

  async delete(urlPath, body) {
    const { data } = await axios.delete(`${APIbaseURL}/${urlPath}`, body);
    return data;
  }

  async put(urlPath, body) {
    const { data } = await axios.put(`${APIbaseURL}/${urlPath}`, body);
    return data;
  }

  async patch(urlPath, body) {
    const { data } = await axios.patch(`${APIbaseURL}/${urlPath}`, body);
    return data;
  }
}

export default makeApiCall;
