import Joyride from "react-joyride";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTourIndex, tourStatus } from "store/slices";
import TourLayout from "../TourLayout";

const StudentTour = () => {
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
  const handelClose = async () => {
    await dispatch(tourStatus(19, true));
  };
  const handleCallback = (e) => {
    const { action } = e;
    if (action === "close") {
      handelClose();
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
          disableBeacon: true,
          target: "#track-status-id",
          content: (
            <TourLayout
              isHideBack
              title="Click to view"
              info="Your upcoming registered events and check the status of your projects/tasks."
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
          target: "#create-new-post-id",
          content: (
            <TourLayout
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
          target: "#career-opportunities-id",
          content: (
            <TourLayout
              isDone
              title="Career Opportunities"
              info="Explore the wide range of 'career opportunities' available and find the one that best fits your needs and aspirations. Apply now to kick-start your professional journey!"
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate("/student/my-profile/my-membership");
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
              info="Check out My Profile tab to see your Membership information, view your Recent Profile activities and Add Research Items!"
              handelNext={() => {
                toggleSidebar(false);
                navigate("/student/my-profile/my-membership");
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
              isDone
              title="View Details"
              info="View your membership plan details and unlock exclusive rewards and benefits."
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate(
                    "/student/conferences-and-events/event-list/conference"
                  );
                  buttonClick("next");
                }, 500);
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
          target: "#all-events-id",
          content: (
            <TourLayout
              isHideBack
              title="All Events"
              info="Experience the ultimate conference and events experience with the best-in-class facilities and services."
              handelNext={() => {
                toggleSidebar(false);
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
          target: "#conference-id",
          content: (
            <TourLayout
              isDone
              title="Conference Details"
              info="Explore the conference's features and submit your abstracts to present at the event and register to attend - it's that easy!"
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate("/student/publications/scopus-indexed-journals");
                  buttonClick("next");
                }, 500);
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
          target: "#publications-id",
          content: (
            <TourLayout
              isDone
              isHideBack
              title="Publications"
              info="Explore our vast library of carefully curated papers from top academic journals and conferences, all in one place"
              handelNext={() => {
                navigate(
                  "/student/network-management/network/posts/discover-posts"
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
              info="Discover the power of My Network and see how it can help you easily connect, communicate and collaborate with your team!"
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
              isDone
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
              title="SIG Groups"
              info={`Explore the world of groups and join the ones that interest you the most with just one click of the "join now" button to get added instantly!!`}
              handelNext={() => {
                toggleSidebar(true);
                setTimeout(() => {
                  navigate("/student/chapters-groups/chapters");
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
                  navigate("/student/career-support/careers");
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
                  navigate("/student/nominate-for-award");
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
                navigate("/student/dashboard");
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
export default StudentTour;
