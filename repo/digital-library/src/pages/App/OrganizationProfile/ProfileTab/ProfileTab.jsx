import { icons } from "utils/constants";
import CitedYou from "./CitedYou";
import PeopleWithSimilarSkills from "./PeopleWithSimilarSkills";

const ProfileTab = () => {
  return (
    <div className="row mt-3">
      <div className="col-md-8">
        <div className="shadow cpt-16">
          <div className="fb-center bb-e3e3 cps-20 cpe-20 cpb-10">
            <div>About Organization</div>
            <div>
              <img src={icons.edit} alt="edit" />
            </div>
          </div>
          <div className="cps-20 cpe-20 cpt-16 cpb-16">
            <div className="text-15-400 color-5555">Introduction</div>
            <div className="text-16-400 color-2121 pt-1">
              Doctor of Engineering 2022 Fulbright Scholar || AAG Fellow || PhD
              in Computer Engineering - Software Engineering domain, from UNSW.
              The first awardee of the "Founders Scholarship" (Award), IAMG,
              2020. Associate Editor of "Latest Technological Improvements",
              "Software Engineering", & "Data Mining". Editorial Board of
              "Latest Technological Changes in Sciences", "Information
              Technnology" & "Database Management".
            </div>
            <div className="text-16-400 color-2121 pt-5">
              Software Development, Object-Oriented Programming, Software
              Programming, Web Application Programming, Web Development, Agile
              Development, Web Technologies, Computer Programming, Agile
              Software Development, Computer Science Education, Software
              Technology, Database Administration
            </div>
          </div>
        </div>
        <div className="shadow cpt-16 cpb-16 mt-3">
          <div className="fb-center bb-e3e3 cps-20 cpe-20 cpb-10">
            <div>Objectives</div>
            <div>
              <img src={icons.edit} alt="edit" />
            </div>
          </div>
          <div className="cps-20 cpe-20 cpt-16">
            <div className="text-16-400 color-2121 pt-1">
              <div>To perform</div>
              <div>a) Educational functions</div>
              <div>b) Sponsored Research and Consultancy functions</div>
              <div>c) Continuing Education and Extension functions</div>
              <div>d) Development and Service functions</div>
              <div>e) Management functions</div>
            </div>
          </div>
        </div>
        <div className="shadow cpt-16 cpb-16 mt-3">
          <div className="fb-center bb-e3e3 cps-20 cpe-20 cpb-10">
            <div>Mission & Vision</div>
            <div>
              <img src={icons.edit} alt="edit" />
            </div>
          </div>
          <div className="cps-20 cpe-20 cpt-16">
            <div className="text-15-400 color-5555">Mission</div>
            <div className="text-16-400 color-2121 pt-1">
              To create a transformative educational experience for students
              focused on deep disciplinary knowledge; problem solving;
              leadership, communication, and interpersonal skills; and personal
              health and well-being
            </div>
            <div className="text-15-400 color-5555 mt-3">Vision</div>
            <div className="text-16-400 color-2121 pt-1">
              Academy Institute of Engineering and technology will have a
              transformative impact on society through continual innovation in
              education, research, creativity, and entrepreneurship
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <CitedYou />
        <PeopleWithSimilarSkills />
      </div>
    </div>
  );
};

export default ProfileTab;
