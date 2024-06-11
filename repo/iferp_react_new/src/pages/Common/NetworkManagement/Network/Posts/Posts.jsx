import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import CreatePost from "components/Layout/CreatePost";
import PostList from "components/Layout/PostList";
import ChatProfile from "components/Layout/ChatProfile";
import Profile from "components/Layout/Profile";
import DropdownButton from "components/form/DropdownButton";
import { getDataFromLocalStorage, titleCaseString } from "utils/helpers";

// const hashTags = [
//   "iferp",
//   "conference",
//   "ceo",
//   "books",
//   "events",
//   "work",
//   "publications",
//   "mnc",
//   "digital",
// ];

const Post = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { memberType, cType } = params;
  const { myGroupsList } = useSelector((state) => ({
    myGroupsList: state.global.myGroupsList,
  }));
  const [sortPost, setSortPost] = useState("latest");
  const [isPostLoading, setIsPostLoading] = useState(false);

  const redirect = (optionType) => {
    if (!isPostLoading) {
      setSortPost("latest");
      navigate(`/${memberType}/network-management/network/posts/${optionType}`);
    }
  };
  const userType = getDataFromLocalStorage("user_type");
  const access = {
    institutionTab: ["2", "3", "5"].includes(userType),
    companyTab: ["4"].includes(userType),
  };
  const activeClass = "p-2 bg-new-car color-white text-16-500 me-4";
  const inActiveClass = "p-2 color-black-olive text-16-500 me-4 pointer";
  return (
    <div id="post-container" className="flex-grow-1">
      <Card className="d-flex align-items-center justify-content-between p-1 unset-br mb-3">
        <div className="d-flex align-items-center">
          <div
            id="discover-posts-id"
            className={cType === "discover-posts" ? activeClass : inActiveClass}
            onClick={() => {
              redirect("discover-posts");
            }}
          >
            Discover Posts
          </div>
          <div
            className={cType === "my-posts" ? activeClass : inActiveClass}
            onClick={() => {
              redirect("my-posts");
            }}
          >
            My Posts
          </div>
          {access.institutionTab && (
            <div
              className={
                cType === "our-institutional-posts"
                  ? activeClass
                  : inActiveClass
              }
              onClick={() => {
                redirect("our-institutional-posts");
              }}
            >
              Our Institutional Posts
            </div>
          )}
          {access.companyTab && (
            <div
              className={
                cType === "our-company-posts" ? activeClass : inActiveClass
              }
              onClick={() => {
                redirect("our-company-posts");
              }}
            >
              Our Company Posts
            </div>
          )}
          <div
            className={cType === "saved-posts" ? activeClass : inActiveClass}
            onClick={() => {
              redirect("saved-posts");
            }}
          >
            Saved Posts
          </div>
          <div
            className={
              cType === "pending-ownership" ? activeClass : inActiveClass
            }
            onClick={() => {
              redirect("pending-ownership");
            }}
          >
            Pending Ownership
          </div>
        </div>
      </Card>
      <CreatePost type={cType} />
      <div className="row w-100 cmt-26">
        <div className="col-md-8 col-12 mb-3">
          <div className="d-flex justify-content-between align-items-center cmb-24">
            <div className="text-15-500 color-raisin-black">
              {titleCaseString(sortPost.replace("_", " "))} Posts
            </div>
            <div className="text-14-400 color-black-olive d-flex align-items-center">
              Sort By -
              <span className="text-14-500 color-new-car ms-1 me-1">
                {titleCaseString(sortPost.replace("_", " "))}
              </span>
              <DropdownButton
                parentClass="post-options"
                className="d-flex justify-content-end"
                id="iconType"
                icon={<i className="bi bi-chevron-down text-14-500 ms-2" />}
              >
                <div className="post-options-list">
                  <div
                    className={`text-14-400 pointer color-black-olive ${
                      sortPost === "latest" ? "bg-new-car-light" : ""
                    }`}
                    onClick={() => {
                      setSortPost("latest");
                    }}
                  >
                    Latest
                  </div>
                  <div
                    className={`text-14-400 pointer color-black-olive ${
                      sortPost === "trending" ? "bg-new-car-light" : ""
                    }`}
                    onClick={() => {
                      setSortPost("trending");
                    }}
                  >
                    Trending
                  </div>
                  {/* <div
                    className={`text-14-400 pointer color-black-olive ${
                      sortPost === "most_cited" ? "bg-new-car-light" : ""
                    }`}
                    onClick={() => {
                      setSortPost("most_cited");
                    }}
                  >
                    Most Cited
                  </div>
                  <div
                    className={`text-14-400 pointer color-black-olive ${
                      sortPost === "relevant" ? "bg-new-car-light" : ""
                    }`}
                    onClick={() => {
                      setSortPost("relevant");
                    }}
                  >
                    Relevant
                  </div> */}
                </div>
              </DropdownButton>
            </div>
          </div>
          <PostList
            type={cType}
            sortType={sortPost}
            setIsPostLoading={setIsPostLoading}
          />
        </div>
        <div className="col-md-4 col-12 mb-3">
          <ChatProfile />
          {myGroupsList.length > 0 && (
            <Card className="mt-3 cps-24 cpe-24 cpt-24 cpb-24">
              <div className="d-flex cmb-26">
                <div className="text-18-600 color-black-olive">My Groups</div>
              </div>
              <div className="group-list">
                {myGroupsList.map((elem, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div className="group-list-block">
                        <div className="d-flex align-items-center left-block">
                          <Profile isRounded text={elem.name} size="s-48" />
                          <div className="user-details-block ms-3">
                            <div className="text-14-500 color-black-olive">
                              {elem.name}
                            </div>
                          </div>
                        </div>
                      </div>
                      {myGroupsList.length - 1 !== index && (
                        <div className="border-bottom mt-3 mb-3" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {/* <div className="text-15-400 color-new-car mt-3 pointer">
              View All (8)
            </div> */}
            </Card>
          )}
          {/* {type === 0 && (
            <Card className="mt-3 cps-24 cpe-24 cpt-24 cpb-24">
              <div className="d-flex cmb-26">
                <div className="text-18-600 color-black-olive">
                  Followed Hashtags
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {hashTags.map((elem, index) => {
                  return (
                    <div
                      className="text-13-500 color-raisin-black bg-new-car-light ps-3 pe-3 pt-2 pb-2"
                      key={index}
                    >
                      {`#${elem}`}
                    </div>
                  );
                })}
              </div>
            </Card>
          )} */}
        </div>
      </div>
    </div>
  );
};
export default Post;
