import React, { Suspense, useEffect } from "react";

// ** Router Import
import Router from "./router/Router";
import axios from "axios";
import toast from "react-hot-toast";
import { setItem } from "./services/common/storage";

const App = () => {
  useEffect(() => {
    axios
      .post("https://classapi.sepehracademy.ir/api/Sign/Login", {
        phoneOrGmail: "saeied.kh78@gmail.com",
        password: "123456",
        rememberMe: true,
      })
      .then((res) => {
        if (res.data.token) {
          setItem("token", res.data.token);
          setItem("userId", res.data.id);
          toast.success("با موفقیت وارد شدید");
        } else {
          toast.error("همچین کاربری وجود ندارد");
          return;
        }
      })
      .catch((error) => toast.error("خطایی رخ داد"));
  }, []);

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
