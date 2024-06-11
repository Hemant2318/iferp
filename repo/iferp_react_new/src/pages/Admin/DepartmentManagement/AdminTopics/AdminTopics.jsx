import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import React, { useEffect, useState } from "react";
import { icons, limit } from "utils/constants";
import { objectToFormData, titleCaseString } from "utils/helpers";
import AddTopicsForm from "./AddTopicsForm";
import BulkUpload from "./BulkUpload";
import { useDispatch } from "react-redux";
import {
  commonFunctionalityTopic,
  getAllDepartments,
  getAllTopicsList,
} from "store/slices";
import { omit } from "lodash";
import { useParams } from "react-router-dom";
import DeleteDepartmentTopicPopup from "components/Layout/DeleteDepartmentTopicPopup";

const AdminTopics = ({ topcList, handleGetList }) => {
  const params = useParams();
  const { type } = params;
  const dispatch = useDispatch();

  const [isAddTopic, setIsAddTopic] = useState(false);
  const [isTopicMap, setIsTopicMap] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
    unAssign: type === "unassign-topics" ? "unAssign" : "",
  });
  const [searchPayload, setSearchPayload] = useState({
    d_search: "",
    t_search: "",
  });
  const [data, setData] = useState({
    list: [],
    isLoading: true,
  });

  const fetchAllTopics = async (obj) => {
    setIsLoading(true);
    const response = await dispatch(getAllTopicsList(objectToFormData(obj)));
    setTopicList(response?.data?.allTopicList || []);
    setFilterData({
      ...obj,
      total: response?.data?.count || 0,
    });
    setIsLoading(false);
  };

  const fetchAllDepartments = async (data) => {
    const payload = omit(data, ["isLoading", "list"]);
    const response = await dispatch(
      getAllDepartments(objectToFormData(payload))
    );

    setData((prev) => {
      return {
        ...prev,
        list: response?.data?.data || [],
        isLoading: false,
      };
    });
  };

  const handleSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    fetchAllTopics(newData);
  };

  const handlePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    fetchAllTopics(newData);
  };

  const handleDownloadFile = () => {
    const sampleFileUrl = "/Topic_Sample_Sheet.xlsx";
    const anchor = document.createElement("a");
    anchor.href = sampleFileUrl;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  useEffect(() => {
    fetchAllDepartments();
    fetchAllTopics({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let header = [
    {
      isSearch: true,
      searchInputName: "d_search",
      title: "Department Name",
    },
    {
      isSearch: true,
      searchInputName: "t_search",
      title: "Topic Name",
    },
    {
      isSearch: false,
      searchLable: type === "unassign-topics" ? "Edit" : "Map/Edit",
      title: "Action",
    },
  ];
  if (type === "unassign-topics") {
    header?.shift();
  }

  const rowData = [];
  topicList?.forEach((elem) => {
    const { department_name, topics } = elem;
    topics?.forEach((t) => {
      const { topics: topic_name } = t;
      let obj = [
        {
          value: (
            <div className="text-start">{titleCaseString(department_name)}</div>
          ),
        },
        {
          value: (
            <div className="text-start">{titleCaseString(topic_name)}</div>
          ),
        },
        {
          value: (
            <div className="d-flex justify-content-center gap-2">
              {type !== "unassign-topics" && (
                <span>
                  <Button
                    btnStyle="primary-dark"
                    text="Map"
                    className="h-auto pt-1 pb-1 text-12-500"
                    isSquare
                    onClick={() => {
                      setIsTopicMap(t);
                    }}
                  />
                </span>
              )}

              <span className="action-icon-buttons ">
                <Button
                  btnStyle="light-outline"
                  icon={<img src={icons.edit} alt="edit" />}
                  isSquare
                  onClick={() => {
                    setEditData(t);
                    setIsAddTopic(true);
                  }}
                />
              </span>
            </div>
          ),
        },
      ];
      if (type === "unassign-topics") {
        obj?.shift();
      }

      rowData.push({ data: obj });
    });
  });

  return (
    <div className="admin-topics-container">
      {isBulkUploading && (
        <BulkUpload
          onHide={() => {
            setIsBulkUploading(false);
          }}
          handleSuccess={() => {
            setIsBulkUploading(false);
            fetchAllTopics();
            handleGetList();
          }}
        />
      )}
      {isTopicMap && (
        <DeleteDepartmentTopicPopup
          onHide={() => {
            setIsTopicMap(null);
          }}
          data={isTopicMap}
          message={`Are you sure you want to mapping this ${titleCaseString(
            isTopicMap?.topics
          )}?`}
          list={topcList}
          handelSuccess={() => {
            setIsTopicMap(false);
            fetchAllTopics({ ...filterData, ...searchPayload });
            handleGetList();
          }}
          handelDelete={async (data) => {
            const response = await dispatch(
              commonFunctionalityTopic(
                objectToFormData({
                  topic_id: isTopicMap?.id,
                  assign_topic_id: data?.id,
                })
              )
            );
            return response;
          }}
        />
      )}
      {isAddTopic && (
        <AddTopicsForm
          onHide={() => {
            setIsAddTopic(false);
            setEditData(null);
          }}
          handleSuccess={() => {
            setIsAddTopic(false);
            fetchAllTopics({ ...filterData, ...searchPayload });
            setEditData(null);
            handleGetList();
          }}
          editData={editData}
          list={data?.list}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 cpt-28 cpb-28">
          <div className="table-title">
            {type === "unassign-topics" ? "Unassign Topics" : "All Topics"}
          </div>

          {type !== "unassign-topics" && (
            <div className="d-flex gap-2">
              <Button
                text="+ Add New Topic"
                btnStyle="primary-outline"
                className="h-35 text-14-500"
                isSquare
                onClick={() => {
                  setIsAddTopic(true);
                }}
              />
              <Button
                text="Bulk Uploading"
                btnStyle="primary-outline"
                className="h-35 text-14-500 gap-2 align-items-center"
                isSquare
                icon={<img src={icons.uploadPrimary} alt="upload" />}
                onClick={() => {
                  setIsBulkUploading(true);
                }}
              />
              <Button
                text="Sample File"
                btnStyle="primary-outline"
                className="h-35 text-14-500 gap-2 align-items-center"
                isSquare
                icon={<img src={icons.downloadPrimary} alt="download" />}
                onClick={handleDownloadFile}
              />
            </div>
          )}
        </div>
      </Card>
      <Table
        header={header}
        rowData={rowData}
        isLoading={isLoading}
        filterData={filterData}
        searchPayload={searchPayload}
        changeOffset={handlePagination}
        searchInputChange={handleSearch}
      />
    </div>
  );
};

export default AdminTopics;
