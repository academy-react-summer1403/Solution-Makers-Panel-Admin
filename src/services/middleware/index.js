import axios from "axios";
import { baseURL } from "../../configs/apiConfig"
import { getItem } from "../common/storage";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: baseURL,
});

instance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${getItem("token")}`;
    return config;
  },
  (error) => {
    console.log("error =>", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error =>", error);
    switch (error.status) {
      case 401:
        toast.error("لطفا اول وارد حساب کاربری خود شوید");
        break;
      case 403:
        toast.error("دسترسی وجود ندارد");
        break;
      case 404:
        toast.error("همچین چیزی پیدا نشد");
        break;
      case 422:
        toast.error("اطلاعات نامعتبر می باشد");
        break;
      case 400:
        toast.error("خطایی رخ داد");
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

export default instance;
