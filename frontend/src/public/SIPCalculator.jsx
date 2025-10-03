import React, { useState } from "react";
import NavbarAfterLogin from "../components/navbarAfterLogin";
import Footer from "../components/footer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./SIPCalculator.css";

const SIP = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const [years, setYears] = useState(5);
  const [interestRate, setInterestRate] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");

  const calculateSIP = () => {
    const n = years * 12;
    const r = interestRate / 12 / 100;
    return (
      monthlyInvestment *
      ((Math.pow(1 + r, n) - 1) / r) *
      (1 + r)
    ).toFixed(0);
  };

  const generateGrowthData = () => {
    const n = years * 12;
    const r = interestRate / 12 / 100;
    let data = [];
    for (let i = 1; i <= n; i++) {
      const fv = monthlyInvestment * ((Math.pow(1 + r, i) - 1) / r) * (1 + r);
      data.push({ month: i, value: parseFloat(fv.toFixed(0)) });
    }
    return data;
  };

  const marketComparison = [
    { market: "Nepal", returns: 10 },
    { market: "India", returns: 16 },
    { market: "US", returns: 10 },
  ];

  const equityDebtComparison = [
    { type: "Equity SIP", returns: 15 },
    { type: "Debt SIP", returns: 8 },
    { type: "Hybrid SIP", returns: 12 },
  ];

  return (
    <div className="sip-page">
      <NavbarAfterLogin />

      <div className="sip-main">
        {/* Search */}
        <section className="sip-section">
          <h2> Explore Topics</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search SIP, Mutual Funds, NEPSE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => alert(`Searching for "${searchTerm}"...`)}>
              Search
            </button>
          </div>
          <p className="search-note">
            🔍 Filter through content & examples on SIP & mutual funds.
          </p>
        </section>
        <h1>📈 Complete SIP Guide</h1>

        {/* Intro */}
        <section className="sip-section">
          <h2>1. What is SIP?</h2>
          <p>
            A <strong>Systematic Investment Plan (SIP)</strong> is investing a
            fixed amount regularly into a mutual fund. Beginner-friendly,
            disciplined, and grows wealth over time through compounding.
          </p>
        </section>

        {/* Types */}
        <section className="sip-section">
          <h2>2. Types of SIP</h2>
          <ul>
            <li>
              <strong>Flexible SIP:</strong> Adjust monthly amount anytime.
            </li>
            <li>
              <strong>Top-Up SIP:</strong> Increase investment periodically.
            </li>
            <li>
              <strong>Perpetual SIP:</strong> Continuous long-term investment.
            </li>
            <li>
              <strong>Trigger SIP:</strong> Starts based on market conditions.
            </li>
          </ul>
        </section>

        {/* Pros & Cons */}
        <section className="sip-section pros-cons">
          <div className="pros">
            <h3>Pros</h3>
            <ul>
              <li>Small investments grow over time.</li>
              <li>Automated and disciplined.</li>
              <li>Reduces risk of timing the market.</li>
            </ul>
          </div>
          <div className="cons">
            <h3>Cons</h3>
            <ul>
              <li>Market-linked, returns not guaranteed.</li>
              <li>Requires patience; long-term gains.</li>
              <li>Early withdrawal may incur penalties.</li>
            </ul>
          </div>
        </section>

        {/* Nepal vs International */}
        <section className="sip-section">
          <h2>3. SIP in Nepal vs Internationally</h2>
          <p>
            <strong>Nepal:</strong> Linked to NEPSE mutual funds like{" "}
            <strong>NIBL Sahabhagita</strong>. Returns: 8–12% annually.
          </p>
          <p>
            <strong>International:</strong> Global SIPs like Vanguard S&P 500.
            Returns: ~10% CAGR.
          </p>
        </section>

        {/* Scams & Tips */}
        <section className="sip-section">
          <h2>4. Risks & Tips</h2>
          <ul>
            <li>Check fund registration with SEBON.</li>
            <li>Avoid fake brokers and get-rich-quick schemes.</li>
            <li>Start small, stay consistent, diversify investments.</li>
          </ul>
        </section>

        {/* Interactive Calculator */}
        <section className="sip-section">
          <h2>5. SIP Calculator</h2>
          <div className="calculator">
            <label>Monthly Investment (NPR):</label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            />
            <label>Years of Investment:</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <label>Annual Interest Rate (%):</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
            <div className="result">Future Value: NPR {calculateSIP()}</div>
          </div>
        </section>

        {/* Growth Chart */}
        <section className="sip-section">
          <h2>6. SIP Growth Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateGrowthData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{ value: "Month", position: "insideBottomRight" }}
              />
              <YAxis
                label={{ value: "NPR", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="SIP Value"
                stroke="#007bff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Market Comparison */}
        <section className="sip-section">
          <h2>7. Market Comparison</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={marketComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="market" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="returns" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Equity vs Debt */}
        <section className="sip-section">
          <h2>8. Equity vs Debt vs Hybrid</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={equityDebtComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="returns" fill="#ffc107" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Testimonials */}
        <section className="sip-section">
          <h2>9. What People Say</h2>
          <div className="testimonials">
            <p>
              💬 "SIP helped me start investing with small amounts!" –
              Research-based user
            </p>
            <p>
              💬 "Consistent investments beat one-time large deposits." –
              Verified student
            </p>
          </div>
        </section>

        {/* Conclusion */}
        <section className="sip-section">
          <h2>11. Conclusion</h2>
          <p>
            SIP is a disciplined, long-term investment method. Start small, stay
            consistent, diversify, and benefit from compounding.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default SIP;
