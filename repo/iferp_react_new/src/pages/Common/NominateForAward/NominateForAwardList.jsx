import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import ExportButton from "components/Layout/ExportButton";
import { limit } from "utils/constants";
import { objectToFormData } from "utils/helpers";
import { exportNomination, fetchNomination } from "store/slices";

const NominateForAwardList = () => {
  const dispatch = useDispatch();
  const [tableLoader, setTableLoader] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [searchPayload, setSearchPayload] = useState({
    name: "",
    status: "",
    member_id: "",
    award_category: "",
  });
  const [filterData, setFilterData] = useState({
    total: 0,
    offset: 0,
    limit: limit,
  });
  const getNominations = async (obj) => {
    let forData = objectToFormData(obj);
    const response = await dispatch(fetchNomination(forData));
    setTableList(response?.data?.awardWinners || []);
    setFilterData({
      ...obj,
      total: response?.data?.result_count || 0,
    });
    setTableLoader(false);
  };
  const handelChangeSearch = (searchData) => {
    setTableLoader(true);
    let newData = filterData;
    setSearchPayload(searchData);
    newData = { ...newData, ...searchData, offset: 0 };
    setFilterData(newData);
    getNominations(newData);
  };
  const handelChangePagination = (offset) => {
    setTableLoader(true);
    let newData = { ...filterData, ...searchPayload };
    newData = { ...newData, offset: offset };
    setFilterData(newData);
    getNominations(newData);
  };

  useEffect(() => {
    getNominations({ ...filterData, ...searchPayload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: (
        <>
          <div>{"Nominator’s"}</div>
          <div>{"Name"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: (
        <>
          <div>{"Nominator’s"}</div>
          <div>{"Member ID"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "name",
      title: (
        <>
          <div>{"Nominee’s"}</div>
          <div>{"Name"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "member_id",
      title: (
        <>
          <div>{"Nominee’s"}</div>
          <div>{"Member ID"}</div>
        </>
      ),
    },
    {
      isSearch: true,
      searchInputName: "award_category",
      title: "Award Category",
    },
  ];

  const rowData = [];
  tableList.forEach((elem) => {
    let obj = [
      {
        value: elem.nominationsName,
      },
      {
        value: elem.memberId,
      },
      {
        value: elem.nominationsName,
      },
      {
        value: elem.memberId,
      },
      {
        value: elem.awardType,
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <div>
      <Card className="cps-20 cpe-20 cpb-20">
        <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
          <div className="table-title">Nomination Details</div>
          <div className="d-flex">
            <ExportButton exportAPI={exportNomination} />
          </div>
        </div>
        <Table
          isLoading={tableLoader}
          header={header}
          rowData={rowData}
          filterData={filterData}
          searchPayload={searchPayload}
          searchInputChange={handelChangeSearch}
          changeOffset={handelChangePagination}
        />
      </Card>
    </div>
  );
};
export default NominateForAwardList;
