import { map } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Dropdown from "components/form/Dropdown";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Profile from "components/Layout/Profile";
import { fetchAwardWinner, setApiError } from "store/slices";
import {
  combineArrayS3,
  downloadFile,
  generatePreSignedUrl,
  objectToFormData,
} from "utils/helpers";
import { certificatePath } from "utils/constants";

const AwardWinners = () => {
  const dispatch = useDispatch();
  const currentYear = moment().year();
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState([]);
  const [year, setYear] = useState(currentYear);
  const getProfiles = async (year = currentYear) => {
    const formData = objectToFormData({ year: year });
    const response = await dispatch(fetchAwardWinner(formData));
    let list = [];
    if (response?.data) {
      list = await combineArrayS3(
        response?.data,
        "certificate",
        certificatePath
      );
      // list = response?.data;
    }
    setPageData(list);
    setIsLoading(false);
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="cps-40 cpe-40 cpt-42 cpb-42">
      <div className="d-flex align-items-center justify-content-between">
        <div className="text-26-500 color-title-navy font-poppins">
          Award Winners
        </div>
        <div className="d-flex">
          <Dropdown
            placeholder="Select Year"
            value={year}
            optionValue="id"
            options={map(Array.from(Array(10)), (o, index) => {
              return {
                id: currentYear - index,
                name: currentYear - index,
              };
            })}
            onChange={(e) => {
              const val = e.target.value;
              setIsLoading(true);
              setYear(val);
              getProfiles(val);
            }}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
          <Loader size="md" />
        </div>
      ) : pageData.length === 0 ? (
        <div className="d-flex justify-content-center text-15-400 cpb-50 cpt-50 cmt-50 border">
          No Data Found
        </div>
      ) : (
        <div className="cmt-32 fadeInUp">
          {pageData.map((elem, index) => {
            let certificateUrl = elem?.certificate;
            const urlType = certificateUrl
              ? certificateUrl?.split(".").pop()
              : "";
            return (
              <div
                className={`d-flex flex-sm-row flex-column border cps-18 cpt-18 cpb-18 cpe-30 ${
                  pageData.length - 1 === index ? "" : "mb-3"
                }`}
                key={index}
              >
                <div className="me-sm-5">
                  {["pdf"].includes(urlType) ? (
                    <iframe
                      // className="w-100"
                      src={elem?.s3File}
                      title="certificate"
                      style={{
                        height: "136px",
                        width: "136px",
                      }}
                    />
                  ) : (
                    <Profile
                      // isS3UserURL
                      url={elem?.s3File}
                      text={elem.name}
                      size="s-136"
                    />
                  )}
                </div>
                <div className="d-flex flex-column justify-content-between">
                  <div className="text-16-500 color-subtitle-navy mt-sm-0 mt-3">
                    {elem.name} -{" "}
                    <span className="text-16-500 color-new-car">
                      {elem.award_type}
                    </span>
                  </div>
                  <div className="text-15-400-25 color-subtitle-navy mb-sm-0 mb-3">
                    {elem.event_name}
                  </div>
                  {elem.paper_file && (
                    <div className="d-flex align-items-center mx-sm-0 mx-auto">
                      <Button
                        isRounded
                        text="View Paper"
                        btnStyle="primary-light"
                        className="cps-30 cpe-30"
                        onClick={async () => {
                          if (elem.paper_file) {
                            const response = await generatePreSignedUrl(
                              elem.paper_file,
                              certificatePath
                            );
                            dispatch(downloadFile(response));
                          } else {
                            dispatch(
                              setApiError({
                                show: true,
                                message: "Paper not found",
                                type: "danger",
                              })
                            );
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
export default AwardWinners;
