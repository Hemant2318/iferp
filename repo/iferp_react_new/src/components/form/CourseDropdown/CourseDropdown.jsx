import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/Layout/Loader";
import { addCourses, getCourses } from "store/slices";
import { objectToFormData } from "utils/helpers";
import "./CourseDropdown.scss";

const CourseDropdown = ({
  id,
  value,
  error,
  onChange,
  isClearable,
  courseType,
}) => {
  const { courseList } = useSelector((state) => ({
    courseList: state.global.courseList,
  }));
  const dispatch = useDispatch();
  const myRef = useRef();
  const listRef = useRef();
  const [isMenu, setIsMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const handleItem = (e, elm) => {
    e.preventDefault();
    e.stopPropagation();
    onChange({
      target: {
        id: id,
        value: elm.id,
        data: elm,
      },
    });
    setSearchText("");
    setIsMenu(false);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.value;
    setSearchText(val);
  };
  const handleCreate = async (e) => {
    setIsLoader(true);
    const response = await dispatch(
      addCourses(
        objectToFormData({
          name: searchText,
          course_type: courseType || "ug",
        })
      )
    );
    if (response?.status === 200) {
      dispatch(getCourses());
      handleItem(e, response?.data);
    }
    setIsLoader(false);
  };
  const handleClickOutside = (e) => {
    if (myRef && myRef?.current && !myRef.current.contains(e.target)) {
      setIsMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  const findVal = courseList?.find((o) => +o.id === +value);
  const { courses_name } = findVal || {};
  let displayList = courseList;
  if (searchText) {
    displayList = courseList.filter((o) => o.courses_name.includes(searchText));
  }
  const isCreate = displayList.length === 0 && searchText;
  return (
    <div id="course-dropdown-container">
      <div
        className={`course-input-block ${
          courses_name ? "remove-placeholder-color" : ""
        }`}
        ref={myRef}
        onClick={() => {
          setIsMenu(true);
        }}
      >
        <input
          type="text"
          value={searchText}
          placeholder={courses_name || "Select Course"}
          onChange={handleSearch}
        />

        {isClearable && courses_name && (
          <i
            className="bi bi-x close-con"
            onClick={(e) => {
              handleItem(e, { id: "" });
            }}
          />
        )}
        {(!isClearable || !courses_name) && (
          <i className="bi bi-chevron-down icon-con" />
        )}
        {isMenu && (
          <div className="course-list iferp-scroll" ref={listRef}>
            {isCreate ? (
              <div
                className="course-item d-flex align-items-center flex-wrap gap-1"
                onClick={(e) => {
                  handleCreate(e);
                }}
              >
                <span>Create</span>
                <span>"{searchText}"</span>
                {isLoader && (
                  <span className="ms-3">
                    <Loader size="sm" />
                  </span>
                )}
              </div>
            ) : (
              displayList?.map((el, index) => {
                return (
                  <div
                    key={index}
                    className="course-item"
                    onClick={(e) => {
                      handleItem(e, el);
                    }}
                  >
                    {el.courses_name}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      {error && (
        <span className="text-13-400 pt-1">
          <span style={{ color: "red" }}>{error}</span>
        </span>
      )}
    </div>
  );
};

export default CourseDropdown;
