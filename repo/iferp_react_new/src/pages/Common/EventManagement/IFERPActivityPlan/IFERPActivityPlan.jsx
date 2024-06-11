import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import { fetchQuartelyList } from "store/slices";
import { icons } from "utils/constants";
import { getDataFromLocalStorage, titleCaseString } from "utils/helpers";
import "./IFERPActivityPlan.scss";

const IFERPActivityPlan = ({ planType = "IFERP" }) => {
  const params = useParams();
  const { type } = params;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState([]);
  const getProfiles = async () => {
    const response = await dispatch(fetchQuartelyList(planType));
    setPageData(
      response?.data || {
        quarter1: [],
        quarter2: [],
        quarter3: [],
        quarter4: [],
      }
    );
    setIsLoading(false);
  };
  useEffect(() => {
    localStorage.removeItem("prevRoute");
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userType = getDataFromLocalStorage("user_type");
  const isIFERP = planType === "IFERP";
  return (
    <div>
      <Card className="cpt-50 cpb-20 cps-50 cpe-50">
        <div className="text-24-500 color-title-navy font-poppins text-center cmb-30">
          {isIFERP ? "IFERP Quarterly Plans" : "Institutional Quarterly Plans"}
        </div>
        {isLoading ? (
          <div className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
            <Loader size="md" />
          </div>
        ) : (
          <div className="row fadeInUp">
            {Object.entries(pageData).map((elem, index) => {
              const list = elem[1] || [];
              const isPlan = list.length === 0;
              return (
                <div className="col-md-6 col-12 cmb-30 d-flex" key={index}>
                  <div className="plan-card-block col-md-12 col-12 d-flex flex-column">
                    <div className="title-block">
                      {titleCaseString(
                        elem[0].substring(0, elem[0].length - 1)
                      )}
                      {` ${index + 1}`}
                    </div>
                    {isPlan ? (
                      <div className="d-flex justify-content-center text-14-400 cpb-50 cpt-50">
                        {isIFERP ? "No Event Found" : "Add Event Details"}
                      </div>
                    ) : (
                      <div className="list-container d-flex flex-column flex-grow-1">
                        {list.map((childElem, childIndex) => {
                          return (
                            <div
                              className={`list-block ${
                                childIndex % 2 === 0 ? "active" : ""
                              }`}
                              key={childIndex}
                            >
                              <img
                                src={icons.greenCheckMark}
                                alt="img"
                                className="me-2"
                              />
                              {childElem}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {(!isPlan || !isIFERP) && (
                      <div className="d-flex justify-content-center align-items-end flex-grow-1 cmt-30 cmb-30">
                        <Button
                          onClick={() => {
                            if (isPlan && !isIFERP) {
                              navigate(
                                "/institutional/activity-plan/institutional-plan/add-event"
                              );
                            } else {
                              const route = `${
                                userType === "0"
                                  ? "/admin/event-management/activity-plan/"
                                  : "/institutional/activity-plan/activity-plan/"
                              }${userType === "0" ? "iferp-plan" : type}/${
                                elem[0]
                              }`;
                              navigate(route);
                            }
                          }}
                          text={`${
                            isPlan && !isIFERP ? "Add" : "View"
                          } Details`}
                          btnStyle="primary-dark"
                          className="cps-30 cpe-30"
                          isRounded
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
export default IFERPActivityPlan;
