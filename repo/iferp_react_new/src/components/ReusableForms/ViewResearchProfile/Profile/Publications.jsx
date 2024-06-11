import { useState } from "react";
import { useDispatch } from "react-redux";
import Card from "components/Layout/Card";
import EditButton from "components/Layout/EditButton";
import Loader from "components/Layout/Loader";
import TooltipPopover from "components/Layout/TooltipPopover";
import UserProfile from "components/Layout/Profile";
import { icons } from "utils/constants";
import { getDataFromLocalStorage } from "utils/helpers";
import { setRProfileID, verifyPublicationAuthorCoAuthor } from "store/slices";

const Publications = ({
  publication,
  isMyProfile,
  setIsEdit,
  setFormType,
  fetchDetails,
}) => {
  const dispatch = useDispatch();
  const [verifyLoader, setVerifyLoader] = useState("");
  const handleItsMe = async (e) => {
    setVerifyLoader(e?.id);
    const response = await dispatch(verifyPublicationAuthorCoAuthor(e));
    if (response?.status === 200) {
      fetchDetails();
    }
    setVerifyLoader("");
  };
  return (
    <Card className="unset-br mb-3">
      <div className="d-flex justify-content-between align-items-center cps-16 cpt-16 cpb-16 cpe-16 border-bottom">
        <div className="text-16-500 title-text">Publications</div>
        {publication?.length > 0 && isMyProfile && (
          <div>
            <EditButton
              onClick={() => {
                setFormType(8);
                setIsEdit(true);
              }}
            />
          </div>
        )}
      </div>
      <div className="cps-16 cpe-16 cpb-22">
        {publication?.map((elem, index) => {
          const {
            id,
            authors,
            co_authors,
            paper_title,
            no_of_pages,
            issn,
            publication_link,
            author_details,
            author_verify,
          } = elem;
          const { name, profile_photo, user_type } = author_details || {};
          let loginID = getDataFromLocalStorage("id");
          const isReasearchProfile =
            ["2", "5"].includes(user_type) && authors && +authors !== loginID;
          const isAuthorVerify = author_verify === "0";
          const isAuthorVerifyBtn =
            author_verify === "0" && +authors === loginID;
          const authID = `${id}-a-${authors}`;
          const isAnyCoAuthor = co_authors?.some((o) => o.user_id);
          return (
            <div key={index} className="mt-3">
              <div className="text-14-400 color-black-olive mb-2">
                Publication {index + 1}
              </div>
              {authors && (
                <>
                  <div className="text-14-500 color-raisin-black mb-1">
                    Authors
                  </div>
                  <div className="d-flex gap-2 mb-2">
                    <UserProfile
                      size="s-18"
                      text={name}
                      isRounded
                      url={profile_photo}
                      isS3UserURL
                    />
                    <div className="text-13-400 d-flex align-items-center gap-1">
                      <span
                        className={
                          isReasearchProfile
                            ? "hover-effect text-decoration-underline"
                            : ""
                        }
                        onClick={() => {
                          if (isReasearchProfile) {
                            dispatch(setRProfileID(authors));
                          }
                        }}
                      >
                        {name}
                      </span>

                      {isAuthorVerify && (
                        <span>
                          <TooltipPopover />
                        </span>
                      )}
                      {isAuthorVerifyBtn && (
                        <span className="d-flex gap-2">
                          <span
                            className="bg-success color-white ps-1 pe-1 h-auto pointer rounded"
                            onClick={() => {
                              handleItsMe({
                                type: "author",
                                id: `${authID}-1`,
                                author_status: "1",
                                author_id: authors,
                                publication_id: id,
                                co_author_id: "",
                                co_author_status: "",
                              });
                            }}
                          >
                            {verifyLoader === `${authID}-1` ? (
                              <span className="ps-2 pe-2 pt-1 pb-1 d-flex">
                                <Loader size="sm" />
                              </span>
                            ) : (
                              "It's Me"
                            )}
                          </span>
                          <span
                            className="bg-danger color-white ps-1 pe-1 h-auto pointer rounded"
                            onClick={() => {
                              handleItsMe({
                                type: "author",
                                id: `${authID}-2`,
                                author_status: "2",
                                author_id: authors,
                                publication_id: id,
                                co_author_id: "",
                                co_author_status: "",
                              });
                            }}
                          >
                            {verifyLoader === `${authID}-2` ? (
                              <span className="ps-2 pe-2 pt-1 pb-1 d-flex">
                                <Loader size="sm" />
                              </span>
                            ) : (
                              "Not Me"
                            )}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {isAnyCoAuthor && (
                <>
                  <div className="text-14-500 color-raisin-black mb-1">
                    Co-Authors
                  </div>
                  <div className="d-flex flex-wrap gap-3">
                    {co_authors?.map((el, index) => {
                      const isCoReasearchProfile =
                        ["2", "5"].includes(el?.user_type) &&
                        el?.user_id &&
                        +el?.user_id !== loginID;
                      const isCoAuthorVerify = el?.co_author_verify === "0";
                      const isCoAuthorVerifyBtn =
                        el?.co_author_verify === "0" && el?.user_id === loginID;

                      const coAuthID = `${id}-co-${el?.user_id}`;
                      return (
                        <div
                          className={`d-flex gap-2 mb-2 ${
                            el?.name ? "" : "d-none"
                          }`}
                          key={index}
                        >
                          <UserProfile
                            size="s-18"
                            text={el?.name || "U"}
                            url={el?.profile_photo}
                            isRounded
                            isS3UserURL
                          />
                          <div className="text-13-400 d-flex align-items-center gap-1">
                            <span
                              className={
                                isCoReasearchProfile
                                  ? "hover-effect text-decoration-underline"
                                  : ""
                              }
                              onClick={() => {
                                if (isCoReasearchProfile) {
                                  dispatch(setRProfileID(el?.user_id));
                                }
                              }}
                            >
                              {el?.name}
                            </span>

                            {isCoAuthorVerify && (
                              <span>
                                <TooltipPopover />
                              </span>
                            )}
                            {isCoAuthorVerifyBtn && (
                              <span className="d-flex gap-2">
                                <span
                                  className="bg-success color-white ps-1 pe-1 h-auto pointer rounded"
                                  onClick={() => {
                                    handleItsMe({
                                      type: "co-author",
                                      id: `${coAuthID}-1`,
                                      author_status: "",
                                      author_id: "",
                                      co_author_id: el?.user_id,
                                      publication_id: id,
                                      co_author_status: "1",
                                    });
                                  }}
                                >
                                  {verifyLoader === `${coAuthID}-1` ? (
                                    <span className="ps-2 pe-2 pt-1 pb-1 d-flex">
                                      <Loader size="sm" />
                                    </span>
                                  ) : (
                                    "It's Me"
                                  )}
                                </span>
                                <span
                                  className="bg-danger color-white ps-1 pe-1 h-auto pointer rounded"
                                  onClick={() => {
                                    handleItsMe({
                                      type: "co-author",
                                      id: `${coAuthID}-2`,
                                      author_status: "",
                                      author_id: "",
                                      co_author_id: el?.user_id,
                                      publication_id: id,
                                      co_author_status: "2",
                                    });
                                  }}
                                >
                                  {verifyLoader === `${coAuthID}-2` ? (
                                    <span className="ps-2 pe-2 pt-1 pb-1 d-flex">
                                      <Loader size="sm" />
                                    </span>
                                  ) : (
                                    "Not Me"
                                  )}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {paper_title && (
                <>
                  <div className="text-14-500 color-raisin-black mb-1">
                    Paper Title
                  </div>
                  <div className="text-14-400 color-raisin-black mb-2">
                    {paper_title}
                  </div>
                </>
              )}
              {no_of_pages && (
                <>
                  <div className="text-14-500 color-raisin-black mb-1">
                    No.of Pages
                  </div>
                  <div className="text-14-400 color-raisin-black mb-2">
                    {no_of_pages}
                  </div>
                </>
              )}
              {issn && (
                <>
                  <div className="text-14-500 color-raisin-black mb-1">
                    ISSN/ISBN
                  </div>
                  <div className="text-14-400 color-raisin-black mb-2">
                    {issn}
                  </div>
                </>
              )}
              {publication_link && (
                <>
                  <div className="text-14-500 color-raisin-black mb-1">
                    Publication Link
                  </div>
                  <u
                    className="text-14-500 color-black-olive pointer w-fit  mb-2"
                    onClick={() => {
                      window.open(publication_link, "_blank");
                    }}
                  >
                    {publication_link}
                  </u>
                </>
              )}
            </div>
          );
        })}

        {isMyProfile && (
          <div
            className="center-flex flex-column mt-3 pointer"
            onClick={() => {
              setFormType(8);
              setIsEdit(true);
            }}
          >
            <div>
              <img src={icons.myPublication} alt="affiliations" />
            </div>
            <div className="text-15-500 color-black-olive mt-1 mb-1">
              <u className="hover-effect">Add your Publications</u>
            </div>
            <div className="text-14-400 color-subtitle-navy text-center">
              Add information about your publications
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Publications;
