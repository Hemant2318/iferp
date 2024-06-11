import { Button, Profile } from "components";
import { icons } from "utils/constants";

const TrendingResearchers = () => {
  const topReaserch = [
    {
      name: "Dr. Paquito",
      des: "Principal",
      college: "RMK College of Engineering",
    },
    {
      name: "Dr. Manju Gupta",
      des: "Professor",
      college: "RMK College of Engineering",
    },
    {
      name: "Dr. Alireza",
      des: "HOD",
      college: "RMK College of Engineering",
    },
    {
      name: "Alena M",
      des: "Researcher",
      college: "RMK College of Engineering",
    },
  ];
  return (
    <div className="bg-F50A">
      <div className="container cpt-74 cpb-74">
        <div className="text-40-600 color-1919 mb-5 text-center">
          Trending Researchers
        </div>
        <div className="row flex-wrap">
          {topReaserch?.map((elm, index) => {
            return (
              <div className="col-md-6 col-lg-4 col-xl-3 gy-4" key={index}>
                <div className="bg-ffff p-2">
                  <Profile url={icons.principal} />
                  <div className="text-center text-16-500 color-2121 cmt-30 mb-2">
                    {elm.name}
                  </div>
                  <div className="text-center text-16-500 color-b176">
                    {elm.des}
                  </div>
                  <div className="text-center text-14-400 color-3d3d cmt-10 cmb-20">
                    {elm.college}
                  </div>
                  <div className="fj-center pb-3">
                    <Button
                      btnText="Follow"
                      btnStyle="SO"
                      className="ps-4 pe-4"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendingResearchers;
