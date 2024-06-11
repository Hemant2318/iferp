import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import FilterDropdown from "components/Layout/FilterDropdown";
import DeletePopup from "components/Layout/DeletePopup";
import {
  combineArrayS3,
  getDataFromLocalStorage,
  objectToFormData,
} from "utils/helpers";
import { deletePost, fetchAllPosts } from "store/slices";
import { limit, networkPath } from "utils/constants";
import ViewPost from "./ViewPost";
import FilePreview from "components/Layout/FilePreview";
import { useNavigate } from "react-router-dom";

const NetworkList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [viewData, setViewData] = useState(null);
  const [postID, setPostID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPayload, setSearchPayload] = useState({});
  const [tableList, setTableList] = useState([]);
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    membership_plan_ids: "",
  });

  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getPostList(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getPostList(newData);
  };
  const handelChangeFilter = (val) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, membership_plan_ids: val, offset: 0 };
    setFilterData(newData);
    getPostList(newData);
  };
  const getPostList = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchAllPosts(forData));
    const newList = await combineArrayS3(
      response?.data?.posts,
      "post",
      networkPath
    );
    setTableList(newList || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (["0"].includes(getDataFromLocalStorage("user_type"))) {
      getPostList({ ...filterData, ...searchPayload });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Name",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: { options: membershipList, key: "name", value: "name" },
      searchInputName: "membership_id_or_type",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "title",
      title: "Post Description",
    },
    {
      isSearch: false,
      title: "Post",
    },
    {
      isSearch: false,
      title: "Post Date & Time",
    },
    {
      isSearch: false,
      searchLable: "View/Delete",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    const { id, name, member_id_type, title, post, created_date, s3File } =
      elem;
    const postType = post ? post?.split(".")?.pop() : "";
    let obj = [
      {
        value: name,
      },
      {
        value: member_id_type,
      },
      {
        value: title,
      },
      {
        value: (
          <div>
            {post ? (
              <>
                {["pdf", "doc", "docx", "csv", "html"].includes(postType) ? (
                  <FilePreview url={`http://${post}`} />
                ) : (
                  <div style={{ height: "103px" }}>
                    <img src={s3File} alt="post" className="fit-image fill" />
                  </div>
                )}
              </>
            ) : (
              "-"
            )}
          </div>
        ),
      },
      {
        value: created_date,
      },
      {
        value: (
          <span>
            <div>
              <Button
                isSquare
                text="View"
                btnStyle="primary-light"
                className="h-35"
                onClick={() => {
                  setViewData(elem);
                }}
              />
            </div>
            <div className="mt-2">
              <Button
                isSquare
                text="Delete"
                btnStyle="primary-gray"
                className="h-35"
                onClick={() => {
                  setPostID(id);
                }}
              />
            </div>
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <Card className="cps-20 cpe-20 cpb-20">
      {viewData && (
        <ViewPost
          onHide={() => {
            setViewData(null);
          }}
          data={viewData}
        />
      )}

      {postID && (
        <DeletePopup
          title="Delete Post"
          message="Are you sure you want to delete this post?"
          id={postID}
          onHide={() => {
            setPostID(null);
          }}
          handelSuccess={() => {
            getPostList({ ...filterData, ...searchPayload });
            setPostID(null);
          }}
          handelDelete={async () => {
            let forData = objectToFormData({ post_id: postID, key: "delete" });
            const response = await dispatch(deletePost(forData));
            return response;
          }}
        />
      )}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 cpt-28 cpb-28">
        <div className="table-title text-nowrap">
          All Posts ({filterData?.total})
        </div>
        <div className="d-flex">
          <ExportButton
            exportAPI={fetchAllPosts}
            payload={objectToFormData({ export_status: 1 })}
          />
          <div className="d-flex ms-3">
            <FilterDropdown
              list={membershipList}
              handelChangeFilter={handelChangeFilter}
            />
          </div>
        </div>
      </div>
      <Table
        isLoading={isLoading}
        header={header}
        rowData={rowData}
        filterData={filterData}
        searchPayload={searchPayload}
        searchInputChange={handelChangeSearch}
        changeOffset={handelChangePagination}
      />
    </Card>
  );
};
export default NetworkList;
