import moment from "moment/moment";
import { useNavigate, useParams } from "react-router-dom";
import CheckBox from "components/form/CheckBox";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";

const List = ({
  isLoading,
  msgList,
  deleteIds,
  handelDeleteId,
  handelDeleteMessage,
  handelStarMessage,
  listType,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const { memberType, type } = params;
  const redirectToEmailDetails = (id, key) => {
    navigate(`/${memberType}/inbox-notifications/${type}/${id}/${key}`);
  };
  return (
    <>
      {isLoading ? (
        <Card className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
          <Loader size="md" />
        </Card>
      ) : msgList.length === 0 ? (
        <Card className="d-flex justify-content-center text-15-400 cpb-50 cpt-50 unset-br">
          No Data Found
        </Card>
      ) : (
        <Card className="d-flex align-items-center cps-12 cpe-12 unset-br inbox-list-container pb-1 pt-1 fadeInUp">
          <div className="w-100 inbox-list">
            {msgList.map((elem, index) => {
              const {
                sender_detail = {},
                receiver_detail = {},
                subject,
                id,
                key,
                created_at,
                is_starred,
                is_read,
              } = elem;
              const name = sender_detail?.name || receiver_detail?.name || "";
              const member_id =
                sender_detail?.member_id || receiver_detail?.member_id || "";

              const msgtime = moment(created_at, "DD-MM-YYYY hh:mm A").format(
                "hh:mm A"
              );
              return (
                <div
                  className={`row inbox-msg-block d-flex align-items-center justify-content-between cpt-18 cpb-18 cps-14 cpe-14 pointer ${
                    msgList.length - 1 === index ? "" : "border-bottom"
                  }`}
                  key={index}
                >
                  <div className="d-flex align-items-center col-md-10 col-9">
                    <div className="row w-100">
                      <div className="col-md-4 col-5 d-flex align-items-center text-truncate d-inline-block">
                        <div className="me-3">
                          <CheckBox
                            type="PRIMARY-ACTIVE"
                            onClick={() => {
                              handelDeleteId(id);
                            }}
                            isChecked={deleteIds.includes(id)}
                          />
                        </div>
                        <div
                          className={`color-black-olive pointer text-truncate d-inline-block ${
                            is_read === "0" && listType !== "sent-messages"
                              ? "text-16-600"
                              : "text-16-400"
                          }`}
                          onClick={() => {
                            redirectToEmailDetails(id, key);
                          }}
                        >
                          {name} - {member_id}
                        </div>
                      </div>
                      <div
                        className={`color-black-olive pointer text-truncate d-inline-block col-md-8 col-7 ${
                          is_read === "0" && listType !== "sent-messages"
                            ? "text-16-600"
                            : "text-16-400"
                        }`}
                        onClick={() => {
                          redirectToEmailDetails(id, key);
                        }}
                      >
                        {subject}
                      </div>
                    </div>
                  </div>
                  <div
                    id="time-block"
                    className="text-14-400 color-black-olive col-md-2 col-3"
                  >
                    {msgtime}
                  </div>
                  <div
                    id="hover-option-block"
                    className="d-flex align-items-center justify-content-end gap-4 col-md-2"
                  >
                    <div
                      className="d-flex pointer"
                      onClick={() => {
                        localStorage.isReply = id;
                        redirectToEmailDetails(id, key);
                      }}
                    >
                      <i className="bi bi-reply text-20-400 color-dark-silver" />
                    </div>
                    <div
                      className="d-flex pointer"
                      onClick={() => {
                        handelStarMessage({
                          id,
                          key,
                          status: is_starred === 0 ? 1 : 0,
                          type: "outside",
                        });
                      }}
                    >
                      {is_starred ? (
                        <i className="bi bi-star-fill text-16-400 color-dark-silver" />
                      ) : (
                        <i className="bi bi-star text-16-400 color-dark-silver" />
                      )}
                    </div>
                    <div
                      className="d-flex pointer"
                      onClick={() => {
                        handelDeleteMessage({ id, key });
                      }}
                    >
                      <i className="bi bi-trash text-16-400 color-dark-silver" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
};
export default List;
