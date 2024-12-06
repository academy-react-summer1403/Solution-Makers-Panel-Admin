import React, { Suspense, useEffect } from "react";

// ** Router Import
import Router from "./router/Router";
import { getItem } from "./services/common/storage";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getItem("token")) {
      navigate("/login");
    }
  }, []);

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
