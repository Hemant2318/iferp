import { useNavigate } from "react-router-dom";
import Card from "components/Layout/Card";
// import HeaderLayout from "components/Layout/HeaderLayout";
import { membershipType } from "utils/constants";
import SliderLayout from "pages/Auth/SliderLayout/SliderLayout";
import "./Selection.scss";

const Selection = () => {
  const navigate = useNavigate();
  return (
    <div id="selection-container">
      <SliderLayout isSelection>
        <Card className="m-auto card-padding">
          <div className="text-center text-26-500 cmb-30 font-poppins">
            Join As
          </div>
          {membershipType.map((elem, index) => {
            return (
              <div
                className={`arrow-block ${
                  ["0", "6"].includes(elem.id) ? "d-none" : ""
                }`}
                key={index}
              >
                <div>
                  <div className="text-18-500 color-raisin-black mb-2 font-poppins">
                    {elem.title}
                  </div>
                  <div className="text-14-400 color-raisin-black text-break">
                    {elem.description}
                  </div>
                </div>
                <div
                  className="r-icon-block"
                  onClick={() => {
                    navigate(`/${elem.type}/member/register`);
                  }}
                >
                  <i className="bi bi-chevron-right text-20-500 color-new-car" />
                </div>
              </div>
            );
          })}
        </Card>
      </SliderLayout>
    </div>
  );
  // return (
  //   <HeaderLayout>
  //     <div id="selection-container">
  //       <div className="row">
  // <div className="m-auto text-center">
  //   <div className="text-center text-32-600 color-raisin-black cmb-20">
  //     IFERP Membership
  //   </div>
  //   <div className="text-center text-16-400 color-raisin-black mb-5">
  //     Become an IFERP Member to get connected with engineers and
  //     researchers
  //   </div>
  // </div>
  // <Card className="col-md-5 col-md-3 m-auto card-padding">
  //   <div className="text-center text-28-500 cmb-30">Join As</div>
  //   {membershipType.map((elem, index) => {
  //     return (
  //       <div
  //         className={`arrow-block ${
  //           ["0", "6"].includes(elem.id) ? "d-none" : ""
  //         }`}
  //         key={index}
  //       >
  //         <div>
  //           <div className="text-18-500 color-raisin-black mb-2">
  //             {elem.title}
  //           </div>
  //           <div className="text-14-400 color-raisin-black text-break">
  //             {elem.description}
  //           </div>
  //         </div>
  //         <div
  //           className="r-icon-block"
  //           onClick={() => {
  //             navigate(`/${elem.type}/member/register`);
  //           }}
  //         >
  //           <i className="bi bi-chevron-right text-20-500 color-new-car" />
  //         </div>
  //       </div>
  //     );
  //   })}
  // </Card>
  //       </div>
  //     </div>
  //   </HeaderLayout>
  // );
};
export default Selection;
