import Card from "components/Layout/Card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { icons, welcomeMessage, welcomeVideo } from "utils/constants";
import DocumentUpload from "./DocumentUpload";
import { useDispatch } from "react-redux";
import {
  generatePreSignedUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { fetchInviteSpeakerDetails } from "store/slices";
import Loader from "components/Layout/Loader";

const ApplicationView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [isWelcomeVideo, setIsWelcomeVideo] = useState(null);
  const [isWelcomePdf, setIsWelcomePdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({});

  const getApplicationView = async () => {
    setIsLoading(true);

    const fomData = objectToFormData({ id: params?.id });
    const response = await dispatch(fetchInviteSpeakerDetails(fomData));
    if (response?.status === 200) {
      setApplicationData(response?.data);
      let welcomePdf = "";
      let welcomeVideoURL = "";
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

  useEffect(() => {
    getApplicationView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="application-view-container">
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
              {titleCaseString(applicationData?.event_name)}
            </div>
          </Card>

          {/* <Card className="cmb-20">
            <div className="d-flex align-items-center cps-15 cpt-15 cpe-15 cpb-15">
              <div className="text-15-500-18">Welcome Message</div>
            </div>
            <hr className="unset-m unset-p" />
            <div className="row cps-20 cpe-28 cpt-22 cpb-22">
              <div className="cmb-5 text-14-400-22">Hello Sir/Madam</div>
              <div className="cmb-5 text-14-400-22">Greeting Of The Day</div>
              <div className="cmb-30 text-14-400-22">
                Congratulation your profile has been selected
              </div>
              <div className="cmb-20 text-14-400-22">
                Myself Karthik raja working as a Liaison Manager for IFERP
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
                as a keynote speaker .
              </div>
              <div className="row cps-20">
                <div className="col-md-7 bg-gray-blue cps-10 cpt-10 cpe-10 cpb-10 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <img src={icons?.file} alt="file" />
                    <div className="d-flex flex-column">
                      <span className="text-14-500-21">
                        ICMATSD Conference Poster - 2022{" "}
                      </span>
                      <span className="text-10-400-15">PDF file, 324 kb </span>
                    </div>
                  </div>
                  <div>
                    <Button
                      text="Download"
                      isSquare
                      btnStyle="primary-dark"
                      className="cps-10 cpe-10 gap-2"
                      icon={<img src={icons.download} alt="logo" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card> */}
          {applicationData?.status === "Accepted" && (
            <DocumentUpload
              getInvitationDetails={getApplicationView}
              viewDetails={applicationData}
              isWelcomePdf={isWelcomePdf}
              isWelcomeVideo={isWelcomeVideo}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationView;
