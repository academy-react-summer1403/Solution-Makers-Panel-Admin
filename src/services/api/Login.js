import axios from "axios";

export const loginUser = (obj) =>
  axios.post("https://classapi.sepehracademy.ir/api/Sign/Login", obj);
