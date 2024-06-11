import React from "react";
import { useSelector } from "react-redux";
import Card from "components/Layout/Card";
import Profile from "components/Layout/Profile";
import { useNavigate } from "react-router-dom";
import { membershipType } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";

const MyGroups = () => {
  const navigate = useNavigate();
  const { myGroupsList } = useSelector((state) => ({
    myGroupsList: state.global.myGroupsList,
  }));

  return (
    <Card className="cps-24 cpe-24 cpt-24 cpb-24 mb-3 h-100">
      <div className="d-flex justify-content-between flex-wrap gap-2 cmb-20">
        <div className="text-16-500-24 color-title-navy font-poppins text-nowrap">
          My Groups
        </div>
        <div
          className="text-15-400-16 color-new-car pointer text-nowrap"
          onClick={() => {
            const userFlag = membershipType.find(
              (o) => o.id === getDataFromLocalStorage("user_type")
            )?.type;
            navigate(
              `/${userFlag}/network-management/network/groups/my-groups`
            );
          }}
        >
          <u>View All</u>
        </div>
      </div>
      <div className="group-list">
        {myGroupsList.length === 0 ? (
          <div className="center-flex cpt-80 pb-5">No Group Found</div>
        ) : (
          myGroupsList.map((elem, index) => {
            return (
              <React.Fragment key={index}>
                <div className="group-list-block">
                  <div className="d-flex align-items-center left-block">
                    <Profile isRounded text={elem?.name} size="s-48" />
                    <div className="user-details-block ms-3">
                      <div className="text-14-400 color-raisin-black hover-effect">
                        {elem?.name}
                      </div>
                    </div>
                  </div>
                </div>
                {myGroupsList.length - 1 !== index && (
                  <div className="border-bottom mt-3 mb-3" />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </Card>
  );
};
export default MyGroups;
