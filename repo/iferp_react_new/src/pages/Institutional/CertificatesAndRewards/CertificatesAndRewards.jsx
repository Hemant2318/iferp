import Button from "components/form/Button";
import Table from "components/Layout/Table";
import Card from "components/Layout/Card";
import ExportButton from "components/Layout/ExportButton";
import FilterDropdown from "components/Layout/FilterDropdown";

const CertificatesAndRewards = () => {
  const list = [
    {
      id: 1,
      firstName: "Vaishu",
      lastName: "Verma",
      member_id: "26576",
      title:
        "Optimization of Energy in Ohmic heating Based Instant Rice Preparation",
      dept: "CSE",
    },
    {
      id: 2,
      firstName: "Bhagyashri",
      lastName: "Patel",
      member_id: "26576",
      title:
        "Towards enhancing educational skills for speech and hearing impaired in India",
      dept: "ECE",
    },
    {
      id: 3,
      firstName: "Kesshika",
      lastName: "Doe",
      member_id: "26576",
      title:
        "Non-biodegradable Material Recycling Unit for Innoli, Pavoor and Gramachavadi villages in Mangalore - Design and Development",
      dept: "CSE",
    },
  ];
  const header = [
    {
      isSearch: true,
      searchInputName: "name",
      title: "Name",
    },
    {
      isSearch: true,
      searchInputName: "membership_id",
      title: "Member ID",
    },
    {
      isSearch: true,
      searchInputName: "department",
      title: "Department",
    },
    {
      isSearch: true,
      searchInputName: "title",
      title: "Event Details",
    },
    {
      isSearch: false,
      searchLable: "Certificate",
      title: "Action",
    },
  ];
  const rowData = [];
  list.forEach((elem) => {
    let obj = [
      {
        value: `${elem.firstName} ${elem.lastName}`,
      },
      {
        value: elem.member_id,
      },
      {
        value: elem.dept,
      },
      {
        value: elem.title,
      },
      {
        value: (
          <div className="center-flex">
            <Button
              btnStyle="primary-outline"
              text="Download"
              className="h-35 text-14-500"
              onClick={() => {}}
              isSquare
            />
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
        <div className="d-flex gap-3">
          <div>
            <ExportButton />
          </div>
          <div>
            <FilterDropdown
              label="2022"
              list={[]}
              handelChangeFilter={() => {}}
              isHideAll
            />
          </div>
          <div className="d-flex">
            <FilterDropdown list={[]} handelChangeFilter={() => {}} isHideAll />
          </div>
        </div>
      </div>
      <Table header={header} rowData={rowData} />
    </Card>
  );
};
export default CertificatesAndRewards;
