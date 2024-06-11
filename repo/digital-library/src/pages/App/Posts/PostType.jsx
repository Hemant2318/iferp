import Button from "components/inputs/Button/Button";
import DropdownOption from "components/layouts/DropdownOption/DropdownOption";
import Profile from "components/layouts/Profile/Profile";
import VideoPreview from "components/layouts/VideoPreview/VideoPreview";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { icons } from "utils/constants";
import ReactPagination from "components/layouts/ReactPagination";
import { useDispatch, useSelector } from "react-redux";
import { objectToFormData } from "../../../utils/helpers/common";
import {
  saveUnsavePost,
  storePostList,
  usefulUnusefulPost,
} from "../../../store/globalSlice";
import Loader from "../../../components/layouts/Loader";

const PostType = () => {
  const dispatch = useDispatch();
  const param = useParams();
  const { pType } = param;

  const [saveLoader, setSaveLoader] = useState("");

  const pageCount = 12;
  const dataOffset = 0;

  const handlePageClick = () => {
    // const newOffset = (event.selected * 8) % images.length;
    // setImagesOffset(newOffset);
  };

  useEffect(() => {
    // const endOffset = dataOffset + 8;
    // setCurrentImages(images.slice(imagesOffset, endOffset));
    // setPageCount(Math.ceil(images.length / 8));
  }, [dataOffset]);

  const { newPostList } = useSelector((state) => ({
    newPostList: state.global.postList,
  }));

  const handelUsefulUnusefulPost = async (postID) => {
    const response = await dispatch(
      usefulUnusefulPost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = newPostList;
      oldPostList = oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj.id === postID) {
          const likesStatus = copy.is_liked === 0 ? 1 : 0;
          let count = copy.total_likes;
          count = likesStatus === 0 ? count - 1 : count + 1;
          copy = {
            ...copy,
            is_liked: likesStatus,
            total_likes: count <= 0 ? 0 : count,
          };
        }
        return copy;
      });
      dispatch(storePostList(oldPostList));
    }
  };

  const handelSaveUnsave = async (postID) => {
    setSaveLoader(postID);
    const response = await dispatch(
      saveUnsavePost(objectToFormData({ post_id: postID }))
    );
    if (response?.status === 200) {
      let oldPostList = newPostList;
      oldPostList = oldPostList.map((obj) => {
        let copy = { ...obj };
        if (obj.id === postID) {
          copy = {
            ...copy,
            is_saved: copy.is_saved === 0 ? 1 : 0,
          };
        }
        return copy;
      });
      dispatch(storePostList(oldPostList));
    }
    setSaveLoader("");
  };

  const postList = [
    {
      id: 1,
      name: "Alfred Walton",
      bio: "Professor, United university",
      title:
        "Associations of Pulmonary Function with MRI Brain Volumes: A Coordinated Multi-Study Analysis",
      category: "Article",
      doi: "10.3233/JAD-220667",
      totalView: "56",
      totalShare: "26",
      totalLike: "2K",
      totalContradic: "80",
      is_saved: true,
      is_like: true,
      is_dislike: true,
      author: [
        {
          name: "Karan R",
        },
        {
          name: "Stephen Barette",
        },
        {
          name: "Sourojit Das",
        },
      ],
    },
    {
      id: 2,
      name: "Arumugam Nallanathan",
      bio: "Professor of Wireless Communications, University of London",
      title:
        "UAV-enabled Massive MIMO Two-Way Full-Duplex Relay Systems with Non-Orthogonal Multiple Access",
      category: "Article",
      doi: "10.3233/JAD-220667",
      totalView: "60",
      totalShare: "6",
      totalLike: "6K",
      totalContradic: "40",
      is_saved: false,
      is_like: false,
      is_dislike: false,
      author: [
        {
          name: "Karan R",
        },
        {
          name: "Stephen Barette",
        },
        {
          name: "Sourojit Das",
        },
      ],
    },
  ];
  return (
    <div className="shadow">
      <div className="fb-center bb-e3e3">
        <div className="cp-20 text-17-400 lh-21 color-2121">
          {pType === "presentations" && "Presentations (90)"}
          {pType === "articles" && "Articles (90)"}
          {pType === "engineering" && "Engineering Posts (90)"}
          {pType === "all" && "All Posts (90)"}
        </div>
        <div className="cp-20 text-14-400 lh-21 href-block">View All</div>
      </div>
      <div className="cps-20 cpe-20 cpt-26 cpb-26">
        {postList?.map((el, index) => {
          const {
            id,
            name,
            bio,
            title,
            category,
            doi,
            totalView,
            totalShare,
            totalLike,
            totalContradic,
            is_saved,
            is_like,
            is_dislike,
          } = el;
          const isLast = postList.length - 1 === index;
          return (
            <React.Fragment key={index}>
              <div>
                <div className="fb-center">
                  <div className="fa-center gap-3">
                    <Profile url={icons?.principal} size="s-44" isRounded />
                    <div>
                      <div className="text-15-500 lh-28 color-3d3d">{name}</div>
                      <div className="text-14-400 lh-22 color-6666">{bio}</div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-end">
                      <DropdownOption
                        icons={<img src={icons.moreHorizontal} alt="more" />}
                      >
                        <div className="cps-10">Post Options</div>
                      </DropdownOption>
                    </div>
                    <div className="text-13-400 lh-19 color-7070">6h ago</div>
                  </div>
                </div>
                <div className="text-16-500 lh-24 color-2121 mt-3 mb-3 hover-effect pointer">
                  {title}
                </div>
                <div className="row">
                  <div className="col-md-4 cmb-20">
                    <VideoPreview />
                  </div>
                  <div className="col-md-8">
                    <div className="d-flex gap-3">
                      <Button
                        btnText={category}
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
                    <div className="fa-center gap-3 mt-3 mb-3">
                      <div className="fa-center gap-2">
                        <Profile text="Karan R" size="s-26" isRounded />
                        <div className="text-14-400 lh-21 color-3434">
                          Karan R
                        </div>
                      </div>
                      <div className="fa-center gap-2">
                        <Profile text="Stephen Barette" size="s-26" isRounded />
                        <div className="text-14-400 lh-21 color-3434">
                          Stephen Barette
                        </div>
                      </div>
                      <div className="fa-center gap-2">
                        <Profile text="Sourojit Das" size="s-26" isRounded />
                        <div className="text-14-400 lh-21 color-3434">
                          Sourojit Das
                        </div>
                      </div>
                    </div>
                    <div className="fa-center gap-4 text-14-400 lh-21 color-3d3d mb-3">
                      <div>
                        DOI -<span className="text-14-500 ms-1">{doi}</span>
                      </div>
                      <div>
                        Proceeding page -
                        <span className="text-14-500 ms-1">1 to 5</span>
                      </div>
                    </div>
                    <div className="fa-center gap-3">
                      <div className="fa-center text-14-400 color-5555 gap-1">
                        <span>
                          <img src={icons.eye} alt="eye" />
                        </span>
                        <span>{totalView} Views</span>
                      </div>
                      <div className="fa-center text-14-400 color-5555 gap-1">
                        <span>
                          <img src={icons.share} alt="eye" />
                        </span>
                        <span>{totalShare} Citations</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-4 cmb-20">
                    <Button
                      btnText="Predio"
                      btnStyle="SO"
                      leftIcon={icons.downloadArrow}
                      className="h-38"
                      onClick={() => {}}
                    />
                  </div>
                  <div className="col-md-8 fa-center gap-4">
                    <div className="fa-center gap-2">
                      <span
                        className="d-flex"
                        onClick={() => {
                          handelUsefulUnusefulPost(id);
                        }}
                      >
                        {!is_like ? (
                          <img src={icons.successLike} alt="like" />
                        ) : (
                          <i
                            className="color-b176 pointer bi bi-hand-thumbs-up-fill"
                            style={{ fontSize: "20px" }}
                          ></i>
                        )}
                      </span>
                      <span className="text-14-500 color-1818 lh-21">
                        {totalLike}
                      </span>
                      <span className="text-14-400 color-5555 lh-21">
                        Useful
                      </span>
                    </div>
                    <div className="fa-center gap-2">
                      <span className="d-flex">
                        {!is_dislike ? (
                          <img src={icons.successDeslike} alt="like" />
                        ) : (
                          <i
                            className="color-b176 pointer bi bi-hand-thumbs-down-fill"
                            style={{
                              fontSize: "20px",
                              transform: "scaleX(-1)",
                            }}
                          ></i>
                        )}
                      </span>
                      <span className="text-14-500 color-1818 lh-21">
                        {totalContradic}
                      </span>
                      <span className="text-14-400 color-5555 lh-21">
                        Contradict
                      </span>
                    </div>
                    <div className="fa-center gap-2">
                      <span
                        className="d-flex"
                        onClick={() => {
                          if (!saveLoader) {
                            handelSaveUnsave(id);
                          }
                        }}
                      >
                        {!is_saved ? (
                          <img src={icons.successSave} alt="like" />
                        ) : (
                          <i className="color-b176 pointer bi bi-bookmark-fill bg" />
                        )}
                      </span>
                      <span className="text-14-400 color-5555 lh-21">
                        {saveLoader === id ? (
                          <Loader size="sm" />
                        ) : is_saved ? (
                          "Unsave"
                        ) : (
                          "Save"
                        )}
                      </span>
                    </div>
                    <div className="fa-center gap-2">
                      <span className="d-flex">
                        <img src={icons.successShare} alt="like" />
                      </span>
                      <span className="text-14-400 color-5555 lh-21">
                        Share
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {isLast ? (
                <div className="mt-5">
                  <ReactPagination
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                  />
                </div>
              ) : (
                <div className="bt-e1e1 pb-4 mt-4" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PostType;
