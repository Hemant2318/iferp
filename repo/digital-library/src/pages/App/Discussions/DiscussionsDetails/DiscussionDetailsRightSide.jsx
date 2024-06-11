import React, { useEffect, useState } from "react";
import Button from "components/inputs/Button";
import Card from "components/layouts/Card";
import Profile from "components/layouts/Profile";
import { useDispatch } from "react-redux";
import { getDiscussionUsingType } from "store/globalSlice";
import {
  messageTime,
  objectToFormData,
  titleCaseString,
} from "utils/helpers/common";
import Loader from "components/layouts/Loader";
import QuestionDetailsPopup from "components/layouts/CustomTab/QuestionDetailsPopup";

const DiscussionDetailsRightSide = ({
  questionDetails,
  totalFollowersCount,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [similarData, setSimilarData] = useState([]);
  const [isQuestion, setIsQuestion] = useState(false);

  const fetchSimilarDiscussionsData = async () => {
    setIsLoading(true);
    const payload = { page: 1, limit: 3, type: "similar" };
    const formData = objectToFormData(payload);
    const response = await dispatch(getDiscussionUsingType(formData));
    if (response?.status === 200) {
      setSimilarData(response?.data?.result || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSimilarDiscussionsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { total_reads, total_comments, total_shares } = questionDetails || {};
  const qaInfo = [
    { id: 1, label: "Reads", value: total_reads },
    { id: 2, label: "Followers", value: totalFollowersCount },
    { id: 3, label: "Answers", value: total_comments },
    { id: 4, label: "Shares", value: total_shares },
  ];

  return (
    <div className="col-md-4">
      {isQuestion && (
        <QuestionDetailsPopup
          onHide={() => {
            setIsQuestion(false);
          }}
          handleSuccess={() => {
            fetchSimilarDiscussionsData();
            setIsQuestion(false);
          }}
        />
      )}
      <Card className="cp-20 cmb-30">
        <div className="">
          {qaInfo?.map((elem, index) => {
            const { label, value } = elem;
            return (
              <div key={index} className="row cmb-20">
                <div className="col-md-4 col-sm-4 col-4">{label}</div>
                <div className="col-md-5 col-sm-5 col-5 text-center">
                  -------------
                </div>
                <div className="col-md-3 col-sm-3 col-3">{value}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="cmb-30">
        <div className="cp-20 bb-dede text-16-400 color-4d4d">
          Similar Discussion
        </div>
        {isLoading ? (
          <div className="d-flex align-items-center justify-content-center cpt-100 cpb-100">
            <Loader size="sm" />
          </div>
        ) : (
          <div className="">
            {similarData?.length > 0 ? (
              similarData?.map((elem, index) => {
                const {
                  title,
                  total_comments,
                  total_reads,
                  created_date,
                  get_user_details,
                } = elem;
                const { first_name, last_name, profile_photo_path } =
                  get_user_details || {};
                const isLast = similarData?.length - 1 === index;

                return (
                  <React.Fragment key={index}>
                    <div className="cp-20">
                      <div className="fb-center mb-3">
                        <div className="fa-center gap-3">
                          <Profile
                            text={`${first_name} ${last_name}`}
                            size="s-26"
                            isRounded
                            url={profile_photo_path}
                            isS3UserURL
                          />
                          <div className="text-14-500 lh-21 color-3d3d">
                            {titleCaseString(`${first_name} ${last_name}`)}
                          </div>
                        </div>
                        <div>
                          <div className="d-flex justify-content-end text-13-400 lh-22 color-7070">
                            {messageTime(created_date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-14-500 color-3d3d mb-3">
                        {titleCaseString(title)}
                      </div>
                      <div className="d-flex gap-3 text-13-400 align-items-center">
                        <span className="bg-e314 color-b3df br-4 cp-5">{`${total_comments} Answers`}</span>
                        <span className="color-8080">{`${total_reads} Reads`}</span>
                      </div>
                    </div>
                    {isLast ? (
                      similarData?.length > 3 && (
                        <div className="text-center bg-fbfb pt-2 pb-2 border-top">
                          <span className="pointer text-14-400 lh-21 color-5555">
                            View all
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="bt-e1e1 pb-4" />
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="d-flex align-items-center justify-content-center cpt-100 cpb-100">
                No Data Found.
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="cp-20">
        <div className="text-16-400 color-3d3d cmb-20">
          Ask a technical question & get answers from experts
        </div>
        <div>
          <Button
            btnText="Start a Discussion"
            btnStyle="SD"
            onClick={() => {
              setIsQuestion(true);
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default DiscussionDetailsRightSide;
