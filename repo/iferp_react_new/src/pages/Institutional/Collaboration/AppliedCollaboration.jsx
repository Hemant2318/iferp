import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Dropdown from "components/form/Dropdown";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import { getAppliedCollaboration } from "store/slices";
import { getStatus, objectToFormData } from "utils/helpers";

const AppliedCollaboration = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const [filterType, setFilterType] = useState("conference");

  const getCollaboration = async () => {
    let forData = objectToFormData({
      type: filterType,
    });
    const response = await dispatch(getAppliedCollaboration(forData));
    setTableList(response?.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getCollaboration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const header = [
    {
      title: "Event Name",
    },
    {
      title: "Member ID",
    },
    {
      title: "Member Type",
    },
    {
      title: "Status",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    const { event_name, user_details } = elem;
    const { member_id, membership_type } = user_details || {};

    let obj = [
      {
        value: event_name,
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
    ];
    rowData.push({ data: obj });
  });
  return (
    <>
      <div>
        <Card className="cps-20 cpt-30 cpe-20 cpb-20">
          <div className="d-flex col-4 col-sm-3 mb-3">
            <Dropdown
              options={[
                { id: "conference", label: "Conference" },
                { id: "publication", label: "Publication" },
              ]}
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
              }}
            />
          </div>
          <Table isLoading={isLoading} header={header} rowData={rowData} />
        </Card>
      </div>
    </>
  );
};
export default AppliedCollaboration;
