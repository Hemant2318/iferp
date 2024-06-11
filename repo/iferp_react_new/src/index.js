import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import reportWebVitals from "reportWebVitals";
import App from "App";
import store from "store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "index.css";
import "assets/main.scss";
import "react-tooltip/dist/react-tooltip.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(() => {
      // console.log('registration--', registration);
      // console.log('Registration successful, scope is:', registration.scope);
    })
    .catch((err) => {
      console.log("Service worker registration failed, error:", err);
    });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
