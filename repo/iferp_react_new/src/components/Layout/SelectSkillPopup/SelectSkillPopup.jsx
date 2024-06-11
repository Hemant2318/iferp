import React, { useEffect, useState, useRef } from "react";
import Button from "components/form/Button";
import { icons } from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { skillList, skillListStore } from "store/slices";
import "./SelectSkillPopup.scss";

const SelectSkillPopup = ({
  onHide,
  setAllMentorsList,
  allMentorsList,
  getAllMentors,
}) => {
  const dispatch = useDispatch();
  const myRef = useRef();
  const { storeSkillList } = useSelector((state) => ({
    storeSkillList: state.mentorship.storeSkillList,
  }));
  const [selectedValues, setSelectedValues] = useState(storeSkillList);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSkillList, setAllSkillList] = useState([]);

  const handleShowResult = async (data) => {
    // let formData = new FormData();
    // selectedValues?.length === 0
    //   ? formData.append("", {})
    //   : formData.append("skill", data.join(",")?.replace(/"/g, ""));
    let oldData = {
      ...allMentorsList,
      skill: data?.join(",")?.replace(/"/g, ""),
      offset: 0,
      loading: true,
    };

    // const response = await dispatch(fetchAllMentors({ formData }));
    // if (response?.status === 200) {
    //   setAllMentorsList({
    //     data: response?.data?.result_data,
    //     total: response?.data?.result_count || 0,
    //   });
    setAllMentorsList(oldData);
    getAllMentors(oldData, true, true, true);
    await dispatch(skillListStore(selectedValues));
    onHide();
    // }
  };

  const fetchSkillList = async () => {
    const response = await dispatch(skillList());
    if (response?.status === 200) {
      setAllSkillList(response?.data);
    }
  };
  useEffect(() => {
    fetchSkillList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serachSkillOptions = allSkillList?.filter((skill) =>
    skill?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );
  const handleButtonClick = (value) => {
    if (selectedValues?.includes(value)) {
      setSelectedValues(selectedValues?.filter((val) => val !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleClickOutside = (e) => {
    if (myRef.current && !myRef.current?.contains(e.target)) {
      // setSelectedValues([]);
      onHide();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  let newWidth = window.innerWidth < 700 ? "500px" : "500px" || "500px";

  return (
    <div className="skill-select-popup" ref={myRef} style={{ width: newWidth }}>
      <div className="skill-body">
        <div className="d-flex justify-content-between align-items-center color-dark-navy-blue text-15-500 cps-16 cpe-16 cpt-16 cpb-16">
          Skills
          <div className="d-flex align-items-center skill-select-top-left gap-2">
            <p className="mb-0 pointer" onClick={() => setSelectedValues([])}>
              <i className="bi bi-arrow-clockwise fs-5"></i>
              <span className="">Reset</span>
            </p>
            <div
              className="pointer"
              onClick={() => {
                onHide();
              }}
            >
              <i className="bi bi-x color-dark-navy-blue" />
            </div>
          </div>
        </div>
        <hr className="price-range-border unset-p unset-m" />
        <div className="w-100 max-430 p-3 overflow-auto">
          <div className="searchBar ">
            <span className="search-icon">
              <img src={icons.search} alt="search" />
            </span>
            <input
              id="searchQueryInput"
              type="text"
              name="searchQueryInput"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="skillBtnGroup row gap-3 justify-content-start p-3">
            {serachSkillOptions &&
              serachSkillOptions?.map((skilllist, i) => (
                <div
                  id="skillButton"
                  className="primary-outline col-auto p-0"
                  key={skilllist}
                >
                  <button
                    key={i}
                    type="button"
                    className={
                      selectedValues?.includes(skilllist)
                        ? "active "
                        : "skill-btn "
                    }
                    onClick={() => handleButtonClick(skilllist)}
                  >
                    {skilllist} +
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="w-100 p-3 text-center">
          <Button
            text="Show Results"
            btnStyle="skill-submit-btn"
            isRounded
            className="cps-20 cpe-20 text-14-600-26"
            onClick={() => {
              handleShowResult(selectedValues);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectSkillPopup;
