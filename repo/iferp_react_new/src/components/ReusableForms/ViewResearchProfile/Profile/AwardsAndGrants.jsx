import Card from "components/Layout/Card";
import EditButton from "components/Layout/EditButton";
import { icons } from "utils/constants";
import { formatDate } from "utils/helpers";

const AwardsAndGrants = ({
  achievements,
  isMyProfile,
  setIsEdit,
  setFormType,
}) => {
  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-16 cpb-16 cpe-16 border-bottom">
        <div className="text-16-500 title-text">Awards & Grants</div>
        {achievements?.length > 0 && isMyProfile && (
          <div>
            <EditButton
              onClick={() => {
                setIsEdit(true);
                setFormType(6);
              }}
            />
          </div>
        )}
      </div>
      <div className="cps-16 cpe-16 cpt-22 cpb-22">
        {achievements?.length > 0 ? (
          achievements?.map((elem, index) => {
            const { award_name, event_name, category, date } = elem;
            return (
              <div
                key={index}
                className={`${
                  achievements.length - 1 === index ? "" : "border-bottom mb-2"
                }`}
              >
                <div className="mb-2">
                  <div className="text-14-400 color-black-olive mb-1">
                    Award Name
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {award_name}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-14-400 color-black-olive mb-1">
                    Event Name
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {event_name}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-14-400 color-black-olive mb-1">
                    Category
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {category}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-14-400 color-black-olive mb-1">Date</div>
                  <div className="text-14-500 color-black-olive">
                    {formatDate(date)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="center-flex flex-column mt-3"
            onClick={() => {
              setFormType(6);
            }}
          >
            <div>
              <img src={icons.achivment} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">Add your Awards & Grants</u>
            </div>
            <div className="text-14-400 color-subtitle-navy text-center">
              Add information about your studies so that others can understand
              your research and background.
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AwardsAndGrants;
