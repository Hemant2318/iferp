import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import DeletePopup from "components/Layout/DeletePopup";
import Loader from "components/Layout/Loader";
import { icons } from "utils/constants";
import { getDataFromLocalStorage, objectToFormData } from "utils/helpers";
import { fetchChapters, deleteChapters } from "store/slices";

const Chapters = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoader, setLoader] = useState(true);
  const [chapterID, setChapterID] = useState(null);
  const [chapterList, setChapterList] = useState([]);
  const handleRedirect = (id) => {
    navigate(
      `/${params.memberType}/chapters-groups/chapters/${id}/event-people`
    );
  };

  useEffect(() => {
    getChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChapters = async () => {
    const response = await dispatch(fetchChapters({}));
    if (response.data) {
      setChapterList(response.data);
    }
    setLoader(false);
  };
  const userType = getDataFromLocalStorage("user_type");
  const access = {
    isSubTitle: userType !== "0" && userType !== "6",
    isCreateChapter: userType === "0",
    isEdit: userType === "0",
    isDelete: userType === "0",
  };
  return (
    <Card className="cps-30 cpe-30 cpt-40 cpb-30">
      {chapterID && (
        <DeletePopup
          title="Delete Chapter"
          message="Are you sure you want to delete this Chapter?"
          id={chapterID}
          onHide={() => {
            setChapterID(null);
          }}
          handelSuccess={() => {
            setChapterID(null);
            getChapters();
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ id: chapterID });
            const response = await dispatch(deleteChapters(forData));
            return response;
          }}
        />
      )}
      <div className="d-flex justify-content-between align-items-center cmb-20">
        <div>
          <div className="text-22-500 color-title-navy font-poppins">
            IFERP Chapters
          </div>
          {access.isSubTitle && (
            <div className="text-18-400 color-subtitle-navy mt-3">
              Explore our Student Chapters
            </div>
          )}
        </div>

        {access.isCreateChapter && (
          <Button
            onClick={() => {
              navigate(`/admin/chapters-groups/chapters/add-chapter`);
            }}
            text="+ Create Chapter"
            btnStyle="primary-outline"
            className="h-35 text-14-500"
            isSquare
          />
        )}
      </div>
      <div className="row">
        {isLoader ? (
          <div className="cmt-30 cmb-50">
            <Loader size="md" />
          </div>
        ) : (
          chapterList.map((elem, index) => {
            return (
              <div className="col-md-6 cmb-24" key={index}>
                <div className="chapter-block">
                  <div className="text-18-500 color-raisin-black">
                    {elem.chapter_name}
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="r-icon-block"
                      onClick={() => {
                        handleRedirect(elem.id);
                      }}
                    >
                      <i className="bi bi-chevron-right text-28-500 color-new-car" />
                    </div>
                    {access.isEdit && (
                      <div
                        className="d-flex pointer"
                        onClick={() => {
                          navigate(
                            `/admin/chapters-groups/chapters/${elem.id}`
                          );
                        }}
                      >
                        <img src={icons.edit} alt="edit" className="h-21" />
                      </div>
                    )}
                    {access.isDelete && (
                      <div
                        className="d-flex pointer"
                        onClick={() => {
                          setChapterID(elem.id);
                        }}
                      >
                        <img
                          src={icons.deleteIcon}
                          alt="delete"
                          className="h-21"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
export default Chapters;
