import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { PDFDocument, rgb } from "pdf-lib";
import download from "downloadjs";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import ShareButton from "components/Layout/ShareButton";
import { fetchCertificate, setIsPremiumPopup } from "store/slices";
import {
  combineArrayS3,
  downloadFile,
  getCertificateData,
  getCertificatePdf,
  getDataFromLocalStorage,
  titleCaseString,
  // hexToRgbA,
  urlToUnitArray,
} from "utils/helpers";
import OldCertificate from "components/Layout/OldCertificate";
import { certificatePath, icons } from "utils/constants";
import Profile from "components/Layout/Profile";
import { Image } from "react-bootstrap";

const CertificatesAndRewards = () => {
  const dispatch = useDispatch();
  const { comitteeMemberCategoryList } = useSelector((state) => ({
    comitteeMemberCategoryList: state.global.comitteeMemberCategoryList,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState([]);
  const handleDownload = async (data) => {
    let certificateData = getCertificateData(data?.filed_data, {
      certificate_number: data?.certificate_number || "",
      paper_title: data?.paper_title || "",
      create_at: data?.create_at || "",
    });
    const pdfFileData = await urlToUnitArray(data.s3File);
    const pdfBytes = await getCertificatePdf(pdfFileData, certificateData);
    download(pdfBytes, data.img, "application/pdf");
  };
  const getProfiles = async () => {
    const response = await dispatch(fetchCertificate());
    const newData = response?.data?.map((o) => {
      return { ...o, img: o.img || o.certificate };
    });

    let list = await combineArrayS3(newData || [], "img", certificatePath);
    setPageData(list);
    setIsLoading(false);
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const userData = getDataFromLocalStorage();
  const { user_type: userType, membership_details } = userData;
  const { id: membershipID } = membership_details || {};
  // const userType = getDataFromLocalStorage("user_type");

  const access = {
    isShare: userType === "3",
    isUpgradeButton: membershipID === 2 || membershipID === 11,
  };

  const sendToParent = (searchValue) => {
    if (searchValue) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      let data = [];
      pageData?.filter((elem) => {
        const lowerCaseTitle = elem?.title?.toLowerCase();
        const lowerCaseCertificateId = elem?.certificate_number?.toLowerCase();
        if (lowerCaseTitle && lowerCaseTitle.includes(lowerCaseSearchValue)) {
          data.push(elem);
        } else {
          if (
            lowerCaseCertificateId &&
            lowerCaseCertificateId.includes(lowerCaseSearchValue)
          ) {
            data.push(elem);
          }
        }
        return elem;
      });
      setPageData(data);
    } else {
      getProfiles();
    }
  };
  return (
    <Card className="cps-40 cpe-40 cpt-42 cpb-42">
      <div className="text-24-500 color-title-navy font-poppins text-center">
        Certificates & Rewards
      </div>
      <div className="mt-5">
        <OldCertificate
          sendToParent={sendToParent}
          handleSuccess={() => {
            getProfiles();
          }}
        />
      </div>
      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center cpt-50 cpb-50">
          <Loader size="md" />
        </div>
      ) : pageData?.length === 0 ? (
        <div className="d-flex justify-content-center text-15-400 cpb-50 cpt-50 cmt-50 border">
          No Data Found
        </div>
      ) : (
        <div className="cmt-40 fadeInUp">
          {pageData?.map((elem, index) => {
            const {
              s3File,
              title,
              img,
              user_type,
              certificate_number,
              isAwardWinner,
              event_name,
              event_type,
            } = elem;
            const urlType = img?.split(".").pop();
            const ocmCategory = comitteeMemberCategoryList?.find(
              (o) => o.id === +elem?.user_type_category
            )?.name;

            return (
              <>
                <div
                  className="row border cps-18 cpt-18 cpb-18 mb-3"
                  key={index}
                >
                  <div className="col-md-3">
                    {access?.isUpgradeButton ? (
                      <img
                        src={icons.membershipCertificate}
                        alt="cer"
                        className="fit-image fill"
                      />
                    ) : ["pdf"].includes(urlType) ? (
                      <iframe
                        src={elem?.s3File}
                        title="certificate"
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    ) : (
                      <Profile url={s3File} size="s-136" />
                      /* <img src={s3File} alt="cer" className="fit-image fill" /> */
                    )}
                  </div>
                  <div className="col-md-9">
                    <div className="d-flex flex-column justify-content-between h-100 ms-3 mb-3">
                      <div className="text-16-500 color-subtitle-navy">
                        {title ? title : titleCaseString(event_name)}
                      </div>
                      {/* {event_name && (
                        <div className="text-16-500 color-subtitle-navy mt-2">
                          {titleCaseString(event_name)}
                        </div>
                      )} */}
                      {ocmCategory && (
                        <div className="text-14-400 color-black-olive mt-2">
                          {ocmCategory}
                        </div>
                      )}
                      {user_type === "1" && (
                        <div className="text-14-400 color-black-olive mt-2">
                          Participation
                        </div>
                      )}
                      {user_type === "3" && (
                        <div className="text-14-400 color-black-olive mt-2">
                          Keynote Speakers
                        </div>
                      )}
                      {user_type === "4" && (
                        <div className="text-14-400 color-black-olive mt-2">
                          Research Paper Presentation
                        </div>
                      )}
                      {certificate_number && (
                        <div className="mt-2">
                          <span className="text-12-400 color-black-olive">
                            Certificate No:
                          </span>
                          <span className="text-12-400 color-title-navy ms-1">
                            {certificate_number}
                          </span>
                        </div>
                      )}
                      {isAwardWinner && (
                        <div className="text-12-400 color-title-navy">
                          Award winner
                        </div>
                      )}

                      <div className="d-flex align-items-end flex-grow-1">
                        <Button
                          isRounded
                          text={
                            access.isUpgradeButton && event_type === 2
                              ? "Upgrade to Download Certificate"
                              : "Download Certificate"
                          }
                          btnStyle="primary-dark"
                          icon={
                            access.isUpgradeButton &&
                            event_type === 2 && (
                              <Image
                                src={icons.primaryCrown}
                                className="me-2 white-crown"
                                height={20}
                                width={21}
                              />
                            )
                          }
                          className="cps-10 cpe-10 h-35 text-nowrap me-2"
                          onClick={() => {
                            if (access?.isUpgradeButton && event_type === 2) {
                              dispatch(setIsPremiumPopup(true));
                            } else if (urlType === "pdf") {
                              handleDownload(elem);
                            } else {
                              dispatch(downloadFile(elem.img));
                            }
                          }}
                        />
                        {access.isShare && <ShareButton />}
                      </div>
                    </div>
                  </div>
                  {/* <div style={{ width: "175px", height: "124px" }}>
                  {["pdf"].includes(urlType) ? (
                    <iframe
                      src={elem?.s3File}
                      title="certificate"
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <img src={s3File} alt="cer" className="fit-image fill" />
                  )}
                </div>

                <div className="d-flex flex-column justify-content-between flex-grow-1 ms-3">
                  <div className="text-16-500 color-subtitle-navy">{title}</div>
                  <div className="d-flex align-items-center gap-5">
                    <Button
                      isRounded
                      text="Download Certificate"
                      btnStyle="primary-dark"
                      className="cps-10 cpe-10 h-35 text-nowrap"
                      onClick={() => {
                        dispatch(downloadFile(elem.img));
                      }}
                    />
                    {access.isShare && <ShareButton />}
                  </div>
                </div> */}
                </div>
              </>
            );
          })}
        </div>
      )}
    </Card>
  );
};
export default CertificatesAndRewards;
