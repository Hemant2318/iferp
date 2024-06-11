import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import DeletePopup from "components/Layout/DeletePopup";
import ExportButton from "components/Layout/ExportButton";
import Table from "components/Layout/Table";
import { icons, limit } from "utils/constants";
import { getStatus, objectToFormData } from "utils/helpers";
import {
  deleteCollaboration,
  fetchAllCollaboration,
  updateCollaboration,
} from "store/slices";
import CollaborationForm from "./CollaborationForm";

const Collaboration = () => {
  const dispatch = useDispatch();
  const [type, setType] = useState("conference-collaboration");

  const [deleteID, setDeleteID] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    status: "",
    member_id: "",
    member_type: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getCollaboration = async (obj) => {
    let forData = objectToFormData({
      ...obj,
      type: type.replace("-collaboration", ""),
    });
    const response = await dispatch(fetchAllCollaboration(forData));
    setTableList(response?.data?.result || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  const handelUpdateStatus = async (id, status) => {
    setIsEditLoading(id);
    let forData = objectToFormData({
      id: id,
      type: type.replace("-collaboration", ""),
      status: status,
    });
    const response = await dispatch(updateCollaboration(forData));
    if (response?.status === 200) {
      let oldData = tableList.map((elem) => {
        if (elem.id === id) {
          elem.status = status;
        }
        return elem;
      });
      setTableList(oldData);
    }
    setIsEditLoading("");
    return response;
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getCollaboration(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getCollaboration(newData);
  };
  useEffect(() => {
    setIsLoading(true);
    getCollaboration({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Institution’s Name",
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "member_Type",
      title: "Member Type",
    },
    {
      isSearch: true,
      searchInputName: "status",
      title: "Status",
    },
    {
      isSearch: false,
      searchLable: "Edit/Delete",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    const { user_details } = elem;
    const { name, member_id, membership_type } = user_details || {};
    let obj = [
      {
        value: name,
      },
      {
        value: member_id,
      },
      {
        value: membership_type,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value:
          elem.status !== "0" ? (
            <span className="action-icon-buttons gap-2">
              {/* <Button
                btnStyle="primary-light"
                text="View"
                className="h-35 mw-80 text-14-500"
                onClick={() => {}}
                isSquare
              /> */}
              <Button
                isSquare
                btnStyle="light-outline"
                icon={<img src={icons.edit} alt="edit" />}
                onClick={() => {
                  setEditData(elem);
                }}
              />
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.deleteIcon} alt="delete" />}
                onClick={() => {
                  setDeleteID(elem.id);
                }}
                isSquare
              />
            </span>
          ) : (
            <span className="action-icon-buttons gap-2">
              <Button
                isSquare
                btnStyle="primary-dark"
                text={isEditLoading === elem.id ? "" : "Accept"}
                className="h-35 mw-80 text-14-500"
                btnLoading={isEditLoading === elem.id}
                onClick={() => {
                  handelUpdateStatus(elem.id, "1");
                }}
              />
              {/* <Button
                btnStyle="primary-light"
                text="View"
                className="h-35 mw-80 text-14-500"
                onClick={() => {
                  // navigate(
                  //   `/${params?.memberType}/event-management/reviewers/${elem.id}`
                  // );
                }}
                isSquare
              /> */}
            </span>
          ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <>
      {deleteID && (
        <DeletePopup
          id={deleteID}
          onHide={() => {
            setDeleteID(null);
          }}
          handelSuccess={() => {
            setDeleteID(null);
            getCollaboration({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            let forData = objectToFormData({
              id: deleteID,
              type: type.replace("-collaboration", ""),
            });
            const response = await dispatch(deleteCollaboration(forData));
            return response;
          }}
        />
      )}
      {editData && (
        <CollaborationForm
          onHide={() => {
            setEditData(null);
          }}
          editData={editData}
          handelUpdateStatus={handelUpdateStatus}
        />
      )}
      <div className="d-flex justify-content-between align-items-center">
        <Tabs
          defaultActiveKey={type}
          id="uncontrolled-tab-example"
          className="cmb-30 mt-2 gap-4"
        >
          <Tab
            eventKey="conference-collaboration"
            title="Conference Collaboration"
            onEnter={() => {
              setType("conference-collaboration");
            }}
          />
          <Tab
            eventKey="publication-collaboration"
            title="Publication Collaboration"
            onEnter={() => {
              setType("publication-collaboration");
            }}
          />
        </Tabs>
        <ExportButton
          exportAPI={fetchAllCollaboration}
          payload={objectToFormData({
            export_status: 1,
            type: type.replace("-collaboration", ""),
          })}
        />
      </div>
      <div>
        <Card className="cps-20 cpe-20 cpb-20">
          <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
            <div className="table-title">
              Institutions ({filterData?.total || 0})
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
      </div>
    </>
  );
};
export default Collaboration;
