import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "routes/appRoutes";
import AuthRoutes from "routes/authRoutes";
import ErrorPopup from "components/Layout/ErrorPopup";
import NoInternet from "components/Layout/NoInternet";
import WebsiteMaintenance from "components/Layout/WebsiteMaintenance/WebsiteMaintenance";
import "assets/main.scss";

const ClientID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const { userData, state } = useSelector((state) => ({
    userData: state.auth.userData,
  }));
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateOnlineStatus = () => {
    const isOnlineStatus = !!navigator.onLine;
    setIsOnline(isOnlineStatus);
  };
  useEffect(() => {
    const handleInspect = (e) => {
      // if (!isAllowedUser()) {
      e.preventDefault();
      alert("Inspect element is disabled for this user.");
      // }
    };

    document.addEventListener("contextmenu", handleInspect);

    window.addEventListener("offline", updateOnlineStatus);
    window.addEventListener("online", updateOnlineStatus);
  }, []);

  const isAuthenticated = localStorage.userData ? true : false;
  const isUnderMaintenance = false;

  console.log("userData", userData);

  const isAllowedUser = () => {};
  return (
    <div className="App bg-ghost-white">
      <ErrorPopup />
      {isUnderMaintenance ? (
        <WebsiteMaintenance />
      ) : isOnline ? (
        isAuthenticated ? (
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        ) : (
          <GoogleOAuthProvider clientId={ClientID}>
            <AuthRoutes />
          </GoogleOAuthProvider>
        )
      ) : (
        <NoInternet />
      )}
    </div>
  );
};

export default App;
