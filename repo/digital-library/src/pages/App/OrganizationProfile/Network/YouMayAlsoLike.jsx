import { Button } from "components";
import { icons } from "utils/constants";

const YouMayAlsoLike = () => {
  return (
    <div className="shadow cpt-20">
      <div className="bb-e3e3 cps-20 cpe-20 cpb-20 fb-center">
        You may also like
      </div>
      <div className="cp-20">
        <div className="text-18-500">
          Identification of an increased lifetime risk of major adverse
          cardiovascular events in UK Biobank participants with scoliosis
        </div>
        <div className="d-flex gap-3 mt-3 mb-3">
          <Button
            btnText="Article"
            btnStyle="GD"
            onClick={() => {}}
            className="ps-4 pe-4 text-13-400 lh-21 h-32"
          />
          <Button
            btnText="Full-text available"
            btnStyle="PO"
            onClick={() => {}}
            className="text-13-400 lh-21 h-32"
          />
        </div>
        <Button
          btnText="Download Predio"
          btnStyle="SO"
          leftIcon={icons.downloadArrow}
          className="h-38"
          onClick={() => {}}
        />
      </div>
      <div className="text-center bg-f0f0 pt-2 pb-2">
        <span className="pointer text-14-400 lh-21 color-5555">View all</span>
      </div>
    </div>
  );
};

export default YouMayAlsoLike;
