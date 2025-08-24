import React from 'react';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="whole-home-page">
            <div className="navbar">
                <div className="left">
                    <a href="#"><img src="" alt="logo"/></a>
                </div>
                <div className="right">
                    <ul>
                        <li>Quizzes</li>
                        <li>Lessons</li>
                        <li>Leaderboards</li>
                    </ul>
                    <a href="#">{/*bell*/}</a>
                    <a href="#"><img src="" alt="profile-pic"></img></a>
                </div>
            </div>

            <div className="welcoming">
                <h1>Welcome, User</h1>
                <p>You've completed 3/10 modules</p>
                <progress value="70" max="100"></progress>
                <div className="two-sides">
                    <div className="mission">
                        <h3>Today's Mission</h3>
                        <video></video>
                    </div>
                    <div className="stats">
                        <h3>Quick Stats</h3>
                        <div className="points-streak">
                            <div className="points">
                                <h6>Points</h6>
                                <p>250</p>
                            </div>
                            <div className="line">

                            </div>
                            <div className="streak">
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
    );
};

export default HomePage;