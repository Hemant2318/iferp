import {
  ConferenceFilter,
  ConferenceList,
  DropdownOption,
  Checkbox,
} from "components";
import { icons } from "utils/constants";

const OrganizationConference = () => {
  const eventList = [
    {
      id: "qw78",
      name: "START HERB: Journey from Innovation to Entrepreneurship in Herbals Medicines",
      orgBy: "Bioleagues",
      location: "Mumbai, India",
      date: "24 October 2022",
    },
    {
      id: "qw79",
      name: "International Conference on Innovation and Advances in Pharma-ceutical Sciences ",
      orgBy: "Bioleagues",
      location: "Delhi, India",
      date: "18 October 2022",
    },
    {
      id: "qw76",
      name: "START HERB: Journey from Innovation to Entrepreneurship in Herbals Medicines",
      orgBy: "Bioleagues",
      location: "Mumbai, India",
      date: "24 October 2022",
    },
    {
      id: "qw75",
      name: "International Conference on Innovation and Advances in Pharma-ceutical Sciences ",
      orgBy: "Bioleagues",
      location: "Delhi, India",
      date: "18 October 2022",
    },
  ];
  return (
    <div className="row mt-3">
      <div className="col-md-3">
        <ConferenceFilter />
      </div>
      <div className="col-md-9">
        <ConferenceList
          eventList={eventList}
          title={
            <>
              Conferences <span className="text-20-400">(354)</span>
            </>
          }
          filterContent={
            <DropdownOption
              icons={
                <div className="text-15-400 color-3d3d border rounded cps-16 cpe-16 cpt-10 cpb-10 fa-center gap-5">
                  <span>Conferences</span>
                  <span>
                    <img src={icons.downArrow} alt="sort" />
                  </span>
                </div>
              }
            >
              <div className="cps-10 cpe-10">
                <div className="cps-10 cpe-10 cpt-10 cpb-10 cpe-10 bb-e3e3 text-15-400 color-3d3d text-nowrap pointer fa-center gap-2 flex-nowrap">
                  <span>
                    <Checkbox />
                  </span>
                  <span>All (476)</span>
                </div>
                <div className="cps-10 cpe-10 cpt-10 cpb-10 cpe-10 bb-e3e3 text-15-400 color-3d3d text-nowrap pointer fa-center gap-2 flex-nowrap">
                  <span>
                    <Checkbox />
                  </span>
                  <span>Conference (426)</span>
                </div>
                <div className="cps-10 cpe-10 cpt-10 cpb-10 cpe-10 bb-e3e3 text-15-400 color-3d3d text-nowrap pointer fa-center gap-2 flex-nowrap">
                  <span>
                    <Checkbox />
                  </span>
                  <span>Conference Series (30)</span>
                </div>

                <div className="cps-10 cpe-10 cpt-10 cpb-10 cpe-10 text-15-400 color-3d3d text-nowrap pointer fa-center gap-2 flex-nowrap">
                  <span>
                    <Checkbox />
                  </span>
                  <span>Discussions (20)</span>
                </div>
              </div>
            </DropdownOption>
          }
        />
      </div>
    </div>
  );
};

export default OrganizationConference;
