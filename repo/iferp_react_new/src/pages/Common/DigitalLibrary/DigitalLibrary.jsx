import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { encrypt, getDataFromLocalStorage } from "utils/helpers";
import { getAllTopicsList } from "store/slices";
import DigitalLibraryHeaderBlock from "./DigitalLibraryHeaderBlock";
import TopConferenceBlock from "./TopConferenceBlock";
import CitedGloballyBlock from "./CitedGloballyBlock";
import TrendingResearchPredio from "./TrendingResearchPredio";
import TopResearcherBlock from "./TopResearcherBlock";
import "./DigitalLibrary.scss";

const DigitalLibrary = () => {
  const dispatch = useDispatch();
  const { postCategoryList } = useSelector((state) => ({
    postCategoryList: state.global.postCategoryList,
  }));
  const [topicList, setTopicList] = useState([]);

  const [btnLoading, setBtnLoading] = useState(false);

  const fetchAllTopics = async () => {
    setBtnLoading(true);
    const response = await dispatch(getAllTopicsList());
    setTopicList(response?.data?.allTopicList || []);
    setBtnLoading(false);
  };

  const handleRedirect = (details) => {
    const navData = {
      token: getDataFromLocalStorage("token"),
      data: details,
    };
    const encStr = encodeURIComponent(encrypt(navData));
    const baseURL = process.env.REACT_APP_DIGITAL_LIBRARY_BASE_URL;
    const url = `${baseURL}/handleRedirect?data=${encStr}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    fetchAllTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div id="digital-library-container" className="cps-40 cpe-40">
        <DigitalLibraryHeaderBlock
          handleRedirect={handleRedirect}
          postCategoryList={postCategoryList}
        />
        <TopConferenceBlock handleRedirect={handleRedirect} />
        <CitedGloballyBlock
          btnLoading={btnLoading}
          handleRedirect={handleRedirect}
          topicList={topicList}
        />
        <TrendingResearchPredio handleRedirect={handleRedirect} />
        <TopResearcherBlock handleRedirect={handleRedirect} />
      </div>
    </>
  );
};
export default DigitalLibrary;
