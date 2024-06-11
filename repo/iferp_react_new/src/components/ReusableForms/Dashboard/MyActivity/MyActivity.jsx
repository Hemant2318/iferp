import moment from "moment";
import { Card, Table } from "react-bootstrap";
import "./MyActivity.scss";

const MyActivity = ({ data = [] }) => {
  let filterData = data.filter((o) => o.login_date_time && o.logout_date_time);
  return (
    <Card className="cps-24 cpe-24 cpt-24 cpb-24 border-0 my-activity-container">
      <div className="d-flex justify-content-between cmb-28">
        <div className="text-18-500-27 color-title-navy font-poppins">
          My Activity
        </div>
      </div>
      <Table className="text-center" bordered>
        <thead>
          <tr className="text-16-500  color-subtitle-navy">
            <th className="font-poppins">Date</th>
            <th className="font-poppins">Login</th>
            <th className="font-poppins">Logout</th>
          </tr>
        </thead>
        <tbody className="iferp-scroll">
          {filterData.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-12-400">
                No Activity Found
              </td>
            </tr>
          ) : (
            filterData?.map((elm, index) => {
              let { login_date_time, logout_date_time } = elm;
              let displayDate = "";
              let startDate = moment(login_date_time).format("DD-MM-YYYY");
              let endDate = moment(logout_date_time).format("DD-MM-YYYY");
              if (startDate === endDate) {
                displayDate = startDate;
              } else {
                displayDate = `${startDate} - ${endDate}`;
              }

              return (
                <tr key={index} className="text-15-400 color-subtitle-navy">
                  <td>{displayDate}</td>
                  <td>{moment(login_date_time).format("hh:mm A")}</td>
                  <td>{moment(logout_date_time).format("hh:mm A")}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Card>
  );
};
export default MyActivity;
