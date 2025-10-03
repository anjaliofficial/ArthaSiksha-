// App.jsx
import "./App.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy Imports
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
const ModuleDetail = lazy(() => import("./public/ModuleDetail"));
const QuizPage = lazy(() => import("./public/QuizPage"));
const ResetPassword = lazy(() => import("./public/ResetPassword"));
const ModulePage = lazy(() => import("./public/ModulePage"));
const ArticlePage = lazy(() => import("./public/ArticlePage"));
const ArticlesPageUser = lazy(() => import("./public/ArticlesPageUser"));
const ArticleDetailUser = lazy(() => import("./public/ArticleDetailUser"));
const QuizPageUser = lazy(() => import("./public/QuizPageUser"));
const QuizDetailUser = lazy(() => import("./public/QuizDetailUser"));
const Stocks = lazy(() => import("./public/Stocks"));
const MutualFunds = lazy(() => import("./public/MutualFunds"));
const SIPCalculator = lazy(() => import("./public/SIPCalculator"));
const Insurance = lazy(() => import("./public/Insurance"));
const AdminInsurancePage = lazy(() => import("./public/AdminInsurancePage"));

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
          <Route path="/admin/quizzes/view/:quizId" element={<QuizPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/modules/:id" element={<ModulePage />} />
          <Route path="/admin/articles/:id" element={<ArticlePage />} />
          <Route path="/articles" element={<ArticlesPageUser />} />
          <Route path="/articles/:id" element={<ArticleDetailUser />} />
          <Route path="/quizzes" element={<QuizPageUser />} />
          <Route path="/quiz/:id" element={<QuizDetailUser />} />
          <Route path="/investments/stocks" element={<Stocks />} />
          <Route path="/investments/mutual-funds" element={<MutualFunds />} />
          <Route path="/investments/sip" element={<SIPCalculator />} />
          <Route path="/investments/insurance" element={<Insurance />} />
          {/* Admin Route for the Content Editor */}
          <Route path="/admin/insurance" element={<AdminInsurancePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
