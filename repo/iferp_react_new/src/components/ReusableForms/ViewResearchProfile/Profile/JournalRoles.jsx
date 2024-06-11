import Card from "components/Layout/Card";
import EditButton from "components/Layout/EditButton";
import { icons } from "utils/constants";

const JournalRoles = ({
  current_journal_roles,
  isMyProfile,
  setIsEdit,
  setFormType,
}) => {
  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-16 cpb-16 cpe-16 border-bottom">
        <div className="text-16-500 title-text">Current Journal Roles</div>
        {current_journal_roles?.length > 0 && isMyProfile && (
          <div>
            <EditButton
              onClick={() => {
                setFormType(4);
                setIsEdit(true);
              }}
            />
          </div>
        )}
      </div>
      <div className="cps-16 cpe-16 cpt-22 cpb-22">
        {current_journal_roles?.length > 0 ? (
          current_journal_roles?.map((elem, index) => {
            const { journals, role } = elem;
            return (
              <div
                key={index}
                className={`${
                  current_journal_roles.length - 1 === index
                    ? ""
                    : "border-bottom mb-2"
                }`}
              >
                <div className="mb-2">
                  <div className="text-14-400 color-black-olive mb-1">
                    Journals
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {journals}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-14-400 color-black-olive mb-1">Role</div>
                  <div className="text-14-500 color-black-olive">{role}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="center-flex flex-column mt-3"
            onClick={() => {
              setFormType(4);
            }}
          >
            <div>
              <img src={icons.journalRole} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">Add your current journal roles </u>
            </div>
            <div className="text-14-400 color-subtitle-navy text-center">
              Let others know about any work you do for scientific journals.
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default JournalRoles;
