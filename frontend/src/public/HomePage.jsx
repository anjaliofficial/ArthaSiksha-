import { IoNotificationsCircleSharp } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom"; // ✅ import Link
import pfp from "../assets/pfp.png";
import logo from "../assets/logoWhite.png";
import Footer from "../components/footer";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="whole-home-page">
      <div className="navbar">
        <div className="left">
          {/* ✅ Logo redirects to Home */}
          <Link to="/" className="logo">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="right">
          <ul>
            {/* ✅ Nav items redirect */}
            <li>
              <Link to="/quizzes">Quizzes</Link>
            </li>
            <li>
              <Link to="/lessons">Lessons</Link>
            </li>
            <li>
              <Link to="/leaderboards">Leaderboards</Link>
            </li>
          </ul>
          {/* ✅ Notifications */}
          <Link to="/notifications" className="notification-bell">
            <IoNotificationsCircleSharp />
          </Link>
          {/* ✅ Profile */}
          <Link to="/profile" className="profile">
            <img src={pfp} alt="profile-pic" />
          </Link>
        </div>
      </div>

      <div className="line"></div>

      <div className="top-three">
        <div className="welcoming">
          <h1 className="welcomeText">Welcome, User</h1>
          <p className="modules-text">You've completed 3/10 modules</p>
          <div className="progress-container">
            <div className="progress-bar">70%</div>
          </div>
          <div className="two-sides">
            <div className="mission">
              <h3 className="mission-header">Today's Mission</h3>
              <div className="video-mission">
                <FaPlay />
              </div>
            </div>
            <div className="stats">
              <h3 className="stats-header">Quick Stats</h3>
              <div className="points-streak">
                <div className="pointsCol">
                  <h6>Points</h6>
                  <p>250</p>
                </div>
                <div className="line-stats">|</div>
                <div className="streakCol">
                  <h6>Streak</h6>
                  <p>5 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Recommended Lessons clickable */}
        <div className="recom-lessons">
          <h2>Recommended Lessons</h2>
          <Link to="/lessons/1" className="lessons">
            <h6>How to budget pocket money?</h6>
            <FaChevronRight />
          </Link>
          <Link to="/lessons/2" className="lessons">
            <h6>Saving for goals</h6>
            <FaChevronRight />
          </Link>
          <Link to="/lessons/3" className="lessons">
            <h6>Understanding needs vs wants</h6>
            <FaChevronRight />
          </Link>
        </div>

        {/* ✅ Notifications section */}
        <div className="notification-contents">
          <h2>Notifications</h2>
          <Link to="/notifications" className="not-content">
            <p>New Challenge Unlocked</p>
          </Link>
          <Link to="/notifications" className="not-content">
            <p>Friend request pending</p>
          </Link>
          <Link to="/notifications" className="not-content">
            <p>You earned a badge!</p>
          </Link>
        </div>
      </div>

      <div className="btm-two">
        <div className="leaderboard-preview">
          <h2>Leaderboard</h2>
          <div className="leads">
            <p>1. Anna Roberts</p>
            <p>500 XP</p>
            <p>🏆 1st</p>
          </div>
          <div className="leads">
            <p>2. Cubby</p>
            <p>450 XP</p>
            <p>🏆 2nd</p>
          </div>
          <div className="leads">
            <p>3. Appu Cutiee</p>
            <p>430 XP</p>
            <p>🏆 3rd</p>
          </div>
          <div className="leads">
            <p>4. John Smith</p>
            <p>400 XP</p>
            <p>🏆 4th</p>
          </div>
          <div className="empty-btn">
            <div className="area"></div>
            <div className="full-leads-btn">
              {/* ✅ Leaderboard full page */}
              <Link to="/leaderboards">
                <button>
                  See Full Leaderboard <FaArrowRight />
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="events-tips">
          <div className="events">
            <h2>Upcoming Events</h2>
            <Link to="/events/quiz" className="quiz-thing">
              <h4>Weekly Quiz</h4>
              <p>2 days</p>
            </Link>
            <Link to="/events/workshop" className="quiz-thing">
              <h4>Finance Workshop</h4>
              <p>5 days</p>
            </Link>
          </div>

          <div className="tip-line"></div>
          <div className="again-two">
            <div className="finance-tip">
              <h2>Finance Tip</h2>
              <p>Set a budget for your weekly expenses</p>
            </div>
            <div className="badges">
              <h2>Badges</h2>
              <div className="more-badges">
                <Link to="/badges" className="badgeArea">
                  <img src="" alt="badge-img" className="image-badges" />
                  <p>Budget Boss</p>
                </Link>
                <Link to="/badges" className="badgeArea">
                  <img src="" alt="badge-img" className="image-badges" />
                  <p>Savings Star</p>
                </Link>
              </div>
              <Link to="/badges">+ See all badges</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
