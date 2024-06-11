import { useNavigate, useParams } from "react-router-dom";
import GroupForm from "components/ReusableForms/GroupForm";
import Card from "components/Layout/Card";
import ChatProfile from "components/Layout/ChatProfile";
import { icons } from "utils/constants";

const CreateGroup = () => {
  const params = useParams();
  const isEdit = params.groupId === "create-group" ? false : true;
  const navigate = useNavigate();
  let editData = localStorage?.tempData
    ? JSON.parse(localStorage?.tempData)
    : null;
  return (
    <div className="row w-100">
      <div className="col-md-8 col-12 mb-3">
        <Card className="cps-22 cpe-22 cpt-24 cpb-24">
          <div className="d-flex position-relative cmb-22">
            <span
              className="d-flex position-absolute start-0"
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
            <div className="text-18-500 color-black-olive ms-5">
              {isEdit ? "Edit Group" : "Create Group"}
            </div>
          </div>
          <GroupForm
            editData={editData}
            handelSuccess={() => {
              navigate(-1);
            }}
          />
        </Card>
      </div>
      <div className="col-md-4 col-12 mb-3">
        <ChatProfile />
      </div>
    </div>
  );
};
export default CreateGroup;
