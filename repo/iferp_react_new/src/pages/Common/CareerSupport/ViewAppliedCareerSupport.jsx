import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import {
  careerPath,
  icons,
  profilePath,
  speakerPost,
  welcomeMessage,
  welcomeVideo,
} from "utils/constants";
import {
  downloadFile,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  getFilenameFromUrl,
} from "utils/helpers";
import { getSingleAppliedCareer } from "store/slices";
import { useDispatch } from "react-redux";
import Loader from "components/Layout/Loader";
import ShareButton from "components/Layout/ShareButton";

const ViewAppliedCareerSupport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef();

  const params = useParams();
  const { type, careerId } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [careerDetails, setCareerDetails] = useState([]);
  const [playButtonVisible, setPlayButtonVisible] = useState(true);
  const [isWelcomeVideo, setIsWelcomeVideo] = useState(null);
  const [isWelcomePdf, setIsWelcomePdf] = useState(null);
  const [isSpeakerPoster, setIsSpeakerPoster] = useState(null);

  const [allData, setAllData] = useState({});
  const getTitle = () => {
    switch (type) {
      case "2":
        return "Placement Traning";
      case "3":
        return "Internship";
      case "5":
        return "Patent Filing Assistance";
      case "6":
        return "Become A Keynote Speaker";
      case "7":
        return "Committee Member";
      case "8":
        return "Editorial Board Member/Reviewer";
      case "9":
        return "Become A Session Chair";
      case "10":
        return "Opportunity For Book Writing";
      case "11":
        return "Proposal Writing Assistance for DST/SERB/AICTE";
      case "12":
        return "People In The News";
      case "13":
        return "Research Enhancement";
      case "14":
        return "Center of Excellence (COE)";
      case "15":
        return "Funds & Grants";
      case "16":
        return "Post A Job";
      case "17":
        return "Conduct Training";
      default:
        return "";
    }
  };
  const getArray = (careerData) => {
    let {
      venue,
      professional_skills,
      soft_skills,
      area_of_interest,
      strength,
      weakness,
      resume_building_guidance,
      cv_file,
      organization_type,
      comments,
      invention_disclosure_form,
      attachment_file,
      event_name,
      designation,
      recent_presentation,
      specialization,
      url_latest_lecture_video,
      event_name: eventName,
      committee_member_category_name,
      photo_path,
      personal_linkedin_url,
      expected_result_of_project,
      project_methodologies,
      project_proposal,
      journals_name,
      register_as,
      research_area,
      no_of_article_published,
      peer_review_experience,
      editorial_board_experience,
      experience_session_chair,
      topics,
      note_previous_publication,
      book_chapter_form,
      proposal_assistance_form,
      work_for,
      total_experience,
      teaching_experience,
      industry_experience,
      article_title,
      article_website_link,
      published_date,
      short_description,
    } = careerData;
    switch (type) {
      case "2":
        setCareerDetails([
          {
            key: "Venue",
            value: venue,
          },
          {
            key: "Professional Skills",
            value: professional_skills,
          },
          {
            key: "Soft Skills",
            value: soft_skills,
          },
          {
            key: "Area of Interest",
            value: area_of_interest,
          },
          {
            key: "Strength",
            value: strength,
          },
          {
            key: "Weakness",
            value: weakness,
          },
          {
            key: "Resume building Guidance",
            value: resume_building_guidance ? "Yes" : "No",
          },
          {
            key: "CV",
            value: getFilenameFromUrl(cv_file),
            downloadFileURL: cv_file,
            isDownload: true,
          },
        ]);
        break;
      case "5":
        setCareerDetails([
          {
            key: "Patent Services",
            value: organization_type.replace(/,/g, ", "),
          },
          {
            key: "Comments",
            value: comments,
          },
          {
            key: "Invention Disclosure Form",
            value: getFilenameFromUrl(invention_disclosure_form),
            downloadFileURL: invention_disclosure_form,
            isDownload: true,
          },
          {
            key: "Attachment",
            value: getFilenameFromUrl(attachment_file),
            downloadFileURL: attachment_file,
            isDownload: true,
          },
        ]);
        break;
      case "6":
        setCareerDetails([
          {
            key: "Designation",
            value: designation,
          },
          {
            key: "Specialization",
            value: specialization,
          },
          {
            key: "Conference Name",
            value: event_name,
          },
          {
            key: "Recent Presentation",
            value: getFilenameFromUrl(recent_presentation),
            downloadFileURL: recent_presentation,
            isDownload: true,
          },
          {
            key: "URL of latest lecture video",
            value: url_latest_lecture_video,
          },
        ]);
        break;
      case "7":
        setCareerDetails([
          {
            key: "Conference Name",
            value: eventName,
          },
          {
            key: "Committee Member Category",
            value: committee_member_category_name,
          },
          {
            key: "Recent Presentation",
            value: getFilenameFromUrl(photo_path),
            downloadFileURL: photo_path,
            isDownload: true,
          },
        ]);
        break;
      case "8":
        setCareerDetails([
          {
            key: "Journal",
            value: journals_name,
          },
          {
            key: "Register As",
            value: register_as,
          },
          {
            key: "Enter Research Area",
            value: research_area,
          },
          {
            key: "No. of Articles Published",
            value: no_of_article_published,
          },
          {
            key: "Peer review Experience",
            value: peer_review_experience,
          },
          {
            key: "Editorial Board Experience",
            value: editorial_board_experience,
          },
        ]);
        break;
      case "9":
        setCareerDetails([
          {
            key: "Specialization",
            value: specialization,
          },
          {
            key: "Experience as a session chair",
            value: experience_session_chair,
          },
          {
            key: "CV",
            value: getFilenameFromUrl(cv_file),
            downloadFileURL: cv_file,
            isDownload: true,
          },
        ]);
        break;
      case "10":
        setCareerDetails([
          {
            key: "Specialization",
            value: specialization,
          },
          {
            key: topics ? "Topics for book chapter" : "Previous publication",
            value: topics || note_previous_publication,
          },
          {
            key: cv_file ? "CV" : "Upload Book Chapter Form",
            value: getFilenameFromUrl(cv_file || book_chapter_form),
            downloadFileURL: cv_file || book_chapter_form,
            isDownload: true,
          },
        ]);
        break;
      case "11":
        setCareerDetails([
          {
            key: "Specialization",
            value: specialization,
          },
          {
            key: "Proposal Writing Assistance Form",
            value: getFilenameFromUrl(proposal_assistance_form),
            downloadFileURL: proposal_assistance_form,
            isDownload: true,
          },
        ]);
        break;
      case "12":
        setCareerDetails([
          {
            key: "Article Title",
            value: article_title,
          },
          {
            key: "Short Description",
            value: short_description,
          },
          {
            key: "Full Article Website Link",
            value: article_website_link,
          },
          {
            key: "Published Date",
            value: published_date,
          },
        ]);
        break;
      case "13":
        setCareerDetails([
          {
            key: "Specialization",
            value: specialization,
          },
          {
            key: "Researh consultant for",
            value: work_for,
          },
          {
            key: "Total experience",
            value: total_experience,
          },
          {
            key: "Teaching Experience",
            value: teaching_experience,
          },
          {
            key: "Industry Experience",
            value: industry_experience,
          },
        ]);
        break;
      case "15":
        setCareerDetails([
          {
            key: "Specialization",
            value: specialization,
          },
          {
            key: "Personal LinkedIn URL",
            value: personal_linkedin_url,
          },
          {
            key: "Expected Results of the Project",
            value: expected_result_of_project,
          },
          {
            key: "Project Implementation and management methodologies",
            value: project_methodologies,
          },
          {
            key: "Project proposal",
            value: getFilenameFromUrl(project_proposal),
            downloadFileURL: project_proposal,
            isDownload: true,
          },
          {
            key: "CV/Biodata",
            value: getFilenameFromUrl(cv_file),
            downloadFileURL: cv_file,
            isDownload: true,
          },
        ]);
        break;
      default:
        break;
    }
  };
  const fetchCareerDetails = async () => {
    setIsLoading(true);
    let stringParams = `id=${careerId}&type=${type}`;
    if (localStorage.careerUserID) {
      stringParams += `&user_id=${localStorage.careerUserID}`;
    }
    const response = await dispatch(getSingleAppliedCareer(stringParams));
    console.log("response:", response);
    setAllData(response?.data || {});
    getArray(response?.data || {});
    let welcomePdf = "";
    let welcomeVideoURL = "";
    let speakerPoster = "";
    if (response?.data?.welcome_messages) {
      welcomePdf = await generatePreSignedUrl(
        response?.data?.welcome_messages,
        welcomeMessage
      );
      setIsWelcomePdf(welcomePdf);
    }
    if (response?.data?.welcome_video) {
      welcomeVideoURL = await generatePreSignedUrl(
        response?.data?.welcome_video,
        welcomeVideo
      );
      setIsWelcomeVideo(welcomeVideoURL);
    }
    if (response?.data?.speaker_poster) {
      speakerPoster = await generatePreSignedUrl(
        response?.data?.speaker_poster,
        speakerPost
      );
      setIsSpeakerPoster(speakerPoster);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchCareerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const data = getDataFromLocalStorage();
  const {
    first_name,
    last_name,
    email_id,
    phone_number,
    personal_details: personalDetails = {},
    user_type,
  } = data;
  const { city_name, state_name, country_name } = personalDetails;
  const isAdmin = ["0", "6"].includes(user_type);
  const name = isAdmin ? allData?.name : `${first_name} ${last_name}`;
  const emailID = isAdmin ? allData?.email : email_id;
  const mobileNumber = isAdmin ? allData?.mobile_number : phone_number;
  const country = isAdmin ? allData?.country : country_name;
  const state = isAdmin ? allData?.state : state_name;
  const city = isAdmin ? allData?.city : city_name;

  const pageData = [
    {
      key: "Name",
      value: name || "",
      isDownload: false,
    },
    {
      key: "Email ID",
      value: emailID || "",
      isDownload: false,
    },
    {
      key: "Contact Number",
      value: mobileNumber || "",
      isDownload: false,
    },
    {
      key: "Country",
      value: country || "",
      isDownload: false,
    },
    {
      key: "State/Province",
      value: state,
      isDownload: false,
    },
    {
      key: "City",
      value: city || "",
      isDownload: false,
    },
    ...careerDetails,
  ];

  return (
    <>
      {isLoading ? (
        <Card className="cps-30 cpe-30 cpt-26 cpb-26">
          <div className="center-flex pt-5 pb-5">
            <Loader size="md" />
          </div>
        </Card>
      ) : (
        <>
          <Card className="cps-30 cpe-30 cpt-26 cpb-26">
            <div className="d-flex position-relative">
              <span
                className="d-flex position-absolute start-0"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <img
                  src={icons.leftArrow}
                  alt="back"
                  className="h-21 me-3 pointer"
                />
              </span>
              <div className="text-16-400 color-black-olive cps-40">
                {getTitle(type)}
              </div>
            </div>
            <div className="row cmt-30">
              {pageData.map((elem, index) => {
                const { key, value, isDownload, downloadFileURL } = elem;
                return (
                  <React.Fragment key={index}>
                    <div className="col-md-4 cmb-16 text-16-400 d-flex align-items-center">
                      {key}
                    </div>
                    <div className="col-md-8 cmb-16 text-16-500 d-flex align-items-center gap-3">
                      {value}
                      {isDownload && (
                        <div className="d-flex">
                          <Button
                            text="Download"
                            btnStyle="primary-light"
                            className="h-35 text-14-400"
                            onClick={async () => {
                              const nPath =
                                type === "7" ? profilePath : careerPath;
                              const newDownloadFileURL =
                                await generatePreSignedUrl(
                                  downloadFileURL,
                                  nPath
                                );
                              dispatch(downloadFile(newDownloadFileURL));
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </Card>
          {type === "6" && allData?.welcome_video && (
            <div className="row g-0" id="view-application-welcome-video">
              <Card
                className={
                  isSpeakerPoster
                    ? "cmt-30 cps-30 cpe-30 cpt-26 cpb-26 col-md-8"
                    : ""
                }
              >
                <div className="d-flex align-items-center cps-20 cpt-15 cpe-15 cpb-15">
                  <div className="text-15-500-18">Documents</div>
                </div>
                <hr className="unset-m unset-p" />
                <div className="row cps-20 cpt-15 cpe-20">
                  {welcomeVideo && (
                    <>
                      {allData?.welcome_video && (
                        <>
                          <div className="col-md-5">
                            <div className="position-relative">
                              <video
                                controls
                                ref={videoRef}
                                width="100%"
                                poster={icons.tempVideoPoster}
                                preload="none"
                                style={{
                                  background: `transparent url(${icons.tempVideoPoster}) 50% 50% / cover no-repeat`,
                                  marginTop: "20px",
                                }}
                                onPlay={() => {
                                  setPlayButtonVisible(false);
                                }}
                              >
                                <source src={isWelcomeVideo} type="video/mp4" />
                              </video>
                              {playButtonVisible && (
                                <div
                                  className="btn-vd-play"
                                  onClick={() => {
                                    if (videoRef.current) {
                                      videoRef.current.play();
                                    }
                                  }}
                                >
                                  <i className="bi bi-play-fill" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-7 cmb-20">
                            <div className="text-15-500-18 cmb-12">
                              Welcome Video
                            </div>
                            {name && (
                              <div className="text-14-400-17 mb-2">{name}</div>
                            )}
                            <div className="text-14-400-17 cmb-12">
                              Keynote Speaker
                            </div>
                            <div className="d-flex gap-3">
                              <Button
                                text="Download"
                                isSquare
                                btnStyle="primary-dark"
                                className="cps-10 cpe-10 gap-2"
                                icon={<img src={icons.download} alt="logo" />}
                                onClick={() => {
                                  dispatch(downloadFile(isWelcomeVideo));
                                }}
                              />
                              <ShareButton url={isWelcomeVideo} type="VIDEO" />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {isWelcomePdf && (
                    <div className="row cps-20">
                      <div className="col-md-12 bg-gray-blue cps-10 cpt-10 cpe-10 cpb-10 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <img src={icons?.file} alt="file" />
                          <div className="d-flex flex-column">
                            <span className="text-14-500-21">
                              {allData?.welcome_messages}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Button
                            text="Preview Document"
                            isSquare
                            btnStyle="primary-dark"
                            className="cps-10 cpe-10 gap-2"
                            onClick={() => {
                              dispatch(downloadFile(isWelcomePdf));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              {isSpeakerPoster && (
                <div className="col-md-4 cmt-30">
                  <div className="cps-30 cpe-30">
                    <div>
                      <img
                        src={isSpeakerPoster}
                        alt="boardImage"
                        className="fill-image"
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-3 pt-2">
                      <Button
                        isSquare
                        icon={<i className="bi bi-download me-2" />}
                        text="Download"
                        btnStyle="primary-outline"
                        className="h-35 text-13-400 cps-20 cpe-20"
                        onClick={() => {
                          dispatch(downloadFile(isSpeakerPoster));
                        }}
                      />
                      <ShareButton
                        type="SPEAKER"
                        url={isSpeakerPoster}
                        title=""
                      >
                        <Button
                          isSquare
                          icon={<i className="bi bi-share me-2" />}
                          text="Share"
                          btnStyle="primary-outline"
                          className="h-35 text-13-400 cps-20 cpe-20"
                          onClick={() => {}}
                        />
                      </ShareButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};
export default ViewAppliedCareerSupport;
