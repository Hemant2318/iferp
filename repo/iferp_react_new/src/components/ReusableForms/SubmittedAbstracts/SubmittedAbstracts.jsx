import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FilePreview from "components/Layout/FilePreview";
import ViewPaper from "components/ReusableForms/Paper/ViewPaper";
import { generatePreSignedUrl } from "utils/helpers";
import { eventAbstarctPath } from "utils/constants";

const SubmittedAbstracts = () => {
  const [paperID, setPaperID] = useState("");
  const [paperList, setPaperList] = useState([]);
  const { eventData } = useSelector((state) => ({
    eventData: state.global.eventData || {},
  }));
  const { abstract_details = [] } = eventData;
  // let list = abstract_details.length > 0 ? abstract_details : [];
  const getAbstarctList = async (abstractData) => {
    const promises = abstractData.map(async (elm) => {
      let response = "";
      let isImage = false;
      if (
        ["png", "jpg", "jpeg"].includes(elm.abstract_path?.split(".").pop())
      ) {
        isImage = true;
        response = await generatePreSignedUrl(
          elm.abstract_path,
          eventAbstarctPath
        );
      }
      return { ...elm, s3File: response, isImage: isImage };
    });
    const results = await Promise.all(promises);
    setPaperList(results);
  };
  useEffect(() => {
    if (abstract_details?.length > 0) {
      getAbstarctList(abstract_details);
    }
    if (abstract_details?.length > 0 && localStorage.abstractID) {
      let index = abstract_details.findIndex(
        (o) => o?.id === +localStorage.abstractID
      );
      setPaperID(index);
      setTimeout(() => {
        localStorage.removeItem("abstractID");
      }, 3000);
    }
  }, [abstract_details]);

  return (
    <div>
      {paperList?.map((elm, index) => {
        let { id, paper_title, abstract_id, abstract_path, isImage, s3File } =
          elm;
        return (
          <React.Fragment key={index}>
            <div className="border rounded p-2 mb-3">
              <div className="d-flex align-items-center position-relative ">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    {isImage ? (
                      <div
                        style={{
                          height: "100px",
                          width: "100px",
                        }}
                      >
                        <img
                          src={s3File}
                          alt="abstarct"
                          className="fill fit-image"
                        />
                      </div>
                    ) : (
                      <FilePreview url={`http://${abstract_path}`} />
                    )}
                  </div>
                  <div className="">
                    <div className="mb-2 text-16-500">{abstract_id}</div>
                    <div className="flex-grow-1">{paper_title}</div>
                  </div>
                </div>
                <div
                  className="position-absolute end-0 cme-20 pointer border rounded-circle d-flex p-2"
                  onClick={() => {
                    if (paperID === index) {
                      setPaperID("");
                    } else {
                      setPaperID(index);
                    }
                  }}
                >
                  <i
                    className={`bi ${
                      paperID === index ? "bi-chevron-up" : "bi-chevron-down"
                    } text-20-500`}
                  />
                </div>
              </div>
              {paperID === index && (
                <div className="cmt-30">
                  <ViewPaper type="abstract" id={id} />
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default SubmittedAbstracts;
