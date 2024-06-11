import Card from "components/Layout/Card";
const userList = [
  {
    prof: "A",
    name: "Ayan M",
    university: "National University",
  },
  {
    prof: "G",
    name: "Gorge Kelvin",
    university: "University of Canada",
  },
  {
    prof: "J",
    name: "John Doe",
    university: "University of India",
  },
  {
    prof: "K",
    name: "Ken Linda",
    university: "5 similar skills",
  },
];

const PeopleWithSimilarSkills = () => {
  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-22 cpb-22 cpe-16 border-bottom">
        <div className="text-16-500 color-black-olive">
          People with Similar Skills
        </div>
      </div>
      <div className="cps-16 cpe-16 cpt-22 cpb-22">
        {userList.map((elem, index) => {
          return (
            <div
              key={index}
              className={`d-flex align-items-center ${
                userList.length - 1 === index ? "" : "mb-3"
              }`}
            >
              <div
                className="bg-light-primary rounded-circle me-4 center-flex text-20-500"
                style={{ height: "52px", width: "52px" }}
              >
                {elem.prof}
              </div>
              <div>
                <div className="text-14-500 color-new-car">{elem.name}</div>
                <div className="text-13-400 color-black-olive mt-1">
                  {elem.university}
                </div>
              </div>
              <div className="text-13-400 color-new-car ms-auto pointer">
                Follow
              </div>
            </div>
          );
        })}
      </div>
      <div className="center-flex border-top bg-platinum text-14-400 cpt-12 cpb-12">
        View all
      </div>
    </Card>
  );
};
export default PeopleWithSimilarSkills;
