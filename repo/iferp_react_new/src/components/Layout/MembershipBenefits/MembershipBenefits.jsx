import React, { useState } from "react";
import { forEach } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import { icons, membershipType } from "utils/constants";
import { getDataFromLocalStorage, titleCaseString } from "utils/helpers";
import UpgradeButton from "components/Layout/UpgradeButton";
import Table from "../Table";
import AllBenefits from "./AllBenefits";

const MembershipBenefits = ({
  planData,
  benefitDetail,
  // planDetails,
  isRenew,
  isUpgradeButton,
  hidePlanDetail,
  limitedOptions,
  showBenifitList,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const [isAll, setIsAll] = useState(false);
  const redirectViewMore = () => {
    navigate(`/${params.memberType}/my-profile/my-events`);
  };
  const userData = getDataFromLocalStorage();
  const {
    user_type: userType,
    attendedDetails = {},
    membership_plan_id,
  } = userData;
  const findType = membershipType.find((o) => o.id === userType);
  let newArr = {};
  forEach(benefitDetail, (elem) => {
    let key = elem?.benefit_related_module;
    if (newArr[key]) {
      newArr[key] = [...newArr[key], elem];
    } else {
      newArr[key] = [elem];
    }
  });
  let display = limitedOptions
    ? Object.values(newArr)?.[0]?.splice(0, limitedOptions)
    : Object.values(newArr)?.[0];
  let totalWebinar = 0;
  totalWebinar = totalWebinar + attendedDetails[2]?.Hybrid;
  totalWebinar = totalWebinar + attendedDetails[2]?.Physical;
  totalWebinar = totalWebinar + attendedDetails[2]?.Virtual;
  let totalGuestLecture = attendedDetails[4]?.Virtual;
  let totalFacultyDev = attendedDetails[5]?.Virtual;

  const listData = {
    2: [
      {
        benefits: (
          <div className="text-16-400 color-raisin-black">1 Webinars</div>
        ),
        attended: (
          <div>
            <div className="text-18-500">{totalWebinar}</div>
            <div className="text-16-400">Webinars</div>
            <div
              className="text-12-400 pointer color-new-car text-decoration-underline"
              onClick={redirectViewMore}
            >
              View More
            </div>
          </div>
        ),
        remaining: (
          <div className="text-18-500">
            {1 - totalWebinar <= 0 ? "Nil" : `${1 - totalWebinar} Left`}
          </div>
        ),
      },
      {
        benefits: (
          <div className="text-16-400 color-raisin-black">
            <div>2 Guest Lectures</div>
            <div className="text-12-400">(Virtual)</div>
          </div>
        ),
        attended: (
          <div>
            <div className="text-18-500">{totalGuestLecture}</div>
            <div className="text-16-400">Guest Lectures</div>
            <div
              className="text-12-400 pointer color-new-car text-decoration-underline"
              onClick={redirectViewMore}
            >
              View More
            </div>
          </div>
        ),
        remaining: (
          <div className="text-18-500">
            {2 - totalGuestLecture <= 0
              ? "Nil"
              : `${2 - totalGuestLecture} Left`}
          </div>
        ),
      },
    ],
    3: [
      {
        benefits: (
          <div className="text-16-400 color-raisin-black">
            <div>4 Faculty Development Programme</div>
            <div className="text-12-400">(Virtual)</div>
          </div>
        ),
        attended: (
          <div>
            <div className="text-18-500">{totalFacultyDev}</div>
            <div className="text-16-400">Faculty Development Programme</div>
            <div
              className="text-12-400 pointer color-new-car text-decoration-underline"
              onClick={redirectViewMore}
            >
              View More
            </div>
          </div>
        ),
        remaining: (
          <div className="text-18-500">
            {4 - totalFacultyDev <= 0 ? "Nil" : `${4 - totalFacultyDev} Left`}
          </div>
        ),
      },
    ],
    11: [
      {
        benefits: (
          <div className="text-16-400 color-raisin-black">1 Webinars</div>
        ),
        attended: (
          <div>
            <div className="text-18-500">{totalWebinar}</div>
            <div className="text-16-400">Webinars</div>
            <div
              className="text-12-400 pointer color-new-car text-decoration-underline"
              onClick={redirectViewMore}
            >
              View More
            </div>
          </div>
        ),
        remaining: (
          <div className="text-18-500">
            {1 - totalWebinar <= 0 ? "Nil" : `${1 - totalWebinar} Left`}
          </div>
        ),
      },
      {
        benefits: (
          <div className="text-16-400 color-raisin-black">
            <div>2 Guest Lectures</div>
            <div className="text-12-400">(Virtual)</div>
          </div>
        ),
        attended: (
          <div>
            <div className="text-18-500">{totalGuestLecture}</div>
            <div className="text-16-400">Guest Lectures</div>
            <div
              className="text-12-400 pointer color-new-car text-decoration-underline"
              onClick={redirectViewMore}
            >
              View More
            </div>
          </div>
        ),
        remaining: (
          <div className="text-18-500">
            {2 - totalGuestLecture <= 0
              ? "Nil"
              : `${2 - totalGuestLecture} Left`}
          </div>
        ),
      },
    ],
  };
  const displayList = listData[membership_plan_id] || [];

  return (
    <>
      {isAll && (
        <AllBenefits
          onHide={() => {
            setIsAll(false);
          }}
          data={newArr}
        />
      )}
      {isRenew && (
        <div className="d-flex pt-2 mb-3">
          <Button
            text="Renew"
            btnStyle="primary-outline"
            className="cps-30 cpe-30"
            onClick={() => {
              navigate(`/${findType?.type}/renew`);
            }}
          />
        </div>
      )}
      <div className="text-16-500 color-raisin-black mb-2 mt-3">
        {titleCaseString(Object.keys(newArr)?.[0]?.replace(/_/g, " "))}
      </div>
      {display?.map((elem, index) => {
        return (
          <div key={index} className="cmb-12 text-14-400 color-raisin-black  ">
            <img src={icons.rightLabel} alt="right" className="me-2" />
            {elem?.benefit}
            <span className="text-primary">{` - ${elem.benefit_type}`}</span>
          </div>
        );
      })}
      {display?.length > 0 && (
        <div
          className="text-15-400-16 color-new-car pointer   mt-3"
          onClick={() => {
            setIsAll(true);
          }}
        >
          <u className=" ">View All</u>
        </div>
      )}
      {isUpgradeButton && (
        <div className="d-flex mt-5">
          <UpgradeButton text="Upgrade to Premium" />
        </div>
      )}
      {planData?.name && !hidePlanDetail && (
        <>
          <div className="text-18-500 color-raisin-black cmb-22 mt-5">
            Plan Details
          </div>
          <Table
            header={[
              {
                title: "Plan",
              },
              {
                title: "Duration",
              },
              {
                title: "Amount",
              },
            ]}
            rowData={[
              {
                data: [
                  {
                    value: planData?.name,
                  },
                  {
                    value: `${planData?.days} Days`,
                  },
                  {
                    value: (
                      <div className="pt-3 pb-3 text-18-500 color-raisin-black">
                        {planData?.amount}
                      </div>
                    ),
                  },
                ],
              },
            ]}
          />
        </>
      )}
      {showBenifitList && (
        <div className="cmt-30">
          <Table
            header={[
              {
                title: "Benefits",
              },
              {
                title: "Attended",
              },
              {
                title: "Remaining",
              },
            ]}
            rowData={displayList?.map((elem) => {
              return {
                data: [
                  {
                    value: elem?.benefits,
                  },
                  {
                    value: elem?.attended,
                  },
                  {
                    value: elem?.remaining,
                  },
                ],
              };
            })}
          />
        </div>
      )}
    </>
  );
};
export default MembershipBenefits;
