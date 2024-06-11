import React, { useState } from "react";
import Card from "components/Layout/Card";
import { icons } from "utils/constants";
import ExploreCategoryPopup from "../ExploreCategoryPopup";
import { dashConvertedString } from "utils/helpers";

const DigitalLibraryHeaderBlock = ({ handleRedirect, postCategoryList }) => {
  const [researchMore, setResearchMore] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // const [newCategoryList, setNewCategoryList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setSearchValue(e?.target?.value);
    // if (!e?.target?.value) {
    //   setIsLoading(true);
    //   setTimeout(() => {
    //     setNewCategoryList(postCategoryList);
    //   }, 500);
    //   setIsLoading(false);
    // }
  };
  const handleSearch = (data) => {
    const newName = dashConvertedString(data);
    handleRedirect({
      type: "POST",
      post_type: newName,
    });
    // setIsLoading(true);
    // setIsLoading(false);
    // const filterList = newCategoryList?.filter((e) =>
    //   e?.name?.toLowerCase()?.includes(data?.toLowerCase())
    // );
    // setNewCategoryList(filterList);
  };

  // useEffect(() => {
  //   if (postCategoryList?.length) {
  //     setNewCategoryList(postCategoryList);
  //   }
  // }, [postCategoryList]);

  return (
    <div className="row">
      <div className="col-md-6 cmb-50">
        <Card className="cpt-16 cps-16 cpe-16 library-image-shadow d-flex justify-content-center">
          <div>
            <img
              src={icons.digitalLibraryNewImage}
              alt="digital"
              className="fit-image fill"
            />
          </div>
        </Card>
      </div>
      <div className="col-md-6 cmb-50">
        <div className="text-26-500 color-raisin-black mb-3 lh-32">
          Discover & Globalize Your Research
        </div>
        <div className="text-16-400 color-black-olive cmb-30">
          Explore and stay connected with various organizations and researchers
          all over the world
        </div>
        <div className="digital-search-block box-shadow cmb-26">
          <span className="search-bloack">
            <input
              type="text"
              placeholder="Search research, books, articles & etc"
              value={searchValue}
              onChange={handleChange}
            />
          </span>
          <span
            className={`${searchValue && "pointer"} buttton-block`}
            onClick={() => {
              if (searchValue) {
                handleSearch(searchValue);
              }
            }}
          >
            <i className="bi bi-search" />
          </span>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-3 cmb-20">
          {/*{
             isLoading ? (
            <div className="cpt-20 cpb-20">
              <Loader size="md" />
            </div>
          ) :  */}
          {postCategoryList?.length === 0 ? (
            <div>No Data Found</div>
          ) : (
            postCategoryList?.slice(0, 5)?.map((el, index) => {
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
                  }}
                >
                  {el?.name}
                </span>
              );
            })
          )}
        </div>
        <div className="text-15-400 color-new-car hover-effect pointer text-decoration-underline">
          <span onClick={() => setResearchMore(true)}>Explore More</span>
          <span className="ms-1">
            <i className="bi bi-arrow-right" />
          </span>
        </div>
      </div>
      {researchMore && (
        <ExploreCategoryPopup
          type="1"
          show={researchMore}
          categories={postCategoryList}
          handleRedirect={handleRedirect}
          onHide={() => {
            setResearchMore(false);
          }}
        />
      )}
    </div>
  );
};

export default DigitalLibraryHeaderBlock;
