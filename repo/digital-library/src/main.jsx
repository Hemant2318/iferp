import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
// import { BrowserRouter } from "react-router-dom";
import store from "store";
import App from "./App";
import "assets/css/common.scss";
import "assets/css/typography.scss";
import "assets/css/color.scss";
import "assets/css/animation.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
