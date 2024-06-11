import { forOwn } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Table from "components/Layout/Table";
import { getFeedback } from "store/slices";
import ViewAllFeedbackPopup from "./ViewAll";

const categoryIcon = {
  Other: <i className="bi bi-bullseye me-1" />,
  Bug: <i className="bi bi-bug me-1" />,
  Compliment: <i className="bi bi-hand-thumbs-up me-1" />,
  "Content Error": <i className="bi bi-file-earmark me-1" />,
  Suggetion: <i className="bi bi-chat me-1" />,
};
const opinionIcon = {
  1: <i className="bi bi-emoji-angry color-title-navy" />,
  2: <i className="bi bi-emoji-frown color-title-navy" />,
  3: <i className="bi bi-emoji-neutral color-title-navy" />,
  4: <i className="bi bi-emoji-smile color-title-navy" />,
  5: <i className="bi bi-emoji-laughing color-title-navy" />,
};

const Feedback = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState({});
  const [viewList, setViewList] = useState([]);
  const fetchFeedback = async () => {
    const response = await dispatch(getFeedback());
    let resData = response?.data || [];
    const sortData = {};
    resData?.forEach((el) => {
      const arr = sortData[el.user_id] || [];
      sortData[el.user_id] = [...arr, el];
    });
    setFeedbackList(sortData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const header = [
    {
      title: "Name",
    },
    {
      title: "Comments",
    },
  ];
  const rowData = [];
  forOwn(feedbackList, (value) => {
    const { user_name, message, category, opinion } = value[0] || {};
    let obj = [
      {
        value: <div className="text-start">{user_name}</div>,
      },
      {
        value: (
          <div className="d-flex align-items-start flex-wrap gap-2 ps-2 pe-2">
            <div className="text-start d-flex align-items-center flex-wrap">
              <span> {message}</span>
              {category && (
                <span className="pt-1 pb-1 ps-2 pe-2 ms-1 bg-title-navy color-white text-12-400 text-nowrap">
                  {categoryIcon[category]}
                  {category}
                </span>
              )}
              {opinion && (
                <span className="ms-2 text-18-400">{opinionIcon[opinion]}</span>
              )}
            </div>
            <div
              className={`color-new-car text-14-400 pointer text-nowrap mt-1 ${
                value.length <= 1 ? "d-none" : ""
              }`}
              onClick={() => {
                setViewList(value);
              }}
            >
              View All ({value.length})
            </div>
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <>
      {viewList.length > 0 && (
        <ViewAllFeedbackPopup
          categoryIcon={categoryIcon}
          opinionIcon={opinionIcon}
          list={viewList}
          onHide={() => {
            setViewList([]);
          }}
        />
      )}
      <Table isLoading={isLoading} header={header} rowData={rowData} />
    </>
  );
};
export default Feedback;
