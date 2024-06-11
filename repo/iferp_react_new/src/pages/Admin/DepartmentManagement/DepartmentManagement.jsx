import Card from "components/Layout/Card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminDepartments from "./AdminDepartments";
import AdminTopics from "./AdminTopics";
import { useDispatch } from "react-redux";
import { getAllDepartments, getAllTopicsList } from "store/slices";

const dummyData = [
  {
    id: 1,
    dName: "department 1",
    topics: [
      { tName: "topic 1" },
      { tName: "topic 2" },
      { tName: "topic 3" },
      { tName: "topic 4" },
      { tName: "topic 5" },
    ],
  },
  {
    id: 2,
    dName: "department 2",
    topics: [{ tName: "topic 1" }, { tName: "topic 2" }],
  },
  {
    id: 3,
    dName: "department 3",
    topics: [{ tName: "topic 1" }, { tName: "topic 2" }, { tName: "topic 3" }],
  },
  {
    id: 4,
    dName: "department 4",
    topics: [{ tName: "topic 1" }],
  },
  {
    id: 5,
    dName: "department 5",
    topics: [
      { tName: "topic 1" },
      { tName: "topic 2" },
      { tName: "topic 3" },
      { tName: "topic 4" },
    ],
  },
  {
    id: 6,
    dName: "department 6",
    topics: [{ tName: "topic 1" }, { tName: "topic 2" }],
  },
  {
    id: 7,
    dName: "department 7",
    topics: [
      { tName: "topic 1" },
      { tName: "topic 2" },
      { tName: "topic 3" },
      { tName: "topic 4" },
      { tName: "topic 5" },
      { tName: "topic 6" },
      { tName: "topic 7" },
      { tName: "topic 8" },
    ],
  },
  {
    id: 8,
    dName: "department 8",
    topics: [
      { tName: "topic 1" },
      { tName: "topic 2" },
      { tName: "topic 3" },
      { tName: "topic 4" },
      { tName: "topic 5" },
      { tName: "topic 6" },
      { tName: "topic 7" },
    ],
  },
  {
    id: 9,
    dName: "department 9",
    topics: [
      { tName: "topic 1" },
      { tName: "topic 2" },
      { tName: "topic 3" },
      { tName: "topic 4" },
      { tName: "topic 5" },
      { tName: "topic 6" },
    ],
  },
  {
    id: 10,
    dName: "department 10",
    topics: [
      { tName: "topic 1" },
      { tName: "topic 2" },
      { tName: "topic 3" },
      { tName: "topic 4" },
      { tName: "topic 5" },
      { tName: "topic 6" },
      { tName: "topic 7" },
      { tName: "topic 8" },
      { tName: "topic 9" },
      { tName: "topic 10" },
    ],
  },
];

const DepartmentManagement = () => {
  const params = useParams();
  const { type } = params;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [departmentList, setDepartmentList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const activeClass = "p-2 bg-new-car color-white text-15-500";
  const inActiveClass = "p-2 color-dark-blue text-15-500 pointer";

  const fetchAllDepartments = async () => {
    const response = await dispatch(getAllDepartments());
    setDepartmentList(response?.data?.data || []);
  };

  const fetchAllTopics = async (obj) => {
    const response = await dispatch(getAllTopicsList());
    let newList = [];
    if (response?.data?.allTopicList) {
      response?.data?.allTopicList?.forEach((elem) => {
        elem?.topics?.forEach((data) => {
          newList.push(data);
        });
      });
    }
    setTopicList(newList || []);
  };

  useEffect(() => {
    fetchAllDepartments();
    fetchAllTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Card className="d-flex align-items-center justify-content-between p-1 unset-br mb-3 flex-wrap">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <div
            className={type === "departments" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/admin/department-management/departments`);
            }}
          >
            Departments
          </div>
          <div
            className={type === "topics" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/admin/department-management/topics`);
            }}
          >
            Topics
          </div>
          <div
            className={type === "unassign-topics" ? activeClass : inActiveClass}
            onClick={() => {
              navigate(`/admin/department-management/unassign-topics`);
            }}
          >
            Unassign Topics
          </div>
        </div>
      </Card>
      {type === "departments" && (
        <AdminDepartments
          dummyData={dummyData}
          depList={departmentList}
          handleGetList={fetchAllDepartments}
        />
      )}
      {type === "topics" && (
        <AdminTopics
          dummyData={dummyData}
          topcList={topicList}
          handleGetList={fetchAllTopics}
        />
      )}
      {type === "unassign-topics" && (
        <AdminTopics
          dummyData={dummyData}
          type="unassign-topics"
          topcList={topicList}
          handleGetList={fetchAllTopics}
        />
      )}
    </div>
  );
};

export default DepartmentManagement;
