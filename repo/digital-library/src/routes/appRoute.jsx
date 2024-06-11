import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { commonRoute } from "utils/constants";
import Home from "pages/App/Home";
import PresentationDetails from "pages/App/PresentationDetails";
import Conference from "pages/App/Conference";
import ConferenceDetail from "pages/App/Conference/ConferenceDetail";
import OfficeBearer from "pages/App/Conference/ConferenceDetail/OfficeBearer";
import FindSession from "pages/App/Conference/ConferenceDetail/FindSession";
import FindSessionDetails from "pages/App/Conference/ConferenceDetail/FindSession/FindSessionDetails";
import OrganizationProfile from "pages/App/OrganizationProfile";
import Discussions from "pages/App/Discussions";
import DiscussionsDetails from "pages/App/Discussions/DiscussionsDetails";
// import Typography from "pages/Typography";
import { CiteButton } from "components";
import NewPost from "pages/App/NewPost";
import SessionExpired from "pages/SessionExpired";
import InvalidToken from "pages/InvalidToken";
import Layouts from "pages/Auth/Layouts";
import AllTrendingResearchPredio from "pages/App/AllTrendingResearchPredio";
import TopResearchers from "pages/App/TopResearchers";
import HandleRedirect from "pages/HandleRedirect";
import { getDataFromLocalStorage } from "utils/helpers";
import { useDispatch } from "react-redux";
import {
  fetchProfile,
  fetchCountry,
  fetchUserNetwork,
} from "store/globalSlice";
// import Posts from "../pages/App/Posts";

const AppRoute = () => {
  const dispatch = useDispatch();
  const routeArray = [
    { path: "/", component: <Home />, LayoutsId: "home-container" },
    {
      path: commonRoute.postsByType,
      component: <Home />,
      LayoutsId: "",
    },
    { path: commonRoute.conference, component: <Conference />, LayoutsId: "" },
    {
      path: commonRoute.conferenceDetail,
      component: <ConferenceDetail />,
      LayoutsId: "",
    },
    {
      path: commonRoute.allTrendingResearchPredio,
      component: <AllTrendingResearchPredio />,
      LayoutsId: "",
    },
    {
      path: commonRoute.topResearchers,
      component: <TopResearchers />,
      LayoutsId: "",
    },
    {
      path: commonRoute.officeBearer,
      component: <OfficeBearer />,
      LayoutsId: "",
    },
    {
      path: commonRoute.findSession,
      component: <FindSession />,
      LayoutsId: "",
    },
    {
      path: commonRoute.discussionsTypes,
      component: <Discussions />,
      LayoutsId: "",
    },
    {
      path: commonRoute.discussionsDetails,
      component: <DiscussionsDetails />,
      LayoutsId: "",
    },
    {
      path: commonRoute.findSessionDetails,
      component: <FindSessionDetails />,
      LayoutsId: "",
    },
    {
      path: commonRoute.topConference,
      component: <Conference />,
      LayoutsId: "",
    },
    // {
    //   path: commonRoute.posts,
    //   component: <Posts />,
    //   LayoutsId: "",
    // },
    // {
    //   path: commonRoute.allPresentations,
    //   component: <AllPresentations />,
    //   LayoutsId: "",
    // },
    // {
    //   path: commonRoute.allArticles,
    //   component: <AllAtricles />,
    //   LayoutsId: "",
    // },
    {
      path: commonRoute.presentationDetails,
      component: <PresentationDetails />,
      LayoutsId: "",
    },
    {
      path: commonRoute.organizationProfile,
      component: <OrganizationProfile />,
      LayoutsId: "",
    },
    {
      path: commonRoute.publishNewPost,
      component: <NewPost />,
      LayoutsId: "",
    },
  ];
  const handleGlobalAPI = async () => {
    await dispatch(fetchProfile());
    await dispatch(fetchCountry());
    await dispatch(fetchUserNetwork());
  };

  useEffect(() => {
    if (getDataFromLocalStorage("token")) {
      handleGlobalAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <CiteButton />
      <Routes>
        <Route
          exact
          path={commonRoute.handleRedirect}
          element={<HandleRedirect />}
        />
        {routeArray.map((elem, index) => {
          return (
            <Route
              exact
              key={index}
              path={elem.path}
              element={
                elem.isNavigate ? (
                  <Navigate to={elem.to} replace />
                ) : (
                  <Layouts id={elem.LayoutsId || ""} isAuthenticated>
                    {elem.component}
                  </Layouts>
                )
              }
            />
          );
        })}
        <Route
          exact
          path={commonRoute.sessionExpired}
          element={<SessionExpired />}
        />
        <Route
          exact
          path={commonRoute.invalidToken}
          element={<InvalidToken />}
        />
        <Route path="*" element={<Navigate replace to="" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoute;
