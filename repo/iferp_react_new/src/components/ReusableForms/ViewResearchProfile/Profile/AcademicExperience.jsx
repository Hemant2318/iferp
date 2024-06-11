import moment from "moment";
import { useDispatch } from "react-redux";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import { addAffiliations } from "store/slices";
import { objectToFormData } from "utils/helpers";

const AcademicExperience = ({
  isMyProfile,
  affiliations,
  setIsEdit,
  setFormType,
  fetchDetails,
}) => {
  const dispatch = useDispatch();
  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-16 cpb-16 cpe-16 border-bottom">
        <div className="text-16-500 title-text">Academic Experience</div>
      </div>
      <div className="cps-16 cpe-16 cpb-22">
        {affiliations?.map((elem, index) => {
          const {
            id,
            institution,
            start_date,
            city_name,
            country_name,
            department,
            position,
          } = elem;
          return (
            <div key={index} className="mt-3">
              <div className="mb-3">
                <div className="text-15-500 color-black-olive mb-1 d-flex justify-content-between">
                  <div>{institution}</div>
                  {isMyProfile && (
                    <div className="d-flex align-items-start gap-2">
                      <span
                        className="border rounded p-1 color-gray pointer"
                        onClick={() => {
                          setIsEdit(id);
                          setFormType(3);
                        }}
                      >
                        <i className="bi bi-pencil-square" />
                      </span>
                      <span
                        className="border rounded p-1 color-gray pointer"
                        onClick={async () => {
                          const payload = objectToFormData({
                            id: id,
                            delete: 1,
                          });
                          const response = await dispatch(
                            addAffiliations(payload)
                          );
                          if (response?.status === 200) {
                            fetchDetails();
                          }
                        }}
                      >
                        <i className="bi bi-trash" />
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-14-400 color-black-olive">
                  {moment(start_date, "YYYY-MM-DD").format("MMMM YYYY")} -
                  Present
                </div>
              </div>
              <div className="mb-2">
                <div className="text-14-400 color-black-olive mb-1">
                  Location
                </div>
                <div className="text-14-500 color-black-olive">
                  {`${city_name ? `${city_name},` : ""} ${country_name}`}
                </div>
              </div>
              <div className="mb-2">
                <div className="text-14-400 color-black-olive mb-1">
                  Department
                </div>
                <div className="text-14-500 color-black-olive">
                  {department}
                </div>
              </div>
              <div className="mb-2 border-bottom pb-3">
                <div className="text-14-400 color-black-olive mb-1">
                  Position
                </div>
                <div className="text-14-500 color-black-olive">{position}</div>
              </div>
            </div>
          );
        })}

        {isMyProfile && (
          <div
            className="center-flex flex-column mt-3 pointer"
            onClick={() => {
              setFormType(3);
            }}
          >
            <div>
              <img src={icons.affiliations} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">Add additional academic experience</u>
            </div>
            <div className="text-14-400 color-subtitle-navy text-center">
              Add your current and past academic experience to give a complete
              picture of where you've worked
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AcademicExperience;
