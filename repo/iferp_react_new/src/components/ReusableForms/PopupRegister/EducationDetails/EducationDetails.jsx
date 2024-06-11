import EducationDetails2 from "./EducationDetails2";

const EducationDetails = ({ setType, userDetails, fetchUserData }) => {
  // const [formType, setFormType] = useState("0");
  // useEffect(() => {
  //   if (
  //     userDetails?.registration_status === "2" &&
  //     userDetails?.educational_details?.ug_course
  //   ) {
  //     setFormType("1");
  //   }
  // }, [userDetails]);

  return (
    <div>
      <EducationDetails2
        setType={setType}
        // setFormType={setFormType}
        userDetails={userDetails}
        fetchUserData={fetchUserData}
      />
      {/* {formType === "0" && (
        <EducationDetails1
          setType={setType}
          setFormType={setFormType}
          userDetails={userDetails}
          fetchUserData={fetchUserData}
        />
      )} */}
      {/* {formType === "0" && (
        <EducationDetails2
          setType={setType}
          setFormType={setFormType}
          userDetails={userDetails}
          fetchUserData={fetchUserData}
        />
      )} */}
    </div>
  );
};

export default EducationDetails;
