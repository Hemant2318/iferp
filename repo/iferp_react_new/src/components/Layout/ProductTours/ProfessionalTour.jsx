import Joyride from "react-joyride";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTourIndex, tourStatus } from "store/slices";
import TourLayout from "../TourLayout";

const ProfessionalTour = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tourIndex, isTour } = useSelector((state) => ({
    tourIndex: state.global.tourIndex,
    isTour: state.global.isTour,
  }));
  const buttonClick = (type) => {
    if (type === "next") {
      dispatch(setTourIndex(tourIndex + 1));
    } else if (type === "back") {
      dispatch(setTourIndex(tourIndex - 1));
    } else {
      // Nothing
    }
  };
  const toggleSidebar = (isShow = false) => {
    // console.log(isShow);
    let elem = document.getElementById("nav-sidemenu");
    if (elem) {
      if (isShow) {
        // console.log("SHOW");
        elem.classList.add("show-left");
      } else {
        // console.log("HIDE");
        elem.classList.remove("show-left");
      }
    }
  };
  const handelClose = async () => {
    await dispatch(tourStatus(19, true));
  };
  const handleCallback = (e) => {
    const { action } = e;
    if (action === "close") {
      handelClose();
    }
  };
  return (
    <Joyride
      disableCloseOnEsc
      disableOverlayClose
      continuous
      hideBackButton
      callback={handleCallback}
      run={isTour}
      stepIndex={tourIndex}
      steps={[
        {
          target: "#create-new-post-id",
          content: (
            <TourLayout
              isHideBack
              title="Add New Post"
              info="Lets, Start by adding a new post. Create a new post in seconds and share it with the world!"
              handelNext={() => {
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
          disableBeacon: true,
        },
        {
          disableBeacon: true,
          target: "#recent-posts-id",
          content: (
            <TourLayout
              title="Recently Added Posts"
              info="Stay up to date with the latest posts from your followers and never miss an important update!"
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate("/professional/my-profile/my-membership");
                  buttonClick("next");
                }, 500);
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#profile-details-id",
          content: (
            <TourLayout
              isHideBack
              title="Profile Details"
              info="Check out My Profile tab to see your Membership, applied events information, Update your profile and Add Research Items!"
              handelNext={() => {
                toggleSidebar(false);
                navigate("/professional/my-profile/research-profile");
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#my-membership-id",
          content: (
            <TourLayout
              title="Membership Details"
              info="Explore 'My Membership' to view your membership plan details and unlock exclusive rewards and benefits."
              handelNext={() => {
                buttonClick("next");
              }}
              handelBack={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  buttonClick("back");
                }, 500);
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#research-profile-id",
          content: (
            <TourLayout
              title="Research Profile"
              info="Quickly add your 'Research Profile' details like about, achievements, and more to showcase your expertise among research community"
              handelNext={() => {
                navigate("/professional/my-profile/research-profile");
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#add-research-item-id",
          content: (
            <TourLayout
              isDone
              title="Add Research Items"
              info="Easily add your 'Research Items' like articles, conference papers, and more to your profile with our user-friendly interface"
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate(
                    "/professional/conferences-and-events/event-list/conference"
                  );
                  buttonClick("next");
                }, 500);
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#all-events-id",
          content: (
            <TourLayout
              isHideBack
              title="All Events"
              info="Take a tour of upcoming events and stay up-to-date with conferences, webinars, workshops, and more!"
              handelNext={() => {
                toggleSidebar(false);
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#conference-id",
          content: (
            <TourLayout
              title="Conference Details"
              info="Explore the conference's features and submit your abstracts to present at the event and register to attend - it's that easy!"
              handelNext={() => {
                buttonClick("next");
              }}
              handelBack={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  buttonClick("back");
                }, 500);
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#committee-member-id",
          content: (
            <TourLayout
              isDone
              isHideBack
              title="Committee Member"
              info="Apply for committee members and join a team of passionate individuals working to make a positive impact on the community"
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate(
                    "/professional/publications/scopus-indexed-journals"
                  );
                  buttonClick("next");
                }, 500);
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#publications-id",
          content: (
            <TourLayout
              isDone
              isHideBack
              title="Publications"
              info="Explore the world of scholarly publications.. You can find SCOPUS Indexed Journals, UGC Journals, Google Scholar Journals and more"
              handelNext={() => {
                navigate(
                  "/professional/network-management/network/posts/discover-posts"
                );
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#my-network-community-id",
          content: (
            <TourLayout
              isHideBack
              title="My Network Community"
              info="Discover the power of My Network and see how it can help you easily connect, communicate and collaborate with wide range of researchers!"
              handelNext={() => {
                toggleSidebar(false);
                navigate(
                  "/professional/network-management/network/posts/discover-posts"
                );
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#discover-posts-id",
          content: (
            <TourLayout
              title="Discover & Create New Post"
              info="Create a new post and sort posts easily with the Sort By options to find the posts that best fit your needs!"
              handelNext={() => {
                buttonClick("next");
              }}
              handelBack={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  buttonClick("back");
                }, 500);
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#network-id",
          content: (
            <TourLayout
              title="Network Connections"
              info={`Explore the "New Requests" and "Sent Requests"  sections of the Network and check out the New Requests and Sent Requests to see who you can connect with!`}
              handelNext={() => {
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#groups-id",
          content: (
            <TourLayout
              isDone
              isHideBack
              title="SIG Groups"
              info={`Explore the world of groups and join the ones that interest you the most with just one click of the "join now" button to get added instantly!!`}
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate("/professional/chapters-groups/chapters");
                  buttonClick("next");
                }, 500);
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#chapters-groups-id",
          content: (
            <TourLayout
              isHideBack
              title="Chapters & Groups"
              info="Explore the world of knowledge chapter wise and keep track of events associated with chapters and SIG Groups"
              handelNext={() => {
                toggleSidebar(false);
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#chapters-id",
          content: (
            <TourLayout
              title="Chapters"
              info="Look through all of IFERP's chapters and click on the one of your choice to get all of the details including the events associated with that chapter and register for them instantly."
              handelNext={() => {
                buttonClick("next");
              }}
              handelBack={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  buttonClick("back");
                }, 500);
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#SIG-groups-id",
          content: (
            <TourLayout
              isDone
              title="Special Interest Community"
              info="Discover the world of SIGs and stay updated on the latest developments in your area of interest. Click on any SIG for more details and follow to stay in the loop!"
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate("/professional/career-support/careers");
                  buttonClick("next");
                }, 500);
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#career-support-id",
          content: (
            <TourLayout
              isHideBack
              title="Career Support"
              info="Unlock your potential by exploring the tools and resources available to help you take charge of your career development journey!"
              handelNext={() => {
                toggleSidebar(false);
                buttonClick("next");
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#career-support-menu-id",
          content: (
            <TourLayout
              title="Career Support Opportunities"
              info="Browse through the innovative career support categories, and apply the given fields to develop your career and upgrade your professional knowledge!"
              handelNext={() => {
                buttonClick("next");
              }}
              handelBack={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  buttonClick("back");
                }, 500);
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#applied-career-support-id",
          content: (
            <TourLayout
              isDone
              title="Applied Careers"
              info="Get the most out of your career search with Applied Career Support, where you can explore all of the support options available to you in one convenient place!"
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  buttonClick("next");
                }, 500);
              }}
              handelBack={() => {
                navigate("/professional/nominate-for-award");
                buttonClick("back");
              }}
            />
          ),
        },
        {
          disableBeacon: true,
          target: "#nomiante-for-awards-id",
          content: (
            <TourLayout
              isDone
              isHideBack
              title="Nomiante for awards"
              info="Experience the ease of nominating yourself for awards with our feature-rich Nominate For Award tool!"
              handelNext={() => {
                toggleSidebar(false);
                buttonClick("next");
                navigate("/professional/dashboard");
                handelClose();
              }}
              handelBack={() => {
                buttonClick("back");
              }}
            />
          ),
        },
      ]}
      styles={{
        buttonNext: {
          display: "none",
        },
      }}
    />
  );
};
export default ProfessionalTour;
