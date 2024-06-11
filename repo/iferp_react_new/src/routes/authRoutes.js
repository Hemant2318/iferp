import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "pages/Auth/Login";
import Register from "pages/Auth/Signup/Register";
import Selection from "pages/Auth/Signup/Selection";
import ForgotPassword from "pages/Auth/ForgotPassword";
import { commonRoute } from "utils/constants";
import Temp from "../pages/temp";
import TempCancel from "../pages/TempCancel";
import TempSuccess from "../pages/TempSuccess";
import GlobalPost from "pages/GlobalPost";
import EmailRedirection from "components/Layout/EmailRedirection";
import SpeakerRegister from "pages/Auth/Signup/SpeakerRegister/SpeakerRegister";
import NewGlobalResearchProfile from "pages/NewGlobalResearchProfile";
// import Success from "../pages/Auth/Signup/Success";

const AuthRoutes = () => {
  const loginRoute = window.location.pathname.includes("admin")
    ? "/admin/login"
    : "/member/login";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={commonRoute.speakerInvitation}
          element={<SpeakerRegister />}
        />
        <Route path={commonRoute.login} element={<Login />} />
        {/* <Route
          path={commonRoute.researchProfile}
          element={<GlobalResearchProfile />}
        /> */}
        <Route
          path={commonRoute.researchProfile}
          element={<NewGlobalResearchProfile />}
        />
        <Route exact path={commonRoute.globalPost} element={<GlobalPost />} />
        {/* <Route path={commonRoute.signup} element={<Success />} /> */}
        <Route
          exact
          path={commonRoute.emailRedirection}
          element={<EmailRedirection />}
        />
        <Route path="/temp" element={<Temp />} />
        <Route path="/success" element={<TempSuccess />} />
        <Route path="/cancel" element={<TempCancel />} />
        <Route path={commonRoute.signup} element={<Selection />} />
        <Route path={commonRoute.register} element={<Register />} />
        <Route path={commonRoute.forgotPassword} element={<ForgotPassword />} />
        <Route
          path="*"
          element={
            <Navigate
              replace
              to={loginRoute}
              state={{ redirectRoute: window.location.pathname }}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AuthRoutes;
