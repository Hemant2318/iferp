import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "components/Layout/Table";
import Button from "components/form/Button";
import Card from "components/Layout/Card";
import ExportButton from "components/Layout/ExportButton";
import {
  downloadFile,
  generatePreSignedUrl,
  objectToFormData,
  titleCaseString,
} from "utils/helpers";
import { certificatePath, limit } from "utils/constants";
import {
  exportEventsCertificate,
  fetchEventsRegisteredMembers,
} from "store/slices";

const CertificatesAndRewardsList = () => {
  const dispatch = useDispatch();
  const { membershipList } = useSelector((state) => ({
    membershipList: state.global.membershipList,
  }));
  const [tableList, setTableList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    event_type: "",
    event_name: "",
    membership_id_or_type: "",
    participatedAs: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
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
  const getProfiles = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchEventsRegisteredMembers(forData));
    setTableList(response?.data?.registeredMembers || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setIsLoading(false);
  };
  useEffect(() => {
    getProfiles({ ...filterData, ...searchPayload });
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
      title: (
        <>
          <div>{"Membership ID"}</div>
          <div>{"& Type"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "event_name",
      title: "Event Name",
    },
    {
      isSearch: true,
      title: "Participated As",
      isSearchDropdown: true,
      dropdownOptions: {
        options: [{ value: "Listener" }, { value: "Presenter" }],
        key: "value",
        value: "value",
      },
      searchInputName: "participatedAs",
    },

    {
      isSearch: false,
      searchLable: "Certificate",
      title: "Action",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: `${elem?.firstName} ${elem?.lastName}`,
      },
      {
        value: (
          <span>
            <div>{elem?.memberId}</div>
            <div>{elem?.memberType}</div>
          </span>
        ),
      },
      {
        value: elem?.eventName,
      },
      {
        value: titleCaseString(elem.participatedAs),
      },
      {
        value: (
          <div className="center-flex">
            {elem.certificates.length > 0 ? (
              <Button
                btnStyle="primary-outline"
                text="Download"
                className="h-35 text-14-500"
                onClick={async () => {
                  let result = await generatePreSignedUrl(
                    elem.certificates[0].certificate,
                    certificatePath
                  );
                  dispatch(downloadFile(result));
                }}
                isSquare
              />
            ) : (
              <div className="text-14-400 color-black-olive">Pending</div>
            )}
          </div>
        ),
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <Card className="cps-34 cpe-34 cpb-20 cpt-26">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="table-title">Certificates & Rewards</div>
        <div className="d-flex">
          {tableList.length > 0 && (
            <ExportButton
              exportAPI={exportEventsCertificate}
              payload={objectToFormData({ type: 2 })}
            />
          )}
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
export default CertificatesAndRewardsList;
