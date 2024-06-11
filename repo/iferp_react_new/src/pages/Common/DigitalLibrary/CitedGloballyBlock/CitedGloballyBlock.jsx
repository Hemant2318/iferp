import Card from "components/Layout/Card";
import Loader from "components/Layout/Loader";
import Button from "components/form/Button";
import React, { useState } from "react";
import { dashConvertedString, titleCaseString } from "utils/helpers";

const CitedGloballyBlock = ({ handleRedirect, topicList, btnLoading }) => {
  const [departmentShow, setDepartmetShow] = useState(3);
  const [expandedTopics, setExpandedTopics] = useState({});

  const toggleTopics = (name) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [name]: prev[name] ? false : true,
    }));
  };
  return (
    <div className="">
      <div className="cmb-50">
        <div className="text-24-500 color-raisin-black mb-3 lh-32">
          Publish Research and Get Cited Globally
        </div>
        <div className="text-16-400 color-black-olive cmb-30">
          Publish your presentations & Get an opportunity to interact with
          millions of researchers all over the globe
        </div>
        {btnLoading ? (
          <div className="cpt-30 cpb-50">
            <Loader size="md" />
          </div>
        ) : (
          topicList?.slice(0, departmentShow)?.map((elem, index) => {
            const { department_name, topics } = elem;
            const isExpanded = expandedTopics[department_name] || false;
            return (
              <Card className="br-6 card-border cmb-32" key={index}>
                <div className="row cps-22 cpt-32 cpe-28 cpb-22">
                  <div className="col-md-4">
                    <h1 className="text-28-500-32 color-raisin-black cmb-16">
                      {titleCaseString(department_name)}
                    </h1>
                    {/* <div className="d-flex gap-3 cmb-10">
                      <div className="d-flex flex-column align-items-center">
                        <span className="text-16-700 color-3434">
                          {views} M
                        </span>
                        <span className="text-14-400 color-davys-gray">
                          View
                        </span>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <span className="text-16-700 color-3434">
                          {posts} M
                        </span>
                        <span className="text-14-400 color-davys-gray">
                          Posts
                        </span>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <span className="text-16-700 color-3434">
                          {authors} M
                        </span>
                        <span className="text-14-400 color-davys-gray">
                          Authors
                        </span>
                      </div>
                    </div> */}
                    {/* <div>
                      <OverlapProfile
                        userList={[
                          { id: 1, user_details: { id: 1, profile: "" } },
                          { id: 2, user_details: { id: 2, profile: "" } },
                          { id: 3, user_details: { id: 3, profile: "" } },
                          { id: 4, user_details: { id: 4, profile: "" } },
                          { id: 1, user_details: { id: 5, profile: "" } },
                        ]}
                        NoText
                      />
                    </div> */}
                  </div>
                  <div className="col-md-8">
                    {topics?.length > 0 ? (
                      <div className="row">
                        {topics
                          ?.slice(0, isExpanded ? topics?.length : 5)
                          ?.map((t, i) => {
                            const { topics } = t;
                            return (
                              <div className="col-md-6" key={i}>
                                <div className="d-flex justify-content-between text-14-500 color-new-car cpt-9 cpb-18">
                                  <span
                                    className="pointer"
                                    onClick={() => {
                                      const newName =
                                        dashConvertedString(topics);
                                      handleRedirect({
                                        type: "POST",
                                        post_type: newName,
                                      });
                                    }}
                                  >
                                    {titleCaseString(topics)}
                                  </span>
                                  {/* <span>{tPost}k Posts</span> */}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        No Data Found.
                      </div>
                    )}
                  </div>
                </div>
                {topics?.length > 5 && (
                  <div className="d-flex justify-content-center cpt-23 cpb-23 bt-new-car">
                    <div
                      className="d-flex align-items-center gap-3 color-new-car text-16-600 pointer"
                      onClick={() => toggleTopics(department_name)}
                    >
                      <span>{isExpanded ? "View Less" : "View More"}</span>
                      <i
                        className={
                          isExpanded ? "bi bi-chevron-up" : "bi bi-chevron-down"
                        }
                      />
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
        <div className="d-flex justify-content-center">
          <Button
            text={departmentShow === 3 ? "Show More" : "Show Less"}
            btnStyle="primary-dark"
            onClick={() => {
              setDepartmetShow(departmentShow === 3 ? topicList?.length : 3);
            }}
          />
        </div>
      </div>
      {/* <div className="col-md-6 cmb-50 d-flex justify-content-center">
        <div className="cpt-16 cps-16 cpe-16" style={{ height: "100%" }}>
          <img
            src={icons.digitalLibraryImage2}
            alt="digital"
            className="fit-image fill"
          />
        </div>
      </div> */}
      {/* {publishMore && (
        <ExploreCategoryPopup
          show={publishMore}
          onHide={() => {
            setPublishMore(false);
          }}
          categories={keywordsList}
          type={"2"}
          handleRedirect={handleRedirect}
          height="300px"
          isCited
        />
      )} */}
    </div>
  );
};

export default CitedGloballyBlock;
