import React from "react";
import { Link } from "react-router-dom";
import NavbarAfterLogin from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import "./MutualFunds.css";

const MutualFunds = () => {
  return (
    <div className="mutualfunds-page">
      <NavbarAfterLogin />

      <div className="mutualfunds-main">
        {/* Page Header */}
        <h1>Mutual Funds in Nepal</h1>
        <p>
          Mutual funds are investment vehicles that pool money from many
          investors to purchase a diversified portfolio of stocks, bonds, or
          other securities. In Nepal, mutual funds are regulated by SEBON and
          traded in NEPSE.
        </p>

        {/* Key Concepts */}
        <section className="mutualfunds-section">
          <h2>Key Concepts</h2>
          <ul>
            <li>What are Mutual Funds?</li>
            <li>Types of Mutual Funds (Equity, Debt, Hybrid)</li>
            <li>Advantages of Investing in Mutual Funds</li>
            <li>Risks and Returns</li>
            <li>How to Invest in Mutual Funds in Nepal</li>
            <li>Nepal’s Popular Mutual Funds (NIBSF1, NIBLPF, etc.)</li>
          </ul>
        </section>

        {/* Resource Cards */}
        <section className="mutualfunds-section">
          <h2>Learning Resources</h2>
          <div className="resource-cards">
            <Link
              to="/investments/mutualfunds/lesson1"
              className="resource-card"
            >
              <h4>Introduction to Mutual Funds</h4>
              <p>Understand how mutual funds work and why they are popular.</p>
            </Link>
            <Link
              to="/investments/mutualfunds/lesson2"
              className="resource-card"
            >
              <h4>Types of Mutual Funds</h4>
              <p>Learn about equity, debt, hybrid, and index funds.</p>
            </Link>
            <Link
              to="/investments/mutualfunds/lesson3"
              className="resource-card"
            >
              <h4>Investing in Nepal</h4>
              <p>Step-by-step guide to buying mutual fund units in Nepal.</p>
            </Link>
            <Link
              to="/investments/mutualfunds/lesson4"
              className="resource-card"
            >
              <h4>Mutual Fund Strategies</h4>
              <p>Explore SIPs, lump-sum investing, and diversification.</p>
            </Link>
          </div>
        </section>

        {/* Charts / Examples */}
        <section className="mutualfunds-section">
          <h2>Examples & Performance</h2>
          <p>
            Below are examples of popular mutual funds in Nepal and their
            average returns (illustrative only):
          </p>
          <div className="examples-container">
            <div className="example-box">
              <h4>NIBSF1</h4>
              <p>Average Annual Return: 12%</p>
            </div>
            <div className="example-box">
              <h4>NIBLPF</h4>
              <p>Average Annual Return: 10%</p>
            </div>
            <div className="example-box">
              <h4>Global IME Samriddhi Fund</h4>
              <p>Average Annual Return: 11%</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mutualfunds-section">
          <h2>Beginner Tips</h2>
          <ul>
            <li>Start with SIPs for disciplined investing.</li>
            <li>Compare fund performance before investing.</li>
            <li>Diversify between stocks and mutual funds.</li>
            <li>Review fund manager track record.</li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="mutualfunds-section">
          <h2>Ready to Explore Mutual Funds?</h2>
          <Link to="/investments/mutualfunds/lesson1" className="learn-btn">
            Start Learning
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MutualFunds;
