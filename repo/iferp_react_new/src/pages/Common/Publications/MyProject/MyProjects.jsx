import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/Layout/Card";
import Table from "components/Layout/Table";
import Loader from "components/Layout/Loader";
import ExploreLayout from "components/Layout/ExploreLayout";
import { fetchMyReviewersJournal } from "store/slices";

const MyProjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { memberType } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [tableList, setTableList] = useState([]);
  const handleRedirect = (paperId) => {
    navigate(`/${memberType}/publications/submitted-papers/${paperId}`);
  };
  const getMyTask = async () => {
    const response = await dispatch(fetchMyReviewersJournal());
    setTableList(response?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getMyTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = [
    {
      title: "Journal Name",
    },
    {
      title: "Paper ID & Paper Title",
    },
  ];
  const rowData = [];
  tableList.forEach((elem) => {
    const { journal_name, journal_paper_id, paper_id, paper_title } = elem;
    let obj = [
      {
        value: journal_name,
      },
      {
        value: (
          <span
            onClick={() => {
              handleRedirect(journal_paper_id);
            }}
            className="pointer"
          >
            <span className="color-new-car">{paper_id}</span>
            {" - "}
            <span>{paper_title}</span>
          </span>
        ),
      },
    ];
    rowData.push({ data: obj });
  });

  return (
    <Card className="cps-20 cpe-20 cpb-20">
      {isLoading ? (
        <div>
          <Loader size="md" />
        </div>
      ) : tableList.length === 0 ? (
        <ExploreLayout
          redirect={`/${memberType}/career-support/careers`}
          info="You haven’t Enrolled any Career Support Categories."
        />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center cpt-28 cpb-28">
            <div className="text-18-400 color-black-olive">Submitted Paper</div>
          </div>
          <Table header={header} rowData={rowData} isLoading={isLoading} />
        </>
      )}
    </Card>
  );
};
export default MyProjects;
