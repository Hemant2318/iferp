import { useNavigate, useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Chapters from "./Chapters";
import Group from "./Group";
import "./ChaptersAndGroups.scss";

const ChaptersAndGroups = () => {
  const params = useParams();
  const navigate = useNavigate();
  const handleRedirect = (type) => {
    navigate(`/${params.memberType}/chapters-groups/${type}`);
  };

  return (
    <div id="chapters-and-groups-container">
      <Tabs
        defaultActiveKey={params?.type}
        id="uncontrolled-tab-example"
        className="mb-3 gap-4"
      >
        <Tab
          eventKey="chapters"
          title={<span id="chapters-id">Chapters</span>}
          onEnter={() => {
            handleRedirect("chapters");
          }}
        >
          {params?.type === "chapters" && <Chapters />}
        </Tab>
        <Tab
          eventKey="sig-groups"
          title={
            <span id="SIG-groups-id">Special Interest Community(SIC)</span>
          }
          onEnter={() => {
            handleRedirect("sig-groups");
          }}
        >
          {params?.type === "sig-groups" && <Group />}
        </Tab>
      </Tabs>
    </div>
  );
};
export default ChaptersAndGroups;
