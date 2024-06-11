import React, { useEffect, useState } from "react";
import Profile from "components/Layout/Profile";
import { icons } from "utils/constants";
import Button from "components/form/Button";
import { useDispatch } from "react-redux";
import { fetchSIGGroup } from "store/slices";
import Loader from "components/Layout/Loader";
import { useNavigate } from "react-router-dom";
import "./Sic.scss";

const Sic = ({ setConnectModel, isLoginUser, loginUser, loginUserType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoader, setLoader] = useState(true);
  const [groupList, setGroupList] = useState([]);
  const getGroups = async () => {
    const response = await dispatch(fetchSIGGroup());
    setGroupList(response?.data || []);
    setLoader(false);
  };
  useEffect(() => {
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sic-container">
      <div className="cps-20 cpe-20 cpt-20 cpb-20">
        <div className="text-18-600 color-4b4b cmb-10">
          Special Interest Community(SIC)
        </div>
        {isLoader ? (
          <div className="cmt-50 cmb-50">
            <Loader size="md" />
          </div>
        ) : (
          groupList?.slice(0, 3)?.map((elem, index) => {
            const { id, name, joined_members } = elem;
            return (
              <React.Fragment key={index}>
                <div
                  className={`${
                    groupList?.slice(0, 3)?.length - 1 !== index && "cpb-15"
                  } d-flex flex-column`}
                >
                  <div className="d-flex align-items-center gap-3 cmb-10">
                    <Profile isRounded text={name} size="s-22" />
                    <span className="text-14-500 color-3d3d">{name}</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 cmb-10">
                    <div className="">
                      <img src={icons.fillFollowers} alt="followers" />
                    </div>
                    <div className="text-13-400 color-4b4b">
                      {`${joined_members?.length} Followers`}
                    </div>
                  </div>
                  <div className="d-flex gap-3 flex-wrap">
                    <div className="d-flex">
                      <Button
                        text="Join Group"
                        btnStyle="dark-primary-outline"
                        className="text-14-400 br-4"
                        onClick={() => {
                          if (!isLoginUser) {
                            setConnectModel(true);
                            return;
                          }
                        }}
                      />
                    </div>
                    <div className="d-flex">
                      <span
                        className="color-4c00 text-13-400 view-more-decoration p-2 pointer"
                        onClick={() => {
                          if (!isLoginUser) {
                            setConnectModel(true);
                            return;
                          }
                          navigate(
                            `/${loginUserType}/chapters-groups/sig-groups/${id}/conference`
                          );
                        }}
                      >
                        View more
                      </span>
                    </div>
                  </div>
                </div>

                {groupList?.slice(0, 3)?.length - 1 !== index && (
                  <div className="card-border-bottom cmb-10"></div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
      {groupList?.length > 3 && (
        <div
          className="text-14-500 color-374e bg-f0f2 p-2 br-bs-be text-center pointer"
          onClick={() => {
            if (!isLoginUser) {
              setConnectModel(true);
              return;
            }
            navigate(`/${loginUserType}/chapters-groups/sig-groups`);
          }}
        >
          View All SIC Groups
        </div>
      )}
    </div>
  );
};

export default Sic;
