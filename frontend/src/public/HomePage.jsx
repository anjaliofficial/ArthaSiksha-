import { IoNotificationsCircleSharp } from "react-icons/io5";
import { FaPlay } from "react-icons/fa6";
import pfp from '../assets/pfp.png';
import logo from '../assets/logoWhite.png';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="whole-home-page">
            <div className="navbar">
                <div className="left">
                    <a href="#" className="logo"><img src={logo} alt="logo" /></a>
                </div>
                <div className="right">
                    <ul>
                        <li>Quizzes</li>
                        <li>Lessons</li>
                        <li>Leaderboards</li>
                    </ul>
                    <a href="#" className="notification-bell"><IoNotificationsCircleSharp /></a>
                    <a className="profile" href="#"><img src={pfp} alt="profile-pic"></img></a>
                </div>
            </div>

            <div className="line"></div>

            <div className="top-three">

                <div className="welcoming">
                    <h1 className="welcomeText">Welcome, User</h1>
                    <p className="modules-text">You've completed 3/10 modules</p>
                    <div class="progress-container">
                        <div class="progress-bar">70%</div>
                    </div>
                    <div className="two-sides">
                        <div className="mission">
                            <h3 className="mission-header">Today's Mission</h3>
                            <div className="video-mission"><FaPlay /></div>
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
                <div className="recom-lessons">
                    <h2>Recommended Lessons</h2>
                    <div className="lessons">
                        <h6>How to budget pocket money?</h6>
                        {/*the chevron right icon*/}
                    </div>
                    <div className="lessons">
                        <h6>How to budget pocket money?</h6>
                        {/*the chevron right icon*/}
                    </div>
                    <div className="lessons">
                        <h6>How to budget pocket money?</h6>
                        {/*the chevron right icon*/}
                    </div>
                </div>
                <div className="notification-contents">
                    <h2>Notifications</h2>
                    <div className="not-content">
                        <p>New Challenge Unlocked</p>
                    </div>
                    <div className="not-content">
                        <p>New Challenge Unlocked</p>
                    </div>
                    <div className="not-content">
                        <p>New Challenge Unlocked</p>
                    </div>
                    <div className="not-content">
                        <p>New Challenge Unlocked</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
