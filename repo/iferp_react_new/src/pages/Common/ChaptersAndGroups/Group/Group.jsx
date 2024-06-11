import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import DeletePopup from "components/Layout/DeletePopup";
import { icons } from "utils/constants";
import { fetchSIGGroup, deleteSIGGroup } from "store/slices";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import GroupForm from "./GroupForm";

const Group = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoader, setLoader] = useState(true);
  const [isAddGroup, setAddGroup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [GroupID, setGroupID] = useState(null);
  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getGroups = async () => {
    const response = await dispatch(fetchSIGGroup());
    setGroupList(response?.data || []);
    setLoader(false);
  };
  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isAdd: userType === "0",
    isEdit: userType === "0",
    isDelete: userType === "0",
  };
  return (
    <>
      {GroupID && (
        <DeletePopup
          title="Delete Special Interest Community(SIC) Group"
          message="Are you sure you want to delete this Group?"
          id={GroupID}
          onHide={() => {
            setGroupID(null);
          }}
          handelSuccess={() => {
            setGroupID(null);
            getGroups();
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: GroupID });
            const response = await dispatch(deleteSIGGroup(forData));
            return response;
          }}
        />
      )}
      {(isAddGroup || editData) && (
        <GroupForm
          editData={editData}
          onHide={() => {
            setAddGroup(false);
            setEditData(null);
          }}
          handelSuccess={() => {
            setLoader(true);
            setAddGroup(false);
            setEditData(null);
            getGroups();
          }}
        />
      )}

      <Card className="cps-30 cpe-30 cpt-40 cpb-30">
        {access.isAdd ? (
          <>
            <div className="d-flex justify-content-between align-items-center cmb-30">
              <div className="text-20-500 color-title-navy font-poppins">
                Special Interest Community(SIC)
              </div>

              <Button
                onClick={() => {
                  setAddGroup(true);
                }}
                text="+ Create Group"
                btnStyle="primary-outline"
                className="h-35 text-14-500"
                isSquare
              />
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center align-items-center cmb-30">
              <div className="text-22-500 color-title-navy font-poppins">
                Special Interest Community(SIC)
              </div>
            </div>
          </>
        )}

        <div className="row">
          {isLoader ? (
            <div className="cmt-30 cmb-50">
              <Loader size="md" />
            </div>
          ) : (
            groupList?.map((elem, index) => {
              return (
                <div className="col-md-6 cmb-24" key={index}>
                  <div className="chapter-block">
                    <div className="text-18-500 color-raisin-black">
                      {elem.name}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="r-icon-block"
                        onClick={() => {
                          navigate(
                            `/${params.memberType}/chapters-groups/sig-groups/${elem.id}/conference`
                          );
                        }}
                      >
                        <i className="bi bi-chevron-right text-28-500 color-new-car" />
                      </div>
                      {access.isEdit && (
                        <div
                          className="d-flex pointer"
                          onClick={() => {
                            setEditData(elem);
                          }}
                        >
                          <img src={icons.edit} alt="edit" className="h-21" />
                        </div>
                      )}
                      {access.isDelete && (
                        <div
                          className="d-flex pointer"
                          onClick={() => {
                            setGroupID(elem.id);
                          }}
                        >
                          <img
                            src={icons.deleteIcon}
                            alt="delete"
                            className="h-21"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </>
  );
};
export default Group;
