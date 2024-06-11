import Card from "components/Layout/Card";
import EditButton from "components/Layout/EditButton";
import { icons } from "utils/constants";

const MyResearchId = ({ research_id, isMyProfile, setIsEdit, setFormType }) => {
  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-16 cpb-16 cpe-16 border-bottom">
        <div className="text-16-500 title-text">My Research ID’s</div>
        {research_id?.length > 0 && isMyProfile && (
          <div>
            <EditButton
              onClick={() => {
                setFormType(7);
                setIsEdit(true);
              }}
            />
          </div>
        )}
      </div>

      <div className="cps-16 cpe-16 cpb-22">
        {research_id?.map((elem, index) => {
          const { name, number } = elem;
          const isURL = number.includes("http");
          return (
            <div key={index} className="mt-3">
              <div className="mb-2">
                <div className="text-14-400 color-black-olive mb-1">
                  Research ID {index + 1}
                </div>
                <div className="color-black-olive">
                  <span className="text-14-500">{name}</span>
                  {!isURL && (
                    <span className="text-14-400">
                      {" - "} {number}
                    </span>
                  )}
                </div>
              </div>
              {isURL && (
                <u
                  className="text-14-500 color-black-olive pointer w-fit"
                  onClick={() => {
                    window.open(number, "_blank");
                  }}
                >
                  {number}
                </u>
              )}
            </div>
          );
        })}

        {isMyProfile && (
          <div
            className="center-flex flex-column mt-3 pointer"
            onClick={() => {
              setFormType(7);
              if (research_id?.length > 0) {
                setIsEdit(true);
              }
            }}
          >
            <div>
              <img src={icons.researchId} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">
                {research_id?.length === 0
                  ? "Add your research ID’s"
                  : "Add another research ID’s"}
              </u>
            </div>
            {research_id?.length === 0 && (
              <div className="text-14-400 color-subtitle-navy text-center">
                Let others know about your other research profiles and get
                publicity
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MyResearchId;
