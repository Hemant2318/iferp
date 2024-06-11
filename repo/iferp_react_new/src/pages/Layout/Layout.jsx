import { useDispatch, useSelector } from "react-redux";
import ChatNow from "components/Layout/ChatNow";
import { setIsFeedback } from "store/slices";
import { getDataFromLocalStorage } from "utils/helpers";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Feedback from "./Feedback";
import "./Layout.scss";

const Layout = ({ children, id }) => {
  const dispatch = useDispatch();
  const { isFeedback, isCollapseSidebar } = useSelector((state) => ({
    isFeedback: state.global.isFeedback,
    isCollapseSidebar: state.global.isCollapseSidebar,
  }));
  const access = {
    isFeedback: !["0", "6"].includes(getDataFromLocalStorage("user_type")),
    isChat:
      !["0", "6"].includes(getDataFromLocalStorage("user_type")) &&
      !window.location.pathname.includes("network/chat"),
  };
  return (
    <div id="Layout-container">
      <Sidebar />
      <main
        className={`main-body-content ${
          isCollapseSidebar ? "expand-all-body" : ""
        }`}
      >
        <Navbar />
        <div id={id} className="body-padding body-height iferp-scroll">
          {children}
        </div>
      </main>
      {isFeedback && <Feedback />}
      {access?.isFeedback && !isFeedback && (
        <div
          className="btn-feedback shadow"
          onClick={() => {
            dispatch(setIsFeedback(true));
          }}
        >
          <i className="bi bi-chat-square-dots me-2" />
          Feedback
        </div>
      )}
      {access?.isChat && <ChatNow />}
    </div>
  );
};
export default Layout;
