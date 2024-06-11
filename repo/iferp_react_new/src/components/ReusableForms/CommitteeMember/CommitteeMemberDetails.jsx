import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import { getSingleCommitteeMember, setRProfileID } from "store/slices";
import { icons } from "utils/constants";
import { titleCaseString } from "utils/helpers";

const CommitteeMemberDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const fetchMemverDetails = async () => {
    const response = await dispatch(getSingleCommitteeMember(params?.id));
    setDetails(response?.data || {});
    setLoading(false);
  };
  useEffect(() => {
    fetchMemverDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    user_id,
    photo_path,
    name,
    designation,
    institution_name,
    committee_member_category,
  } = details || {};
  return (
    <div id="committee-member-details-container">
      {isLoading ? (
        <Card className="cpt-80 cpb-80">
          <Loader size="md" />
        </Card>
      ) : (
        <Card className="unset-br cpe-26 cps-26 pt-4 pb-4 fadeInUp">
          <div className="w-100 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
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
              <div className="color-black-olive text-18-500">
                {committee_member_category}
              </div>
            </div>
          </div>
          <div className="d-flex cmt-24">
            <div className="cmb-34">
              <Profile text={name} url={photo_path} size="s-163" isS3UserURL />
            </div>
            <div className="cps-30 cpe-20">
              <div
                className="text-22-500 color-new-car pointer"
                onClick={() => {
                  dispatch(setRProfileID(user_id));
                }}
              >
                {titleCaseString(name)}
              </div>
              <div className="text-15-500 color-new-car mt-3 mb-1">
                {designation}
              </div>
              <div className="text-14-400 color-black-olive mb-3">
                {institution_name}
              </div>
              {/* <div>
              Mr. Craighead has more than 35 years of experience in investment
              research. He joined Bloomberg Intelligence in early 2010 in New
              York and transferred to Hong Kong in early 2012 to develop the
              Asia research team, where he also covered Asian strategy and the
              casino gaming industry. He relocated to London in his current role
              in 2016.
              <br />
              <br />
              Mr. Craighead has more than 35 years of experience in investment
              research. He joined Bloomberg Intelligence in early 2010 in New
              York and transferred to Hong Kong in early 2012 to develop the
              Asia research team, where he also covered Asian strategy and the
              casino gaming industry. He relocated to London in his current role
              in 2016.
              <br />
              <br />
              Mr. Craighead has more than 35 years of experience in investment
              research. He joined Bloomberg Intelligence in early 2010 in New
              York and transferred to Hong Kong in early 2012 to develop the
              Asia research team, where he also covered Asian strategy and the
              casino gaming industry. He relocated to London in his current role
              in 2016.
            </div> */}
            </div>
          </div>
        </Card>
      )}
      {/* <Card className="unset-br cpe-26 cps-26 pt-5 pb-4 mt-3">
        <div className="color-raisin-black text-20-500 cmb-20">
          Achievements
        </div>

        <ul>
          <li className="mb-2">
            <div className="d-flex">
              <div className="text-16-500 color-raisin-black">
                Best Presenter Award -
              </div>
              <div className="text-16-400 color-raisin-black ms-1">
                ICFE Conference 2021
              </div>
            </div>
          </li>
          <li className="mb-2">
            <div className="d-flex">
              <div className="text-16-500 color-raisin-black">
                Best Presenter Award -
              </div>
              <div className="text-16-400 color-raisin-black ms-1">
                ICFE Conference 2021
              </div>
            </div>
          </li>
          <li className="mb-2">
            <div className="d-flex">
              <div className="text-16-500 color-raisin-black">
                Best Presenter Award -
              </div>
              <div className="text-16-400 color-raisin-black ms-1">
                ICFE Conference 2021
              </div>
            </div>
          </li>
          <li className="mb-2">
            <div className="d-flex">
              <div className="text-16-500 color-raisin-black">
                Best Presenter Award -
              </div>
              <div className="text-16-400 color-raisin-black ms-1">
                ICFE Conference 2021
              </div>
            </div>
          </li>
        </ul>
      </Card> */}
    </div>
  );
};
export default CommitteeMemberDetails;
