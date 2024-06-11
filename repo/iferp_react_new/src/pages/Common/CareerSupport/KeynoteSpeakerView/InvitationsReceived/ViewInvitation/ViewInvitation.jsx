import Card from "components/Layout/Card";
import Button from "components/form/Button";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  icons,
  speakerUploadedFile,
  welcomeMessage,
  welcomeVideo,
} from "utils/constants";
import DocumentUpload from "../../SpeakerApplications/ApplicationView/DocumentUpload";
import { useDispatch } from "react-redux";
import {
  downloadFile,
  generatePreSignedUrl,
  getDataFromLocalStorage,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import {
  changeStatus,
  fetchInviteSpeakerDetails,
  throwSuccess,
} from "store/slices";
import { useEffect } from "react";
import Loader from "components/Layout/Loader";
import SpeakerPoster from "pages/Admin/CareerManagement/BecomeKeynoteSpeaker/AllApplications/SentInvitationForm/SpeakerPoster";

const ViewInvitation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [posterDetails, setPosterDetails] = useState("");
  const [isPdfURL, setIsPdfURL] = useState(null);
  const [isWelcomeVideo, setIsWelcomeVideo] = useState(null);
  const [isWelcomePdf, setIsWelcomePdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const {
    first_name,
    last_name,
    institution_name: instituteName,
    profile_photo_path,
    professional_details = {},
  } = getDataFromLocalStorage() || {};
  const { designation, institution_name } = professional_details;

  const getInvitationDetails = async () => {
    setIsLoading(true);
    const fomData = objectToFormData({ id: params?.id });
    const response = await dispatch(fetchInviteSpeakerDetails(fomData));
    if (response?.status === 200) {
      setViewDetails(response?.data);
      let downloadWelcomePdf = "";
      let welcomePdf = "";
      let welcomeVideoURL = "";
      if (response?.data?.speaker_file_upload) {
        downloadWelcomePdf = await generatePreSignedUrl(
          response?.data?.speaker_file_upload,
          speakerUploadedFile
        );
        setIsPdfURL(downloadWelcomePdf);
      }
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
    }
    setIsLoading(false);
  };

  const handleStatus = async (data) => {
    const payload = {
      id: viewDetails?.id,
      status: data === "Accept" ? 1 : 2,
      speaker_poster: posterDetails,
    };
    const formData = objectToFormData(payload);
    const response = await dispatch(changeStatus(formData));
    if (response.status === 200) {
      dispatch(throwSuccess(response.message));
      getInvitationDetails();
    }
  };

  useEffect(() => {
    getInvitationDetails();
    // return () => {
    //   if (localStorage.prevRoute) {
    //     localStorage.removeItem("prevRoute");
    //   }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { event_name = "", speaker_poster } = viewDetails || {};
  return (
    <div id="view-invitation-container">
      {isLoading ? (
        <Card className="cpt-80 cpb-80">
          <Loader size="md" />
        </Card>
      ) : (
        <>
          <Card className="d-flex align-items-center unset-br cps-15 cpt-15 cpe-15 cpb-15 cmb-20">
            <span
              className="d-flex"
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
            <div className="text-16-400-19">
              {viewDetails?.event_name}
              {/* International Conference on Multidisciplinary Approaches in
              Technology and Social Development (ICMATSD) */}
            </div>
          </Card>

          <Card className="cmb-20">
            <div className="d-flex align-items-center cps-15 cpt-15 cpe-15 cpb-15">
              <div className="text-15-500-18">Welcome Message</div>
            </div>
            <hr className="unset-m unset-p" />
            <div className="row cps-20 cpe-28 cpt-22 cpb-22">
              {/* <div className="cmb-5 text-14-400-22">Hello Sir/Madam</div>
              <div className="cmb-5 text-14-400-22">Greeting Of The Day</div>
              <div className="cmb-30 text-14-400-22">
                Congratulation your profile has been selected
              </div> */}
              <div
                className="cmb-20 text-14-400-22"
                dangerouslySetInnerHTML={{
                  __html: titleCaseString(viewDetails?.messages),
                }}
              >
                {/* Myself Karthik raja working as a Liaison Manager for IFERP
                (Institute for Engineering research and publication) We conduct
                international conferences and publish research papers in our
                associated journals IFERP is conducting an upcoming
                International Conference titled as (Conference name ) that be
                held on (Dates ) in ( Host country ) We would like to notify you
                that your profile has been selected to be an Honorary Session
                speaker for the (Session name) of the (Conference name ) by the
                organizing committee members of (Conference name ) You have been
                recommended as a person with respected knowledge and experience,
                and as one who will make a valuable contribution to this
                conference event. Your presence will create a benchmark in
                stepping towards the success of this event. Therefore we
                cordially invite you and request you to kindly let us know about
                your availability as a Honorable Virtual Session speaker for the
                Session name of Conference name on Conference dates. Kindly find
                the additional details in the below provided conference website
                &amp; conference brochure along with the benefits you can avail
                as a keynote speaker . */}
              </div>

              {!speaker_poster && (
                <div className="d-flex justify-content-start cmb-30">
                  <SpeakerPoster
                    isVisible
                    data={{
                      name: `${first_name} ${last_name}`,
                      profile_photo_path,
                      designation,
                      institution_name,
                      event_name,
                      instituteName,
                    }}
                    onChange={(e) => {
                      setPosterDetails(e);
                    }}
                  />
                </div>
              )}
              <div className="row cps-20">
                {viewDetails?.speaker_file_upload && (
                  <div className="col-md-7 bg-gray-blue cps-10 cpt-10 cpe-10 cpb-10 d-flex align-items-center justify-content-between cmb-22">
                    <div className="d-flex align-items-center gap-3">
                      <img src={icons?.file} alt="file" />
                      <div className="d-flex flex-column">
                        <span className="text-14-500-21">
                          {viewDetails?.speaker_file_upload}
                        </span>
                        {/* <span className="text-10-400-15">
                          PDF file, 324 kb{" "}
                        </span> */}
                      </div>
                    </div>
                    <div>
                      <Button
                        text="Download"
                        isSquare
                        btnStyle="primary-dark"
                        className="cps-10 cpe-10 gap-2"
                        icon={<img src={icons.download} alt="logo" />}
                        onClick={() => {
                          dispatch(downloadFile(isPdfURL));
                        }}
                      />
                    </div>
                  </div>
                )}
                {viewDetails?.status === "Pending" && (
                  <div className="d-flex gap-3">
                    <Button
                      text="Accept"
                      isSquare
                      btnStyle="primary-dark"
                      className="cps-20 cpe-20 text-16-500"
                      onClick={() => {
                        handleStatus("Accept");
                      }}
                    />
                    <Button
                      text="Reject"
                      isSquare
                      btnStyle="gray-dark"
                      className="cps-20 cpe-20 text-16-500"
                      onClick={() => {
                        handleStatus("Reject");
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
          {viewDetails?.status === "Accepted" && (
            <DocumentUpload
              getInvitationDetails={getInvitationDetails}
              viewDetails={viewDetails}
              isWelcomePdf={isWelcomePdf}
              isWelcomeVideo={isWelcomeVideo}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ViewInvitation;
