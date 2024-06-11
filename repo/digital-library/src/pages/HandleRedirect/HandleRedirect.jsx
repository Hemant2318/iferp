import { useEffect } from "react";
import { useNavigate } from "react-router";
import { decrypt, storeLocalStorageData } from "utils/helpers";
import "./HandleRedirect.scss";

const HandleRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("data");
    const decData = decrypt(myParam);
    const { data, token } = decData || {};
    const { type, post_type, event_id } = data || {};
    if (token) {
      storeLocalStorageData({ token: decData?.token });
      let redirectURL = "";
      switch (type) {
        case "POST":
          redirectURL = `/post/${post_type}`;
          break;
        case "Top Conference":
          if (event_id) {
            redirectURL = `/conference/${event_id}`;
          } else {
            redirectURL = "/conference";
          }
          break;
        case "Trending Research Presentations":
          redirectURL = "/all-trending-research-presentations";
          break;
        case "Top Researchers":
          redirectURL = "/top-researchers";
          break;
        default:
          redirectURL = "/invalid-token";
          break;
      }
      navigate(redirectURL);
      window.location.reload();
    } else {
      navigate("/invalid-token");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="handleredirect-container">
      <div className="center">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
};

export default HandleRedirect;
