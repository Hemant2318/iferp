import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CollaborationForm from "./CollaborationForm";
import AppliedCollaboration from "./AppliedCollaboration";

const Collaboration = () => {
  const [type, setType] = useState("conference-collaboration");
  return (
    <>
      <Tabs
        defaultActiveKey={type}
        id="uncontrolled-tab-example"
        className="cmb-40 gap-4"
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
        <Tab
          eventKey="applied-collaboration"
          title="Applied Collaboration"
          onEnter={() => {
            setType("applied-collaboration");
          }}
        />
      </Tabs>
      {type === "conference-collaboration" && (
        <CollaborationForm type="conference-collaboration" />
      )}
      {type === "publication-collaboration" && (
        <CollaborationForm type="publication-collaboration" />
      )}
      {type === "applied-collaboration" && <AppliedCollaboration />}
    </>
  );
};
export default Collaboration;
