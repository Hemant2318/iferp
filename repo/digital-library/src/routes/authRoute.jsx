import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { commonRoute } from "utils/constants";
import LandingPage from "pages/Auth/LandingPage";
import Login from "pages/Auth/Login";
import Typography from "pages/Typography";
import Signup from "pages/Auth/Signup/Signup";
import OrganizationRegister from "pages/Auth/Signup/Register/OrganizationRegister";
import OrganizationDetail from "pages/Auth/Signup/Register/OrganizationDetail";

const authRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path={commonRoute.login} element={<Login />} />
        <Route path={commonRoute.signup} element={<Signup />} />
        <Route path={commonRoute.register} element={<OrganizationRegister />} />
        <Route
          path={commonRoute.registerDetails}
          element={<OrganizationDetail />}
        />
        <Route path={commonRoute.typography} element={<Typography />} />
        <Route path="*" element={<Navigate replace to="" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default authRoute;
