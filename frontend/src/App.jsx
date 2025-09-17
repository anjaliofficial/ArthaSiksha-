// App.jsx
import "./App.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("./public/HomePage"));
const Login = lazy(() => import("./public/Login"));
const Signup = lazy(() => import("./public/Signup"));
const ForgotPassword = lazy(() => import("./public/ForgotPassword"));
const LandingPage = lazy(() => import("./public/LandingPage"));
const Profile = lazy(() => import("./public/Profile"));
const Settings = lazy(() => import("./public/Settings"));
const Navbar = lazy(() => import("./components/navbar"));
const Footer = lazy(() => import("./components/footer"));
const EditProfile = lazy(() => import("./public/EditProfile"));
const Notifications = lazy(() => import("./public/Notifications"));
const AdminDashboard = lazy(() => import("./public/AdminDashboard"));
const Feedback = lazy(() => import("./public/Feedback"));
const ModulesPage = lazy(() => import("./public/Modulespage"));
const QuizPage = lazy(() => import("./public/QuizePage"));
const ResetPassword = lazy(() => import("./public/ResetPassword"));
const ModulePage = lazy(() => import("./public/ModulePage"));
const ArticlePage = lazy(() => import("./public/ArticlePage"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Profile />} />{" "}
          {/* ✅ Use capital P */}
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/quizes" element={<QuizPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/modules/:id" element={<ModulePage />} />
          <Route path="/admin/articles/:id" element={<ArticlePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
