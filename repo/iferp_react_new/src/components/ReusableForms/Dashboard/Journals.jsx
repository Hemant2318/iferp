import Card from "components/Layout/Card";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJournals } from "store/slices";
import { journalsPath, studentRoute } from "utils/constants";
import { combineArrayS3, objectToFormData } from "utils/helpers";
import "./DashboardFlag.scss";

const Journals = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [journals, setJournals] = useState([]);

  const getJournals = async () => {
    let forData = objectToFormData();
    const response = await dispatch(fetchJournals(forData));
    let journalList = response?.data?.users || [];
    let spliceList = journalList.slice(0, 2);
    let newList = await combineArrayS3(spliceList, "logo", journalsPath);
    setJournals(newList);
  };

  useEffect(() => {
    getJournals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="cps-24 cpe-24 cpt-24 cpb-12 h-100">
      <div className="d-flex justify-content-between cmb-24">
        <div className="text-18-500-27 color-title-navy font-poppins">
          Journals
        </div>
        <div
          className="text-15-400 color-new-car pointer"
          onClick={() => {
            navigate(studentRoute.publications);
          }}
        >
          <u className=" ">View All</u>
        </div>
      </div>
      <div id="journal-list-container">
        {journals.length === 0 ? (
          <div className="center-flex pt-5 pb-5">No Journals Found</div>
        ) : (
          journals.map((elem, index) => {
            return (
              <React.Fragment key={index}>
                <div className="journal-block">
                  <div className="image-block">
                    <img
                      src={elem?.s3File}
                      alt="journal"
                      className="fit-image fill"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="text-15-500 color-raisin-black">
                      {elem?.name}
                    </div>
                    <div className="text-13-500 color-subtitle-navy mt-2">
                      <b>ISSN:</b> {`${elem?.issn}, ${elem?.type}`}
                    </div>
                  </div>
                </div>
                {journals.length - 1 !== index && (
                  <div className="border-bottom mt-3 mb-3" />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </Card>
  );
};
export default Journals;
