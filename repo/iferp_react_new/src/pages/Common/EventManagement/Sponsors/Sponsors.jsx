import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "components/Layout/Card";
import Button from "components/form/Button";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import DeletePopup from "components/Layout/DeletePopup";
import { icons, limit } from "utils/constants";
import { getStatus, objectToFormData } from "utils/helpers";
import { getSponsors, editSponsors, deleteSponsors } from "store/slices";
import SponsorsForm from "./SponsorsForm";
import SponsorsDetails from "./SponsorsDetails";

const Sponsors = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState("");
  const [userid, setUserid] = useState(null);
  const [sponsorId, setSponsorId] = useState("");
  const [editData, setEditData] = useState(null);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    organization_name: "",
    event_name: "",
    member_id: "",
    status: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(getSponsors(forData));
    setTableList(response?.data?.sponsor_details || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || [],
    });
    setIsLoading(false);
  };
  const handelChangeSearch = (searchData) => {
    setIsLoading(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getProfiles(newData);
  };
  const handelChangePagination = (offset) => {
    setIsLoading(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getProfiles(newData);
  };
  useEffect(() => {
    setIsLoading(true);
    getProfiles({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsorId]);
  const header = [
    {
      isSearch: true,
      searchInputName: "organization_name",
      title: "Organization Name",
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "event_name",
      title: "Event Name",
    },
    {
      isSearch: true,
      isSearchDropdown: true,
      dropdownOptions: {
        options: [
          { id: "0", name: "Pending" },
          { id: "1", name: "Accepted" },
          { id: "2", name: "Rejected" },
        ],
        key: "id",
        value: "name",
      },
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
    let obj = [
      {
        value: elem.organization_name,
      },
      {
        value: elem.member_id,
      },
      {
        value: elem.event_name,
      },
      {
        value: getStatus(elem.status),
      },
      {
        value:
          elem.status === "0" ? (
            <span className="action-icon-buttons">
              <Button
                onClick={async () => {
                  setBtnLoading(elem.id);
                  let forData = objectToFormData({
                    status: "1",
                    id: elem.id,
                  });
                  const response = await dispatch(editSponsors(forData));
                  if (response?.status === 200) {
                    getProfiles({ ...filterData, ...searchPayload });
                  }
                  setBtnLoading("");
                }}
                text={elem.id === btnLoading ? "" : "Accept"}
                btnLoading={elem.id === btnLoading}
                btnStyle="primary-dark"
                className="text-14-500 mw-70 me-2"
                isSquare
              />
              <Button
                onClick={() => {
                  setSponsorId(elem.id);
                }}
                text="View"
                btnStyle="primary-light"
                className="text-14-500 mw-70 me-2"
                isSquare
              />
            </span>
          ) : (
            <span className="action-icon-buttons">
              <Button
                onClick={() => {
                  setSponsorId(elem.id);
                }}
                text="View"
                btnStyle="primary-light"
                className="text-14-500 mw-70 me-2"
                isSquare
              />
              <Button
                isSquare
                btnStyle="light-outline"
                icon={<img src={icons.edit} alt="edit" />}
                className="me-2"
                onClick={() => {
                  setEditData(elem);
                }}
              />
              <Button
                btnStyle="light-outline"
                icon={<img src={icons.deleteIcon} alt="delete" />}
                onClick={() => {
                  setUserid(elem.id);
                }}
                isSquare
              />
            </span>
          ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div id="career-management-container">
      {userid && (
        <DeletePopup
          id={userid}
          onHide={() => {
            setUserid(null);
          }}
          handelSuccess={() => {
            setUserid(null);
            getProfiles({ ...filterData, ...searchPayload });
          }}
          handelDelete={async () => {
            const response = await dispatch(deleteSponsors(userid));
            return response;
          }}
        />
      )}
      {sponsorId ? (
        <SponsorsDetails id={sponsorId} setSponsorId={setSponsorId} />
      ) : (
        <Card className="cps-20 cpe-20 cpb-20 cpt-20">
          {editData && (
            <SponsorsForm
              onHide={() => {
                setEditData(null);
              }}
              handelSuccess={() => {
                setEditData(null);
                getProfiles({ ...filterData, ...searchPayload });
              }}
              editData={editData}
            />
          )}
          <div className="cpt-12 cpb-12 d-flex align-items-center justify-content-between cmb-12">
            <div className="table-title">Sponsors</div>
            <ExportButton
              exportAPI={getSponsors}
              payload={objectToFormData({ export_status: "1" })}
            />
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
      )}
    </div>
  );
};
export default Sponsors;
