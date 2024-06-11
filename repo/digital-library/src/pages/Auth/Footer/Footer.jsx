import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader } from "components";
import { icons } from "utils/constants";
import { trimLeftSpace, objectToFormData } from "utils/helpers";
import { singUpNewsLetter } from "store/globalSlice";
import "./Footer.scss";

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleSave = async () => {
    if (validateEmail(email)) {
      setLoader(true);
      const payload = {
        email: email,
        source: "Digital Library",
      };
      const response = await dispatch(
        singUpNewsLetter(objectToFormData(payload))
      );
      if (response?.status === 200) {
        setEmail("");
      }
      setLoader(false);
    }
  };
  return (
    <>
      <div className="bg-4A60" id="Footer_container">
        <div className="container bg-4A60 footer cpb-30">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="footer_logo">
                <img src={icons.iferpLogoWithBg} alt="Logo" />
                <div className="text-18-500 color-f6f6 cmt-40 cmb-28">
                  Subscribe To Our Newsletter
                </div>
                <div className="email-input-container">
                  <input
                    type="text"
                    className="email_input"
                    placeholder="Enter your Email ID"
                    value={email}
                    onChange={(e) => {
                      setEmail(trimLeftSpace(e.target.value?.toLowerCase()));
                    }}
                  />
                  {loader ? (
                    <div className="loader-bl f-center">
                      <Loader size="sm" variant="light" />
                    </div>
                  ) : (
                    <img
                      src={icons.successRightRound}
                      alt="right"
                      className="icon-right-block pointer"
                      onClick={handleSave}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-18-500 color-ffff mb-2">Quick Links</div>
              <div className="text-16-400 color-f8f8 fa-center gap-5 mb-2">
                <span
                  className="pointer"
                  onClick={() => navigate("/top-researchers")}
                >
                  Researchers
                </span>
                <span
                  className="pointer"
                  onClick={() => navigate("/conference")}
                >
                  Conferences
                </span>
                <span
                  className="pointer"
                  onClick={() => navigate(`/post/scientific-events`)}
                >
                  Scientific Events
                </span>
                <span
                  className="pointer"
                  onClick={() => navigate("/post/articles")}
                >
                  Articles
                </span>
              </div>
              <div className="text-16-400 color-f8f8 fa-center gap-5">
                <span className="pointer" onClick={() => navigate("/post")}>
                  Posts
                </span>
                <span
                  className="pointer"
                  onClick={() => navigate("/post/institutions")}
                >
                  Institutions
                </span>
                <span
                  className="pointer"
                  onClick={() => navigate("/post/community")}
                >
                  Community
                </span>
              </div>
              <div className="text-18-500 color-ffff mb-2 cmt-30">
                Contact Us
              </div>
              <div
                className="text-16-400 color-f8f8 mb-3 pointer"
                onClick={() => {
                  window.open(
                    "mailto:queries@researchpedia.com?subject=Your%20Subject&body=Your%20Body",
                    "_blank"
                  );
                }}
              >
                Queries: queries@researchpedia.com
              </div>
              <div
                className="text-16-400 color-f8f8 pointer"
                onClick={() => {
                  window.open(
                    "mailto:help@researchpedia.org?subject=Your%20Subject&body=Your%20Body",
                    "_blank"
                  );
                }}
              >
                Help: help@researchpedia.org
              </div>
            </div>
          </div>
        </div>
        <div className="footer_line" />
        <div className="container fb-center gap-2 cpt-20 cpb-20">
          <div className="text-16-400 color-f8f8">
            © 2024 ResearchPedia. Copyright and rights reserved
          </div>
          <div className="fa-center gap-4">
            <span className="facebook-block">
              <img src={icons.footerFacebook} alt="facebook" />
            </span>
            <span className="twitter-block">
              <img src={icons.footerTwitter} alt="twitter" />
            </span>
            <span className="instagram-block">
              <img src={icons.footerInstagram} alt="instagram" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default Footer;
