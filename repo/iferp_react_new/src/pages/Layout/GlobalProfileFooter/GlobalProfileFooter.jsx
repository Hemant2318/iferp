import Button from "components/form/Button";
import { icons } from "utils/constants";
import TextInputWithButton from "components/form/TextInputWithButton";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { singUpNewsLetter, throwError, throwSuccess } from "store/slices";
import { objectToFormData } from "utils/helpers";
import { useRef, useState } from "react";
import "./GlobalProfileFooter.scss";

const GlobalProfileFooter = () => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const isGProfile = window.location.pathname.includes(
    "global-research-profile"
  );

  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required.")
      .matches(/^\S*$/, "Whitespace is not allowed.")
      .email("Email must be a valid email"),
  });

  const handleNewsLetter = async (value) => {
    setIsLoading(true);
    const payload = {
      email: value?.email,
      source: isGProfile ? "Global Profile" : "Digital Library",
    };
    const response = await dispatch(
      singUpNewsLetter(objectToFormData(payload))
    );

    if (response?.status === 200) {
      if (formRef?.current) {
        formRef.current.resetForm();
      }
      dispatch(throwSuccess(response?.message));
      setIsLoading(false);
    } else {
      if (formRef?.current) {
        formRef.current.resetForm();
      }
      dispatch(throwError(response?.message));
      setIsLoading(false);
    }
  };

  const footerLinks = [
    {
      id: 1,
      title: "About",
      value: [
        { name: "About IFERP", link: "https://www.iferp.in/about-us.php" },
        {
          name: "Scopes & Opportunities",
          link: "https://www.iferp.in/scopes-and-opportunites.php",
        },
        { name: "Committee", link: "https://www.iferp.in/committee.php" },
        { name: "IFERP Speakers", link: "https://www.iferp.in/speaker.php" },
        {
          name: "Client Stories",
          link: "https://www.iferp.in/client-stories.php",
        },
        {
          name: "Associates & Partners",
          link: "https://www.iferp.in/our-associates-partners.php",
        },
      ],
    },
    {
      id: 2,
      title: "Membership",
      value: [
        { name: "About", link: "https://www.iferp.in/about-membership.php" },
        {
          name: "Student Membership",
          link: "https://www.iferp.in/iferp-student-memberships.php",
        },
        {
          name: "Professional Membership",
          link: "https://www.iferp.in/iferp-professional-memberships.php",
        },
        {
          name: "Institutional Membership",
          link: "https://www.iferp.in/iferp-institutional-memberships.php",
        },
        {
          name: "Corporate Membership",
          link: "https://www.iferp.in/corporate-memberships.php",
        },
        {
          name: "IFERP Ambassadors",
          link: "https://www.iferp.in/iferp-ambassadors.php",
        },
      ],
    },
    {
      id: 3,
      title: "Communities",
      value: [
        {
          name: "About IFERP Chapters",
          link: "https://www.iferp.in/about-iferp-chapter.php",
        },
        {
          name: "Student Chapters",
          link: "https://www.iferp.in/student-chapter.php",
        },
        {
          name: "Special Interest Community",
          link: "https://www.iferp.in/special-interest-community.php",
        },
        {
          name: "IFERP Chapters",
          link: "https://www.iferp.in/iferp-chapters.php",
        },
        {
          name: "Eminent Speaker Program",
          link: "https://www.iferp.in/eminent-speaker-program-chapters.php",
        },
      ],
    },
    {
      id: 4,
      title: "Conference",
      value: [
        {
          name: "About IFERP Conference",
          link: "https://www.iferp.in/about-iferp-conference.php",
        },
        {
          name: "Upcoming Conferences",
          link: "https://www.iferp.in/upcoming-international-conference.php",
        },
        {
          name: "Sponsors & Exhibitors",
          link: "https://www.iferp.in/sponsors-exhibitors.php",
        },
        {
          name: "Workshops & Courses",
          link: "https://www.iferp.in/workshop-courses.php",
        },
        {
          name: "Plan a Scientific Conference",
          link: "https://www.iferp.in/plan-scientific-conference.php",
        },
        {
          name: "Videos & Gallery",
          link: "https://www.iferp.in/conference-videos-galleries.php",
        },
      ],
    },
    {
      id: 5,
      title: "Publication",
      value: [
        {
          name: "About Publication",
          link: "https://www.iferp.in/iferp-publications.php",
        },
        {
          name: "Journals",
          link: "https://www.iferp.in/journals-and-publications.php",
        },
        {
          name: "Abstract Submission",
          link: "https://www.iferp.in/abstract-submission.php",
        },
        {
          name: "Call for Proposal",
          link: "https://dashboard.iferp.in/student/conferences-and-events/event-list/conference",
        },
        {
          name: "Conference Proceedings",
          link: "https://www.iferp.in/conference-proceedings.php",
        },
        {
          name: "Digital Library",
          link: "https://www.iferp.in/digital-library.php",
        },
      ],
    },
    {
      id: 6,
      title: "Resources",
      value: [
        {
          name: "Education & Career",
          link: "https://www.iferp.in/education-career-resources.php",
        },
        {
          name: "Research Consultancy",
          link: "https://www.iferp.in/research-consultancy.php",
        },
        {
          name: "Faculty Exchange Program",
          link: "https://www.iferp.in/faculty-exchange-programme.php",
        },
        {
          name: "Research Funding",
          link: "https://www.iferp.in/research-funding-opportunities.php",
        },
      ],
    },
  ];
  return (
    <div className="footer-block bg-white">
      {/* download our app block */}
      <div className="row g-0 cpt-50 cpb-50 cps-50 cpe-50">
        <div className="col-md-6 align-items-center d-flex justify-content-center">
          <div className="">
            <div className="text-34-600 color-105d cmb-30 lh-sm">
              Download Our App
            </div>
            <div className="text-16-400 color-0000 cmb-30">
              Get updates, discounts on events & enjoy seamless experience{" "}
            </div>
            <div className="text-16-400 color-0000 cmb-30">
              BOOST YOUR PRODUCTIVITY
            </div>

            <div className="d-flex gap-3 buttons-block flex-wrap">
              <div className="bg-0000 br-8 d-flex gap-2 cps-15 cpe-20 cpt-10 cpb-10">
                <div>
                  <img src={icons.appleIcon} alt="apple" />
                </div>
                <div className="color-white d-flex flex-column">
                  <span className="text-14-400">Download On</span>
                  <span className="text-18-500">App Store</span>
                </div>
              </div>
              <div className="bg-0000 br-8 d-flex gap-2 cps-15 cpe-20 cpt-10 cpb-10">
                <div>
                  <img src={icons.playstorIcon} alt="play" />
                </div>
                <div className="color-white d-flex flex-column">
                  <span className="text-14-400">GET IT ON</span>
                  <span className="text-18-500">Google Play</span>
                </div>
              </div>
              <div className="qr-code">
                <img src={icons.tempQR} alt="qr" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="footer-image cpt-10">
            <img
              src={icons.downloadAppImage}
              alt="app"
              className="info-image"
            />
          </div>
        </div>
      </div>

      {/* main footer */}
      <div className="footer-items-block">
        <div className="row g-0">
          <div className="col-md-4 bg-0f30 cps-50 cpe-50 cpt-50 cpb-50">
            <div className="bg-white br-2 cmb-10" style={{ width: "150px" }}>
              <img className="img-logo1" src={icons.logo} alt="img" />
            </div>
            <div className="text-15-500 color-white cmb-20">
              Technoarete Research & Development Association
            </div>
            <div className="text-18-500 cmb-10 color-white">Stay Connected</div>
            <div className="cmb-10 d-flex gap-2 align-items-center color-white">
              <div>
                <img src={icons.mobileIcon} alt="mobile" />
              </div>
              <span className="text-14-400">(+91) 76694 09022</span>
            </div>
            <div className="d-flex gap-2 align-items-center cmb-10 color-white">
              <div>
                <img src={icons.mailIcon} alt="mobile" />
              </div>
              <span className="text-14-400">info@iferp.in</span>
            </div>
            <div className="d-flex gap-3 align-items-center cmb-20">
              <div className="">
                <img src={icons.fillFBIcon} alt="fb" />
              </div>
              <div className="bg-0000 custom-icon">
                <img src={icons.twitterIcon} alt="fb" />
              </div>
              <div className="custom-icon instagram-bg">
                <img src={icons.instagramIcon} alt="fb" />
              </div>
              <div className="bg-64c5 custom-icon">
                <img src={icons.linkedinIcon} alt="fb" />
              </div>
            </div>

            <div className="dotted-border cmb-20"></div>
            <div className="text-18-500 cmb-10 color-white">Stay Updated</div>
            <div className="text-15-500 color-white cmb-20">
              Get updates on the latest opportunities, conferences & many more
            </div>
            <Formik
              initialValues={initialValues}
              onSubmit={handleNewsLetter}
              validationSchema={validationSchema}
              innerRef={formRef}
            >
              {(props) => {
                const { handleSubmit, handleChange, values, errors } = props;
                return (
                  <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(e);
                      }
                    }}
                  >
                    <TextInputWithButton
                      id="email"
                      value={values?.email}
                      error={errors?.email}
                      placeholder="Sign up for our newsletter"
                      onChange={handleChange}
                      disabled={!values?.email}
                      onClick={handleSubmit}
                      isLoading={isLoading}
                    />
                  </form>
                );
              }}
            </Formik>

            <div className="d-flex gap-3 align-items-center flex-wrap">
              <div className="bg-white br-2 cmb-10" style={{ width: "150px" }}>
                <img className="img-logo1" src={icons.logo} alt="img" />
              </div>
              <div className="text-14-500 color-white">A unit of</div>
              <div
                className="bg-white br-2 cmb-10 cpt-15 cpb-15 d-flex align-items-center justify-content-center"
                style={{ width: "130px" }}
              >
                <img
                  className="img-logo1"
                  src={icons.technorateLogo}
                  alt="img"
                />
              </div>
            </div>
          </div>
          <div className="col-md-8 bg-103a cps-50 cpe-50 cpt-50 cpb-50">
            <div className="row">
              {footerLinks.map((elem, index) => {
                const { title, value } = elem;
                return (
                  <div className="col-md-4 cmb-20" key={index}>
                    <div className="text-18-500 color-white cmb-20">
                      {title}
                    </div>
                    {value.map((vElem, vIndex) => {
                      const { name, link } = vElem;
                      return (
                        <div
                          key={vIndex}
                          className={`${
                            link && "hover-link pointer"
                          } text-14-400 color-f3f3 cmb-10`}
                          onClick={() => {
                            window.open(link, "_blank");
                          }}
                        >
                          {name}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* payment footer */}
      <div className="bg-white cps-50 cpe-50 cpt-20 cpb-20 row d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between col-md-8 col-sm-4 flex-wrap">
          <div>
            <Button
              className="gap-2 text-15-500"
              btnStyle="secure-button"
              text="100% safe & secure payment"
              icon={<img src={icons.secureIcon} alt="secure" />}
            />
          </div>
          <div>
            <img src={icons.razorPayImage} alt="rPay" />
          </div>
          <div>
            <img src={icons.visaImage} alt="visaPay" />
          </div>
          <div>
            <img src={icons.UPIImage} alt="upiPay" />
          </div>
          <div>
            <img src={icons.masterCardImage} alt="mastercardPay" />
          </div>
          <div>
            <img src={icons.rupayImage} alt="rupayPay" />
          </div>
        </div>
        <div className="col-md-4 col-sm-8">
          <div className="d-flex align-items-center gap-4 justify-content-center">
            <div className="text-16-400 color-103A">Terms</div>
            <div className="text-16-400 color-103A">Privacy</div>
            <div className="text-16-400 color-103A">Sitemap</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalProfileFooter;
