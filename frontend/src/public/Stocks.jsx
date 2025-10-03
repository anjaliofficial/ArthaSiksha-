import React from "react";
import { Link } from "react-router-dom";
import NavbarAfterLogin from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import "./Stock.css";

const Stocks = () => {
  return (
    <div className="investment-page">
      <NavbarAfterLogin />

      <div className="investment-main">
        {/* Page Header */}
        <header className="investment-header">
          <h1>📊 NEPSE Stock Basics</h1>
          <p>
            Learn the fundamentals of the Nepal Stock Exchange (NEPSE), explore
            how stock markets work globally, and gain confidence to start your
            investment journey.
          </p>
        </header>

        {/* Key Topics */}
        <section className="investment-section">
          <h2>📘 Key Topics</h2>
          <ul>
            <li>What is a Stock?</li>
            <li>Stock Market Terminology</li>
            <li>How to Buy & Sell Stocks</li>
            <li>Understanding Risk & Returns</li>
            <li>Market Indices and NEPSE</li>
            <li>Investment Strategies</li>
          </ul>
        </section>

        {/* NEPSE Example */}
        <section className="investment-section">
          <h2>🇳🇵 NEPSE Market Overview</h2>
          <p>
            The Nepal Stock Exchange (NEPSE) is the only stock exchange in
            Nepal. It lists companies in banking, hydropower, insurance, and
            other industries.
          </p>
          <div className="chart-box">
            [ NEPSE Index Trend Chart Placeholder ]
          </div>
        </section>

        {/* International Example */}
        <section className="investment-section">
          <h2>🌍 Global Stock Markets</h2>
          <p>
            International stock markets like the New York Stock Exchange (NYSE),
            NASDAQ, and London Stock Exchange influence global finance.
            Comparing NEPSE with these markets helps investors understand
            differences in scale and liquidity.
          </p>
          <div className="chart-box">
            [ Example: Apple vs Nabil Bank Stock Growth Chart Placeholder ]
          </div>
        </section>

        {/* Learning Resources */}
        <section className="investment-section">
          <h2>📚 Learning Resources</h2>
          <div className="resource-cards">
            <Link to="/investments/stocks/lesson1" className="resource-card">
              <h4>Introduction to Stocks</h4>
              <p>
                Understand what stocks are and how the stock market functions.
              </p>
            </Link>
            <Link to="/investments/stocks/lesson2" className="resource-card">
              <h4>NEPSE Market Overview</h4>
              <p>
                Learn about NEPSE index, listed companies, and market trends.
              </p>
            </Link>
            <Link to="/investments/stocks/lesson3" className="resource-card">
              <h4>Buying & Selling Stocks</h4>
              <p>Step-by-step guide to making your first stock investment.</p>
            </Link>
            <Link to="/investments/stocks/lesson4" className="resource-card">
              <h4>Stock Analysis</h4>
              <p>Learn basic techniques to analyze stocks before investing.</p>
            </Link>
          </div>
        </section>

        {/* Tips */}
        <section className="investment-section">
          <h2>💡 Tips for Beginners</h2>
          <ul>
            <li>Start small and diversify your portfolio.</li>
            <li>Invest in companies you understand.</li>
            <li>Always research before buying stocks.</li>
            <li>Track your investments regularly.</li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="investment-section cta">
          <h2>🚀 Ready to Start Investing?</h2>
          <Link to="/investments/stocks/lesson1" className="learn-btn">
            Start Learning
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Stocks;
