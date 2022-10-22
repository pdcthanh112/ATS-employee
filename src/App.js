import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import "./scss/style.scss";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const App = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser.data);

  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="*" element={currentUser ? <DefaultLayout/> : <Navigate to="/login" />}/>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
