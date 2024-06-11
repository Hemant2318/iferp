import Card from "components/Layout/Card";

const NewsAnnouncements = () => {
  return (
    <Card className="cps-24 cpe-24 cpt-24 cpb-24 h-100">
      <div className="d-flex justify-content-between cmb-28">
        <div className="text-18-600 color-black-olive">
          {"News & Announcements"}
        </div>
        {/* <div className="text-15-400 color-new-car">
          <u>View All</u>
        </div> */}
      </div>
      <ul className="text-14-400 color-black-olive">
        <li className="mb-3">
          <b>International Conference MoU</b> signed with{" "}
          <b>“Jansons Institute of Technology”</b>, Coimbatore - 11/03/2022
        </li>
        <li className="mb-3">
          Cohost MoU signed with{" "}
          <b>“CMR College of Engineering & Technology”</b>, Hyderabad, India for
          the <b>International Conference On Physical Science And Technology</b>{" "}
          (ICPST-2022) - 15/02/2022
        </li>
        <li className="mb-3">
          Cohost MoU signed with{" "}
          <b>“Vishwatmak Om Gurudev College of Engineering”</b>, Maharashtra,
          India for the{" "}
          <b>International Conference On Physical Science And Technology</b>{" "}
          (ICPST-2022) - 15/02/2022
        </li>
      </ul>
    </Card>
  );
};
export default NewsAnnouncements;
