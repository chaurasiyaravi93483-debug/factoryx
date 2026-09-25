import { Link } from "react-router-dom";
import "../home.css";
import {
    Factory,
    BrainCircuit,
    Activity,
    ShieldCheck,
    ArrowRight,
    Cpu,
    BarChart3,
    Wrench,
} from "lucide-react";

function Home() {
    return (
        <div className="factory-home">

            {/* NAVBAR */}
            <nav className="home-navbar">

                <div className="logo">
                    <div className="logo-icon">
                        <Factory size={23} />
                    </div>

                    <div>
                        FACTORY<span>X</span>
                    </div>
                </div>

                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#intelligence">AI Intelligence</a>
                    <a href="#about">About</a>

                    <Link to="/login" className="nav-login">
                        Login
                    </Link>
                </div>

            </nav>


            {/* HERO */}
            <section className="hero-section">

                <div className="hero-content">

                    <div className="hero-badge">
                        <span className="status-dot"></span>
                        AI-POWERED SMART MANUFACTURING
                    </div>

                    <h1>
                        Build a
                        <span> Smarter Factory.</span>
                        <br />
                        Operate with Intelligence.
                    </h1>

                    <p>
                        FACTORYX AI brings machine monitoring, production analytics,
                        predictive maintenance and intelligent decision-making into
                        one powerful industrial platform.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/register" className="primary-btn">
                            Get Started
                            <ArrowRight size={18} />
                        </Link>

                        <Link to="/login" className="outline-btn">
                            View Dashboard
                        </Link>

                    </div>

                    <div className="hero-stats">

                        <div>
                            <strong>24/7</strong>
                            <span>Monitoring</span>
                        </div>

                        <div>
                            <strong>99.9%</strong>
                            <span>Visibility</span>
                        </div>

                        <div>
                            <strong>AI</strong>
                            <span>Insights</span>
                        </div>

                    </div>

                </div>


                {/* HERO VISUAL */}
                <div className="factory-visual">

                    <div className="visual-glow"></div>

                    <div className="dashboard-preview">

                        <div className="preview-header">

                            <div>
                                <span className="mini-dot"></span>
                                FACTORY LIVE
                            </div>

                            <span>09:42:18</span>

                        </div>

                        <div className="preview-title">
                            Factory Overview
                        </div>

                        <div className="preview-cards">

                            <div className="preview-card">
                                <Cpu size={18} />
                                <small>Machines</small>
                                <strong>42</strong>
                                <span className="green-text">38 Running</span>
                            </div>

                            <div className="preview-card">
                                <BarChart3 size={18} />
                                <small>Efficiency</small>
                                <strong>86.4%</strong>
                                <span className="green-text">+4.8%</span>
                            </div>

                            <div className="preview-card warning-card">
                                <Activity size={18} />
                                <small>Alerts</small>
                                <strong>07</strong>
                                <span className="yellow-text">Requires attention</span>
                            </div>

                        </div>

                        <div className="preview-chart">

                            <div className="chart-heading">
                                <span>Production Output</span>
                                <span>Last 7 Days</span>
                            </div>

                            <div className="fake-chart">
                                <div style={{ height: "45%" }}></div>
                                <div style={{ height: "60%" }}></div>
                                <div style={{ height: "52%" }}></div>
                                <div style={{ height: "75%" }}></div>
                                <div style={{ height: "68%" }}></div>
                                <div style={{ height: "88%" }}></div>
                                <div style={{ height: "96%" }}></div>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* FEATURES */}
            <section className="features-section" id="features">

                <div className="section-heading">

                    <div className="section-label">
                        CORE CAPABILITIES
                    </div>

                    <h2>
                        Everything your factory needs.
                    </h2>

                    <p>
                        One intelligent platform for monitoring, managing and
                        optimizing modern manufacturing operations.
                    </p>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            <Activity />
                        </div>

                        <h3>Machine Monitoring</h3>

                        <p>
                            Monitor machine health, temperature, vibration, RPM,
                            power consumption and operational status.
                        </p>

                        <span className="feature-link">
              Explore Monitoring →
            </span>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <BarChart3 />
                        </div>

                        <h3>Production Analytics</h3>

                        <p>
                            Track production targets, efficiency, downtime,
                            quality and OEE through interactive analytics.
                        </p>

                        <span className="feature-link">
              Explore Analytics →
            </span>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <Wrench />
                        </div>

                        <h3>Predictive Maintenance</h3>

                        <p>
                            Detect abnormal machine conditions and identify
                            maintenance risks before failures occur.
                        </p>

                        <span className="feature-link">
              Explore Maintenance →
            </span>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <BrainCircuit />
                        </div>

                        <h3>AI Factory Assistant</h3>

                        <p>
                            Ask natural-language questions about machines,
                            production, maintenance and factory operations.
                        </p>

                        <span className="feature-link">
              Explore AI →
            </span>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <ShieldCheck />
                        </div>

                        <h3>Enterprise Security</h3>

                        <p>
                            JWT authentication and role-based access control
                            for administrators, managers and factory teams.
                        </p>

                        <span className="feature-link">
              Explore Security →
            </span>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            <Factory />
                        </div>

                        <h3>Smart Operations</h3>

                        <p>
                            Manage inventory, quality, incidents, alerts and
                            factory operations from one centralized platform.
                        </p>

                        <span className="feature-link">
              Explore Operations →
            </span>

                    </div>

                </div>

            </section>


            {/* AI SECTION */}
            <section className="ai-section" id="intelligence">

                <div className="ai-content">

                    <div className="section-label">
                        FACTORYX INTELLIGENCE
                    </div>

                    <h2>
                        Your factory data.
                        <br />
                        <span>One intelligent conversation.</span>
                    </h2>

                    <p>
                        FACTORYX AI combines operational data with factory
                        documents and manuals to provide contextual answers
                        using AI and Retrieval-Augmented Generation.
                    </p>

                    <div className="ai-points">

                        <div>
                            <BrainCircuit />
                            <span>Spring AI powered assistant</span>
                        </div>

                        <div>
                            <BrainCircuit />
                            <span>RAG-based document intelligence</span>
                        </div>

                        <div>
                            <BrainCircuit />
                            <span>Factory data analysis</span>
                        </div>

                    </div>

                </div>


                <div className="ai-chat-preview">

                    <div className="chat-header">
                        <div className="ai-avatar">
                            <BrainCircuit size={19} />
                        </div>

                        <div>
                            <strong>FACTORYX AI</strong>
                            <small>Factory Intelligence Assistant</small>
                        </div>

                        <span className="online-dot"></span>
                    </div>


                    <div className="chat-body">

                        <div className="user-message">
                            Which machines need attention today?
                        </div>

                        <div className="ai-message">

                            <strong>AI Analysis</strong>

                            <p>
                                I found 3 machines requiring attention.
                            </p>

                            <div className="machine-alert">
                                <span>CNC-102</span>
                                <b>HIGH</b>
                            </div>

                            <div className="machine-alert">
                                <span>MILL-201</span>
                                <b>MEDIUM</b>
                            </div>

                            <div className="machine-alert">
                                <span>LATHE-301</span>
                                <b>LOW</b>
                            </div>

                        </div>

                    </div>

                    <div className="chat-input">
                        Ask FACTORYX AI anything...
                        <ArrowRight size={17} />
                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="cta-section" id="about">

                <div>

                    <div className="section-label">
                        THE FUTURE OF MANUFACTURING
                    </div>

                    <h2>
                        Turn factory data into
                        <span> intelligent action.</span>
                    </h2>

                    <p>
                        Monitor. Analyze. Predict. Improve.
                    </p>

                    <Link to="/register" className="primary-btn">
                        Start Building
                        <ArrowRight size={18} />
                    </Link>

                </div>

            </section>


            {/* FOOTER */}
            <footer className="footer">

                <div className="logo">
                    <div className="logo-icon">
                        <Factory size={20} />
                    </div>

                    FACTORY<span>X</span>
                </div>

                <p>
                    © 2026 FACTORYX AI. Smart Manufacturing Intelligence.
                </p>

            </footer>

        </div>
    );
}

export default Home;