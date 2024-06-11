import React, { useEffect, useState } from "react";
import Modal from "components/Layout/Modal";
import { dashConvertedString } from "utils/helpers";
import SeachInput from "components/form/SeachInput";
import Loader from "components/Layout/Loader";

const ExploreCategoryPopup = ({
  show,
  onHide,
  categories,
  handleRedirect,
  height,
  isCited,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [timer, setTimer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newList, setNewList] = useState([]);

  const handleSearch = (e) => {
    setIsLoading(true);
    const newVal = e.target.value;
    setSearchValue(newVal);
    let time = timer;
    clearTimeout(time);
    time = setTimeout(() => {
      const newData = categories?.filter((o) =>
        o?.name?.toLowerCase()?.includes(newVal)
      );
      setNewList(newData);
      setIsLoading(false);
    }, 800);
    setTimer(time);
  };

  useEffect(() => {
    if (categories?.length) {
      setNewList(categories);
    }
  }, [categories]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      className={isCited ? "100%" : ""}
      title={"Explore All Categories"}
    >
      {isCited && (
        <div className="cmt-22 cmb-22 cpe-5">
          <SeachInput
            isRounded
            placeholder="Search Categories"
            value={searchValue}
            onChange={handleSearch}
          />
        </div>
      )}

      <div
        className={`${
          isCited ? "cmb-22 cpe-5 overflow-x-hidden overflow-y-auto" : "cmt-22"
        } `}
        style={{ height: height }}
      >
        {isLoading ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            <Loader size="md" />
          </div>
        ) : newList?.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center h-100">
            No Data Found
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 cmb-20 research-container">
            {newList?.map((el, index) => {
              return (
                <span
                  key={index}
                  className="text-15-500 tag-item pointer"
                  onClick={() => {
                    const newName = dashConvertedString(el?.name);
                    handleRedirect({
                      type: "POST",
                      post_type: newName,
                    });
                    onHide();
                  }}
                >
                  {el?.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ExploreCategoryPopup;
