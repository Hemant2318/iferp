import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { omit } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import ExportButton from "components/Layout/ExportButton";
import { fetchJournalResourceReviewers } from "store/slices";
import { limit } from "utils/constants";
import AllocateProject from "./AllocateProject";

const Reviewers = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    email_id: "",
    member_id: "",
    phone_number: "",
  });
  const [filterData, setFilterData] = useState({
    limit: limit,
    offset: 0,
    total: 0,
  });
  const getReviewer = async (obj) => {
    let queryParams = new URLSearchParams(omit(obj, ["total"])).toString();
    const response = await dispatch(fetchJournalResourceReviewers(queryParams));
    setTableList(response?.data?.reviewers || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getReviewer(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getReviewer(newData);
  };
  useEffect(() => {
    getReviewer({ ...filterData, ...searchPayload });
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
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "email_id",
      title: "Email ID",
    },
    {
      isSearch: true,
      searchInputName: "phone_number",
      title: "Phone Number",
    },
    {
      isSearch: false,
      searchLable: "View/Allocate",
      title: "Action",
    },
  ];
  const rowData = [];

  tableList.forEach((elem) => {
    const { name, member_id, email_id, phone_number, is_already_allocated } =
      elem;
    let obj = [
      {
        value: name,
      },
      {
        value: member_id,
      },
      {
        value: email_id,
      },
      {
        value: phone_number,
      },
      {
        value: is_already_allocated ? (
          <span className="action-icon-buttons">
            <Button
              btnStyle="primary-light"
              text="View"
              className="h-35 mw-80 text-14-500"
              onClick={() => {
                navigate(
                  `/${params?.memberType}/journal-management/reviewers/${elem.id}`
                );
              }}
              isSquare
            />
          </span>
        ) : (
          <div className="center-flex">
            <Button
              btnStyle="primary-dark"
              text="Allocate"
              className="h-35 text-14-500"
              onClick={() => {
                setEditData(elem);
              }}
              isSquare
            />
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  return (
    <>
      {editData && (
        <AllocateProject
          editData={editData}
          onHide={() => {
            setEditData(null);
          }}
          handelSuccess={() => {
            getReviewer({ ...filterData, ...searchPayload });
            setEditData(null);
          }}
        />
      )}
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="text-18-500 color-black-olive">Reviewers</div>
          <div className="d-flex">
            <ExportButton
              exportAPI={fetchJournalResourceReviewers}
              payload="export_status=1"
            />
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
    </>
  );
};
export default Reviewers;
