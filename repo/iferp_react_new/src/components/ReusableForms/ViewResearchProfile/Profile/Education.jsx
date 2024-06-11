import Card from "components/Layout/Card";
import EditButton from "components/Layout/EditButton";

const Education = ({
  isMyProfile,
  educational_details,
  setIsEdit,
  setFormType,
}) => {
  const {
    ug_course_name,
    ug_department_name,
    ug_university_name,
    ug_institution_name,
    ug_year_of_completion,
    pg_course_name,
    pg_department_name,
    pg_university_name,
    pg_institution_name,
    pg_year_of_completion,
    phd_course_name,
    phd_department_name,
    phd_university_name,
    phd_institution_name,
    phd_year_of_completion,
    other_ug_university,
    other_ug_institution,
    other_pg_university,
    other_pg_institution,
    other_phd_university,
    other_phd_institution,
  } = educational_details || {};
  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-16 cpb-16 cpe-16 border-bottom">
        <div className="text-16-500 title-text">Education</div>
        {isMyProfile && (
          <div>
            <EditButton
              onClick={() => {
                setIsEdit(true);
                setFormType(5);
              }}
            />
          </div>
        )}
      </div>
      <div className="cps-16 cpe-16 cpt-22 cpb-10">
        {!educational_details ? (
          <div className="d-flex justify-content-center text-14-400 cpb-10">
            No Data Found
          </div>
        ) : (
          <div>
            {ug_course_name && (
              <div className="mb-3">
                <div className="mb-1 text-14-500 color-raisin-black">
                  Bachelor Degree/UG Details
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Course Name
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {ug_course_name}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Deparment
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {ug_department_name}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    University
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {`${ug_university_name} ${
                      other_ug_university ? ` (${other_ug_university})` : ""
                    }`}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Institution
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {`${ug_institution_name} ${
                      other_ug_institution ? ` (${other_ug_institution})` : ""
                    }`}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Year of Completion
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {ug_year_of_completion}
                  </div>
                </div>
              </div>
            )}
            {pg_course_name && (
              <div className="mb-3">
                <div className="mb-1 text-14-500 color-raisin-black">
                  Master Degree/PG Details
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Course Name
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {pg_course_name}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Deparment
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {pg_department_name}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    University
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {`${pg_university_name} ${
                      other_pg_university ? ` (${other_pg_university})` : ""
                    }`}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Institution
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {`${pg_institution_name} ${
                      other_pg_institution ? ` (${other_pg_institution})` : ""
                    }`}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Year of Completion
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {pg_year_of_completion}
                  </div>
                </div>
              </div>
            )}
            {phd_course_name && (
              <div className="mb-3">
                <div className="mb-1 text-14-500 color-raisin-black">
                  Doctorate/Ph.D Programme Details
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Course Name
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {phd_course_name}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Deparment
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {phd_department_name}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    University
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {`${phd_university_name} ${
                      other_phd_university ? ` (${other_phd_university})` : ""
                    }`}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Institution
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {`${phd_institution_name} ${
                      other_phd_institution ? ` (${other_phd_institution})` : ""
                    }`}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="text-14-400 color-black-olive mb-1">
                    Year of Completion
                  </div>
                  <div className="text-14-500 color-black-olive">
                    {phd_year_of_completion}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* {higher_qualification_details?.id ? (
      <div>
        <div className="mb-2">
          <div className="text-14-400 color-black-olive mb-1">
            Institution
          </div>
          <div className="text-14-500 color-black-olive">
            {higher_qualification_details?.institution}
          </div>
        </div>
        <div className="mb-2">
          <div className="text-14-400 color-black-olive mb-1">
            Date
          </div>
          <div className="text-14-500 color-black-olive">
            {getEventDate(
              higher_qualification_details?.start_date,
              higher_qualification_details?.end_date
            )}
          </div>
        </div>
        <div className="mb-2">
          <div className="text-14-400 color-black-olive mb-1">
            Field Of Study
          </div>
          <div className="text-14-500 color-black-olive">
            {higher_qualification_details?.field_of_study}
          </div>
        </div>
        <div className="mb-2">
          <div className="text-14-400 color-black-olive mb-1">
            Location
          </div>
          <div className="text-14-500 color-black-olive">
            {`${higher_qualification_details?.city_name}, ${higher_qualification_details?.country_name}`}
          </div>
        </div>
        <div className="mb-2">
          <div className="text-14-400 color-black-olive mb-1">
            Degree
          </div>
          <div className="text-14-500 color-black-olive">
            {higher_qualification_details?.degree}
          </div>
        </div>
      </div>
    ) : (
      <div
        className="center-flex flex-column mt-3"
        onClick={() => {
          setFormType(5);
        }}
      >
        <div>
          <img src={icons.education} alt="affiliations" />
        </div>
        <div className="text-15-500 color-black-olive mt-1 mb-1">
          <u className="hover-effect">Add your education</u>
        </div>
        <div className="text-14-400 color-subtitle-navy text-center">
          Add information about your studies so that others can
          understand your research and background.
        </div>
      </div>
    )} */}
      </div>
    </Card>
  );
};

export default Education;
