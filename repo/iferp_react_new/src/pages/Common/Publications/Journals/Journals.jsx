import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import ViewPaper from "components/ReusableForms/Paper/ViewPaper";
import {
  fetchAplliedSubmitPaper,
  fetchJournals,
  setIsPremiumPopup,
} from "store/slices";
import { icons, journalType, journalsPath } from "utils/constants";
import {
  combineArrayS3,
  getDataFromLocalStorage,
  objectToFormData,
} from "utils/helpers";
import ExploreLayout from "components/Layout/ExploreLayout";

const Journals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, publicationType } = params;
  const [paperID, setPaperID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const handleRedirect = (url) => {
    navigate(`/${memberType}/publications/${url}`);
  };
  const getJournals = async () => {
    let forData = objectToFormData({
      journal_type: publicationType.replace(/-/g, " "),
    });
    const response = await dispatch(fetchJournals(forData));
    let resList = [];
    if (response?.data?.users) {
      const newList = await combineArrayS3(
        response?.data?.users,
        "logo",
        journalsPath
      );
      resList = newList;
    }

    setList(resList);
    setIsLoading(false);
  };
  const getJournalPapers = async () => {
    const response = await dispatch(fetchAplliedSubmitPaper());
    const newList = await combineArrayS3(
      response?.data,
      "journals_logo",
      journalsPath
    );
    setList(newList);
    setIsLoading(false);
  };
  useEffect(() => {
    if (list?.length > 0 && localStorage.paperID) {
      setPaperID(localStorage.paperID);
      localStorage.removeItem("paperID");
    }
  }, [list]);

  useEffect(() => {
    setIsLoading(true);
    if (publicationType !== "submit-paper") {
      setPaperID(null);
      getJournals();
    } else {
      getJournalPapers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicationType]);
  const userData = getDataFromLocalStorage("");
  const { user_type, membership_plan_id, attendedDetails = {} } = userData;
  const access = {
    isSubmitPaperLink: !["3", "4"].includes(user_type),
    // isEnableSubmitPaperLink: ["3", "4", "12"].includes(`${membership_plan_id}`),
    isViewSubmitPaper: ["2", "5"].includes(user_type),
  };
  let isShowUpgradePopup = false;
  if (membership_plan_id === 11) {
    isShowUpgradePopup = attendedDetails?.journal_abstract >= 2;
  }
  return (
    <Card className="w-100 cps-30 cpe-30 cpt-30 cpb-30 unset-br">
      <Tabs
        defaultActiveKey={publicationType}
        id="uncontrolled-tab-example"
        className="cmb-30 gap-4"
        activeKey={publicationType}
        onSelect={(e) => {
          handleRedirect(e);
        }}
      >
        {journalType.map((elem, index) => {
          return (
            <Tab
              key={index}
              eventKey={elem?.url}
              title={elem?.value}
              onEnter={() => {
                handleRedirect(elem?.url);
              }}
            />
          );
        })}
        {access.isViewSubmitPaper && (
          <Tab
            eventKey="submit-paper"
            title="Submitted Papers"
            onEnter={() => {
              handleRedirect("submit-paper");
            }}
          />
        )}
      </Tabs>
      {paperID ? (
        <>
          <div
            className="d-flex mb-3 ms-3"
            onClick={() => {
              setPaperID(null);
            }}
          >
            <img
              src={icons.leftArrow}
              alt="back"
              className="h-21 me-3 pointer"
            />
          </div>
          <ViewPaper type="paper" id={paperID} />
        </>
      ) : isLoading ? (
        <div className="center-flex cpt-50 cpb-50">
          <Loader size="md" />
        </div>
      ) : list.length === 0 ? (
        <ExploreLayout
          redirect={`/${memberType}/publications/scopus-indexed-journals`}
          info="Whoops...You haven’t submitted any papers in Journals"
        />
      ) : (
        <div className="row">
          {publicationType === "submit-paper"
            ? list.map((elem, index) => {
                return (
                  <div className="cmb-22" key={index}>
                    <div className="cps-20 cpe-30 cpt-20 cpb-20 d-flex border h-100 w-100">
                      <div className="cme-18">
                        <img
                          src={elem.s3File}
                          alt="logo"
                          height={114}
                          width={112}
                          onError={(e) => {
                            e.target.src = icons.noImage;
                          }}
                        />
                      </div>
                      <div className="d-flex flex-column flex-grow-1 mt-2">
                        <div className="text-15-500 color-raisin-black">
                          {elem.journals_name}
                        </div>
                        <div className="text-13-400 color-black-olive mt-2 mb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <span>
                            <b className="me-2">Title:</b>
                            {elem.paper_title}
                          </span>
                          <span className="d-flex">
                            <Button
                              isRounded
                              text="View Status"
                              btnStyle="primary-dark"
                              className="cps-20 cpe-20 h-35 text-14-400 text-nowrap"
                              onClick={() => {
                                setPaperID(elem.id);
                              }}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : list.map((elem, index) => {
                return (
                  <div className="col-md-6 cmb-22" key={index}>
                    <div className="cps-16 cpe-16 cpt-22 cpb-22 d-flex border h-100">
                      <div className="cme-18">
                        <img
                          src={elem.s3File}
                          alt="logo"
                          height={114}
                          width={112}
                          onError={(e) => {
                            e.target.src = icons.noImage;
                          }}
                        />
                      </div>
                      <div className="d-flex flex-column">
                        <div className="text-15-500 color-raisin-black">
                          {elem.name}
                        </div>
                        <div className="text-13-400 color-black-olive mt-2 mb-2">
                          <b className="me-2">ISSN:</b>
                          {elem.issn}
                        </div>
                        {access.isSubmitPaperLink && (
                          <div className="text-15-500 color-new-car mt-auto">
                            <u
                              className="pointer"
                              onClick={() => {
                                if (isShowUpgradePopup) {
                                  dispatch(setIsPremiumPopup(true));
                                } else {
                                  navigate(
                                    `/${memberType}/publications/${publicationType}/submit-paper/${elem.id}`
                                  );
                                }
                              }}
                            >
                              Submit Papers
                            </u>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </Card>
  );
};
export default Journals;
