import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import ShareButton from "components/Layout/ShareButton";
import { fetchAllBranding } from "store/slices";

const BrandingAndPublicity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(true);
  const [list, setList] = useState([]);
  const getProfiles = async () => {
    const response = await dispatch(fetchAllBranding());
    let resList = [];
    if (response?.data?.brandingCategory) {
      resList = response?.data?.brandingCategory;
    }
    setList(resList);
    setPageLoading(false);
  };
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="center-flex flex-column mb-5">
        <div className="text-24-500 color-black-olive">
          Branding & Publicity
        </div>
        <div className="text-15-400 color-black-olive mt-2 text-center">
          Iferp helps in creating a strong, positive perception of a company,
          its products or services in the
          <br /> people's mind by applying branding and marketing strategies
        </div>
      </div>

      {pageLoading ? (
        <div className="center-flex cpt-50 cpb-50">
          <Loader size="md" />
        </div>
      ) : list.length === 0 ? (
        <div className="center-flex cpt-50 cpb-50 text-15-400">
          <div>Data not found.</div>
        </div>
      ) : (
        <div className="row fadeInUp">
          {list.map((elem, index) => {
            return (
              <div className="col-md-6 cmb-22 d-flex" key={index}>
                <Card className="cps-16 cpe-16 cpt-22 cpb-22 d-flex flex-column w-100">
                  <div className="text-18-500 color-new-car">
                    {elem.category}
                  </div>
                  <div className="text-15-400 color-black-olive mt-2 cmb-30">
                    {elem.description}
                  </div>
                  <div
                    className={
                      elem.type ? "d-flex align-items-end mt-auto" : "d-none"
                    }
                  >
                    <Button
                      isRounded
                      text="Apply Now"
                      btnStyle="primary-dark"
                      className="h-35 text-13-400 cps-20 cpe-20"
                      onClick={() => {
                        navigate(
                          `/corporate/branding-and-publicity/${elem.type}`
                        );
                      }}
                    />
                  </div>
                </Card>
              </div>
            );
          })}

          <div className="col-md-6 cmb-22 d-flex">
            <Card className="cps-16 cpe-16 cpt-22 cpb-22 d-flex flex-column w-100">
              <div className="text-18-500 color-new-car">Share Post</div>
              <div className="text-15-400 color-black-olive mt-2 cmb-30">
                Share your post and spread knowledge with various people of your
                community. Connect with the people of your inspiration and
                attain atmost knowledge
              </div>
              <div className="d-flex align-items-end mt-auto">
                <ShareButton>
                  <Button
                    isRounded
                    text="Share Post"
                    btnStyle="primary-dark"
                    className="h-35 text-13-400 cps-20 cpe-20"
                    onClick={() => {}}
                  />
                </ShareButton>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
export default BrandingAndPublicity;
