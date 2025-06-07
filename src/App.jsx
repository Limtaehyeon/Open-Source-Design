import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ManageBenefitPage from "./pages/ManageBenefitPage";
import ManageEventNewsPage from "./pages/ManageEventNewsPage";
import ManageNoticePage from "./pages/ManageNoticePage";
import ResponseFeedbackPage from "./pages/ResponseFeedbackPage";
import ManageUserListPage from "./pages/ManageUserListPage";
import AdminMajorSelection from "./pages/AdminMajorSelection";
import SubmitFeedbackPage from "./pages/SubmitFeedbackPage";
import ViewBenefitPage from "./pages/ViewBenefitPage";
import ViewEventNewsPage from "./pages/ViewEventNewsPage";
import ViewNoticePage from "./pages/ViewNoticePage";
import UserMajorSelection from "./pages/UserMajorSelection";
import SetAffiliationInformationPage from "./pages/SetAffiliationInformationPage";
import RegisterPage from "./pages/RegisterPage";
import UserMajorRedirect from "./pages/UserMajorRedirect";
import ManageNoticeDetailPage from "./pages/ManageNoticeDetailPage";
import ManageEventNewsDetailPage from "./pages/ManageEventNewsDetailPage";
import ManageBenefitDetailPage from "./pages/ManageBenefitDetailPage";

function LayoutWithNavBar() {
  const location = useLocation();

  const showNavPaths = [
    "/home",
    "/notices",
    "/events",
    "/benefits",
    "/feedback",
  ];
  const showNav = showNavPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {showNav && <NavBar />}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 네비게이션 바가 없는 페이지 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/verify" element={<SetAffiliationInformationPage />} />
        <Route path="/major" element={<UserMajorSelection />} />
        <Route path="/major-check" element={<UserMajorRedirect />} />

        {/* 네비게이션 바가 있는 페이지 */}
        <Route element={<LayoutWithNavBar />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/events" element={<ViewEventNewsPage />} />
          <Route path="/notices" element={<ViewNoticePage />} />
          <Route path="/benefits" element={<ViewBenefitPage />} />
          <Route path="/feedback" element={<SubmitFeedbackPage />} />
        </Route>

        {/* 상세 페이지 - 네비게이션 바 없음 */}
        <Route path="/noticedetail/:id" element={<ManageNoticeDetailPage />} />
        <Route
          path="/eventnewsdetail/:id"
          element={<ManageEventNewsDetailPage />}
        />
        <Route
          path="/benefitdetail/:id"
          element={<ManageBenefitDetailPage />}
        />

        {/* 관리자 페이지 */}
        <Route path="/admin/select-major" element={<AdminMajorSelection />} />
        <Route
          path="/admin/dashboard/:major"
          element={<AdminDashboardPage />}
        />
        <Route path="/admin/notices" element={<ManageNoticePage />} />
        <Route path="/admin/events" element={<ManageEventNewsPage />} />
        <Route path="/admin/benefits" element={<ManageBenefitPage />} />
        <Route path="/admin/feedbacks" element={<ResponseFeedbackPage />} />
        <Route path="/admin/users" element={<ManageUserListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
