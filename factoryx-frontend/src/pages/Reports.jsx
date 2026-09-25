import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "../reports.css";

import {
    Activity,
    AlertTriangle,
    BarChart3,
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    Download,
    Factory,
    FileBarChart,
    FileText,
    Gauge,
    Package,
    Search,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Wrench,
    X,
    Eye,
} from "lucide-react";


const API_URL =
    "http://localhost:8081/api/reports";


const getToken = () => {
    return localStorage.getItem("token");
};


const getReportIcon = (category) => {

    switch (category) {

        case "Production":
            return TrendingUp;

        case "Machines":
            return Gauge;

        case "Maintenance":
            return Wrench;

        case "Quality":
            return CheckCircle2;

        case "Incidents":
            return AlertTriangle;

        case "Inventory":
            return Package;

        default:
            return FileBarChart;
    }
};


function Reports() {

    // =========================================================
    // STATE
    // =========================================================

    const [reports, setReports] =
        useState([]);

    const [stats, setStats] =
        useState({
            totalReports: 0,
            production: 0,
            quality: 0,
            aiReports: 0,
        });

    const [sourceCounts, setSourceCounts] =
        useState({
            machines: 0,
            production: 0,
            maintenance: 0,
            inventory: 0,
            quality: 0,
            incidents: 0,
        });

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("All Reports");

    const [selectedReport, setSelectedReport] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // AI REPORT STATE
    // =========================================================

    const [aiReport, setAiReport] =
        useState("");

    const [showAIReport, setShowAIReport] =
        useState(false);

    const [aiLoading, setAiLoading] =
        useState(false);

    const [aiError, setAiError] =
        useState("");


    // =========================================================
    // LOAD REPORTS
    // =========================================================

    const loadReports = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                getToken();


            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }


            const response =
                await fetch(
                    API_URL,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            if (!response.ok) {

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    throw new Error(
                        "Authentication failed. Please login again."
                    );
                }


                throw new Error(
                    "Failed to load reports."
                );
            }


            const data =
                await response.json();


            // =================================================
            // REPORTS
            // =================================================

            const apiReports =
                Array.isArray(data.reports)
                    ? data.reports
                    : [];


            const formattedReports =
                apiReports.map(
                    (report) => ({

                        ...report,

                        icon:
                            getReportIcon(
                                report.category
                            ),

                    })
                );


            setReports(
                formattedReports
            );


            // =================================================
            // STATS
            // =================================================

            if (data.stats) {

                setStats({
                    totalReports:
                        Number(
                            data.stats.totalReports ||
                            0
                        ),

                    production:
                        Number(
                            data.stats.production ||
                            0
                        ),

                    quality:
                        Number(
                            data.stats.quality ||
                            0
                        ),

                    aiReports:
                        Number(
                            data.stats.aiReports ||
                            0
                        ),
                });
            }


            // =================================================
            // SOURCE COUNTS
            // =================================================

            if (data.sourceCounts) {

                setSourceCounts({

                    machines:
                        Number(
                            data.sourceCounts.machines ||
                            0
                        ),

                    production:
                        Number(
                            data.sourceCounts.production ||
                            0
                        ),

                    maintenance:
                        Number(
                            data.sourceCounts.maintenance ||
                            0
                        ),

                    inventory:
                        Number(
                            data.sourceCounts.inventory ||
                            0
                        ),

                    quality:
                        Number(
                            data.sourceCounts.quality ||
                            0
                        ),

                    incidents:
                        Number(
                            data.sourceCounts.incidents ||
                            0
                        ),
                });
            }


        } catch (err) {

            console.error(
                "Reports API Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load reports."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // LOAD ON PAGE OPEN
    // =========================================================

    useEffect(() => {

        loadReports();

    }, []);


    // =========================================================
    // FILTER
    // =========================================================

    const filteredReports =
        useMemo(() => {

            return reports.filter(
                (report) => {

                    const searchText =
                        search
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        (
                            report.title ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            ) ||

                        (
                            report.id ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            );


                    const matchesCategory =
                        category ===
                        "All Reports" ||
                        report.category ===
                        category;


                    return (
                        matchesSearch &&
                        matchesCategory
                    );
                }
            );

        }, [
            reports,
            search,
            category,
        ]);


    // =========================================================
    // DOWNLOAD NORMAL REPORT
    // =========================================================

    const handleDownload = (report) => {

        if (!report) {
            return;
        }


        const reportContent = `
FACTORYX SMART FACTORY
${report.title}

Report ID: ${report.id}
Category: ${report.category}
Period: ${report.period}
Status: ${report.status}

FACTORY DATA
------------

Machines Records:
${sourceCounts.machines}

Production Records:
${sourceCounts.production}

Maintenance Records:
${sourceCounts.maintenance}

Inventory Records:
${sourceCounts.inventory}

Quality Inspections:
${sourceCounts.quality}

Incidents:
${sourceCounts.incidents}


AI SUMMARY
----------

FactoryX operational data has been
successfully collected from the system.

This report is generated by FactoryX.
        `.trim();


        const blob =
            new Blob(
                [reportContent],
                {
                    type:
                        "text/plain",
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            `${report.title.replaceAll(
                " ",
                "_"
            )}.txt`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );
    };


    // =========================================================
    // GENERATE AI REPORT
    // =========================================================

    const handleGenerateAIReport = async () => {

        try {

            setAiLoading(true);
            setAiError("");
            setAiReport("");


            const token =
                getToken();


            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }


            const response =
                await fetch(
                    `${API_URL}/ai-generate`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );


            if (!response.ok) {

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    throw new Error(
                        "Authentication failed. Please login again."
                    );
                }


                throw new Error(
                    "Failed to generate AI report."
                );
            }


            const data =
                await response.json();


            if (
                !data.success ||
                !data.report
            ) {

                throw new Error(
                    data.message ||
                    "AI report could not be generated."
                );
            }


            setAiReport(
                data.report
            );


            setShowAIReport(
                true
            );


            // Update AI report counter
            setStats(
                (previous) => ({
                    ...previous,

                    aiReports:
                        previous.aiReports + 1,
                })
            );


        } catch (err) {

            console.error(
                "AI Report Error:",
                err
            );


            setAiError(
                err.message ||
                "Unable to generate AI report."
            );

        } finally {

            setAiLoading(false);
        }
    };


    // =========================================================
    // DOWNLOAD AI REPORT
    // =========================================================

    const handleDownloadAIReport = () => {

        if (!aiReport) {
            return;
        }


        const reportContent = `
FACTORYX AI SMART FACTORY REPORT

Generated by FactoryX AI
Generated Date: ${new Date().toLocaleString()}

==================================================

${aiReport}

==================================================

FactoryX Smart Factory Management System
        `.trim();


        const blob =
            new Blob(
                [reportContent],
                {
                    type:
                        "text/plain",
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "FactoryX_AI_Factory_Report.txt";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );
    };


    return (

        <div className="reports-page">


            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="reports-sidebar">


                <div className="reports-logo">

                    <div className="reports-logo-icon">
                        <Factory size={23} />
                    </div>

                    <div className="reports-logo-text">

                        <strong>
                            FACTORYX
                        </strong>

                        <span>
                            SMART FACTORY
                        </span>

                    </div>

                </div>


                <div className="reports-menu">


                    <p className="reports-menu-title">
                        MAIN
                    </p>


                    <Link
                        to="/dashboard"
                        className="reports-menu-item"
                    >
                        <BarChart3 size={18} />
                        <span>
                            Dashboard
                        </span>
                    </Link>


                    <Link
                        to="/dashboard"
                        className="reports-menu-item"
                    >
                        <Factory size={18} />

                        <span>
                            Factory
                        </span>

                        <ChevronDown
                            size={14}
                            className="reports-arrow"
                        />
                    </Link>


                    <Link
                        to="/machines"
                        className="reports-menu-item"
                    >
                        <Gauge size={18} />
                        <span>
                            Machines
                        </span>
                    </Link>


                    <Link
                        to="/production"
                        className="reports-menu-item"
                    >
                        <TrendingUp size={18} />
                        <span>
                            Production
                        </span>
                    </Link>


                    <p className="reports-menu-title reports-operation">
                        OPERATIONS
                    </p>


                    <Link
                        to="/maintenance"
                        className="reports-menu-item"
                    >
                        <Wrench size={18} />
                        <span>
                            Maintenance
                        </span>
                    </Link>


                    <Link
                        to="/inventory"
                        className="reports-menu-item"
                    >
                        <Package size={18} />
                        <span>
                            Inventory
                        </span>
                    </Link>


                    <Link
                        to="/quality"
                        className="reports-menu-item"
                    >
                        <CheckCircle2 size={18} />
                        <span>
                            Quality
                        </span>
                    </Link>


                    <Link
                        to="/incidents"
                        className="reports-menu-item"
                    >
                        <AlertTriangle size={18} />
                        <span>
                            Incidents
                        </span>
                    </Link>


                    <p className="reports-menu-title reports-operation">
                        INTELLIGENCE
                    </p>


                    <Link
                        to="/ai-assistant"
                        className="reports-menu-item"
                    >
                        <BrainCircuit size={18} />
                        <span>
                            AI Assistant
                        </span>
                    </Link>


                    <Link
                        to="/documents"
                        className="reports-menu-item"
                    >
                        <FileText size={18} />
                        <span>
                            Documents
                        </span>
                    </Link>


                    <Link
                        to="/reports"
                        className="reports-menu-item active"
                    >
                        <FileBarChart size={18} />
                        <span>
                            Reports
                        </span>
                    </Link>

                </div>


                <div className="reports-sidebar-user">

                    <div className="reports-avatar">
                        RK
                    </div>

                    <div className="reports-user-info">

                        <strong>
                            Ravi Kumar
                        </strong>

                        <span>
                            Manager
                        </span>

                    </div>

                    <ChevronDown size={15} />

                </div>

            </aside>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="reports-main">


                {/* TOPBAR */}

                <header className="reports-topbar">


                    <div className="reports-breadcrumb">

                        <span>
                            Intelligence
                        </span>

                        <b>
                            /
                        </b>

                        <strong>
                            Reports
                        </strong>

                    </div>


                    <div className="reports-top-right">


                        <div className="reports-online">

                            <span></span>

                            AI ONLINE

                        </div>


                        <div className="reports-notification">

                            <Activity size={18} />

                            <i>
                                {sourceCounts.incidents}
                            </i>

                        </div>


                        <div className="reports-top-user">

                            <div>
                                RK
                            </div>

                            <span>
                                Ravi Kumar
                            </span>

                        </div>

                    </div>

                </header>


                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <section className="reports-content">


                    {/* HEADER */}

                    <div className="reports-page-header">

                        <div>

                            <span className="reports-eyebrow">
                                FACTORYX INTELLIGENCE
                            </span>

                            <h1>
                                Reports
                            </h1>

                            <p>
                                Analyze factory performance and operational intelligence.
                            </p>

                        </div>


                        <button
                            className="reports-generate-button"
                            type="button"
                            onClick={
                                handleGenerateAIReport
                            }
                            disabled={
                                aiLoading
                            }
                            style={{
                                opacity:
                                    aiLoading
                                        ? 0.65
                                        : 1,

                                cursor:
                                    aiLoading
                                        ? "wait"
                                        : "pointer",
                            }}
                        >

                            <Sparkles
                                size={17}
                            />

                            {aiLoading
                                ? "Generating..."
                                : "Generate AI Report"}

                        </button>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            style={{
                                padding:
                                    "12px 16px",

                                marginBottom:
                                    "18px",

                                borderRadius:
                                    "9px",

                                background:
                                    "rgba(255,70,70,.08)",

                                border:
                                    "1px solid rgba(255,70,70,.25)",

                                color:
                                    "#ff7676",

                                fontSize:
                                    "12px",
                            }}
                        >
                            {error}
                        </div>

                    )}


                    {/* AI ERROR */}

                    {aiError && (

                        <div
                            style={{
                                padding:
                                    "12px 16px",

                                marginBottom:
                                    "18px",

                                borderRadius:
                                    "9px",

                                background:
                                    "rgba(255,70,70,.08)",

                                border:
                                    "1px solid rgba(255,70,70,.25)",

                                color:
                                    "#ff7676",

                                fontSize:
                                    "12px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

                                gap:
                                    "12px",
                            }}
                        >

                            <span>
                                {aiError}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setAiError("")
                                }
                                style={{
                                    background:
                                        "transparent",

                                    border:
                                        "none",

                                    color:
                                        "#ff7676",

                                    cursor:
                                        "pointer",
                                }}
                            >
                                <X size={16} />
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div className="reports-stats">


                        <div className="reports-stat-card">

                            <div className="reports-stat-icon cyan">

                                <FileBarChart size={21} />

                            </div>


                            <div>

                                <span>
                                    Total Reports
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : stats.totalReports}
                                </strong>

                            </div>

                        </div>


                        <div className="reports-stat-card">

                            <div className="reports-stat-icon yellow">

                                <TrendingUp size={21} />

                            </div>


                            <div>

                                <span>
                                    Production
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : stats.production}
                                </strong>

                            </div>

                        </div>


                        <div className="reports-stat-card">

                            <div className="reports-stat-icon green">

                                <CheckCircle2 size={21} />

                            </div>


                            <div>

                                <span>
                                    Quality Reports
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : stats.quality}
                                </strong>

                            </div>

                        </div>


                        <div className="reports-stat-card">

                            <div className="reports-stat-icon purple">

                                <BrainCircuit size={21} />

                            </div>


                            <div>

                                <span>
                                    AI Reports
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : stats.aiReports}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FILTER
                    ================================================= */}

                    <div className="reports-filter">


                        <div className="reports-search">

                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <select
                            className="reports-select"

                            value={
                                category
                            }

                            onChange={(e) =>
                                setCategory(
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                All Reports
                            </option>

                            <option>
                                Production
                            </option>

                            <option>
                                Machines
                            </option>

                            <option>
                                Maintenance
                            </option>

                            <option>
                                Quality
                            </option>

                            <option>
                                Incidents
                            </option>

                            <option>
                                Inventory
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        REPORT TABLE
                    ================================================= */}

                    <div className="reports-panel">


                        <div className="reports-panel-header">


                            <div>

                                <h2>
                                    Factory Reports
                                </h2>

                                <span>
                                    {loading
                                        ? "Loading reports..."
                                        : `${filteredReports.length} reports available`}
                                </span>

                            </div>


                            <div className="reports-panel-status">

                                <span></span>

                                Reporting System Online

                            </div>

                        </div>


                        {loading ? (

                            <div
                                style={{
                                    padding:
                                        "50px",

                                    textAlign:
                                        "center",

                                    color:
                                        "#789398",

                                    fontSize:
                                        "13px",
                                }}
                            >
                                Loading factory reports...
                            </div>

                        ) : (

                            <div className="reports-table-wrapper">

                                <table className="reports-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            REPORT
                                        </th>

                                        <th>
                                            CATEGORY
                                        </th>

                                        <th>
                                            PERIOD
                                        </th>

                                        <th>
                                            GENERATED
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            ACTIONS
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {filteredReports.map(
                                        (report) => {

                                            const Icon =
                                                report.icon;

                                            return (

                                                <tr
                                                    key={
                                                        report.id
                                                    }
                                                >

                                                    <td>

                                                        <div className="report-name">

                                                            <div className="report-icon">

                                                                <Icon
                                                                    size={18}
                                                                />

                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {
                                                                        report.title
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        report.id
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span className="report-category">

                                                            {
                                                                report.category
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>
                                                        {
                                                            report.period
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            report.generated
                                                        }
                                                    </td>


                                                    <td>

                                                        <span className="report-status">

                                                            <span></span>

                                                            {
                                                                report.status
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="report-actions">

                                                            <button
                                                                type="button"
                                                                title="View Report"
                                                                onClick={() =>
                                                                    setSelectedReport(
                                                                        report
                                                                    )
                                                                }
                                                            >

                                                                <Eye
                                                                    size={17}
                                                                />

                                                            </button>


                                                            <button
                                                                type="button"
                                                                title="Download"
                                                                onClick={() =>
                                                                    handleDownload(
                                                                        report
                                                                    )
                                                                }
                                                            >

                                                                <Download
                                                                    size={17}
                                                                />

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                    </tbody>

                                </table>


                                {filteredReports.length === 0 && (

                                    <div className="reports-empty">

                                        <FileBarChart
                                            size={42}
                                        />

                                        <h3>
                                            No reports found
                                        </h3>

                                        <p>
                                            Try another search or category.
                                        </p>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        AI REPORT CARD
                    ================================================= */}

                    <div className="reports-ai-card">


                        <div className="reports-ai-icon">

                            <BrainCircuit
                                size={25}
                            />

                        </div>


                        <div className="reports-ai-content">

                            <span>
                                FACTORYX AI
                            </span>

                            <h3>
                                AI-Powered Reporting
                            </h3>

                            <p>
                                Generate intelligent factory reports using
                                production, machine, quality, maintenance,
                                inventory and incident data.
                            </p>


                            <div className="reports-ai-points">


                                <div>

                                    <ShieldCheck
                                        size={15}
                                    />

                                    Data-driven analysis

                                </div>


                                <div>

                                    <BrainCircuit
                                        size={15}
                                    />

                                    AI-generated insights

                                </div>


                                <div>

                                    <BarChart3
                                        size={15}
                                    />

                                    Operational analytics

                                </div>

                            </div>

                        </div>


                        <div className="reports-ai-badge">

                            <Sparkles
                                size={15}
                            />

                            AI Ready

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================================
                NORMAL REPORT VIEW MODAL
            ===================================================== */}

            {selectedReport && (

                <div
                    className="reports-modal-overlay"

                    onClick={() =>
                        setSelectedReport(null)
                    }
                >

                    <div
                        className="reports-modal"

                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <button
                            className="reports-modal-close"
                            type="button"

                            onClick={() =>
                                setSelectedReport(null)
                            }
                        >

                            <X size={20} />

                        </button>


                        <div className="reports-modal-icon">

                            <FileBarChart
                                size={24}
                            />

                        </div>


                        <span className="reports-modal-eyebrow">

                            FACTORYX REPORT

                        </span>


                        <h2>
                            {
                                selectedReport.title
                            }
                        </h2>


                        <p>
                            Report ID:{" "}
                            {
                                selectedReport.id
                            }
                        </p>


                        <div className="reports-modal-grid">


                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {
                                        selectedReport.category
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Period
                                </span>

                                <strong>
                                    {
                                        selectedReport.period
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {
                                        selectedReport.status
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Generated
                                </span>

                                <strong>
                                    {
                                        selectedReport.generated
                                    }
                                </strong>

                            </div>

                        </div>


                        <div
                            className="reports-summary"
                        >

                            <BrainCircuit
                                size={18}
                            />


                            <div>

                                <strong>
                                    Factory Data Summary
                                </strong>


                                <p>

                                    Machines:{" "}
                                    {sourceCounts.machines}
                                    <br />

                                    Production Records:{" "}
                                    {sourceCounts.production}
                                    <br />

                                    Maintenance Records:{" "}
                                    {sourceCounts.maintenance}
                                    <br />

                                    Inventory Items:{" "}
                                    {sourceCounts.inventory}
                                    <br />

                                    Quality Inspections:{" "}
                                    {sourceCounts.quality}
                                    <br />

                                    Incidents:{" "}
                                    {sourceCounts.incidents}

                                </p>

                            </div>

                        </div>


                        <button
                            className="reports-modal-download"

                            type="button"

                            onClick={() =>
                                handleDownload(
                                    selectedReport
                                )
                            }
                        >

                            <Download
                                size={17}
                            />

                            Download Report

                        </button>

                    </div>

                </div>

            )}


            {/* =====================================================
                AI REPORT MODAL
            ===================================================== */}

            {showAIReport && (

                <div
                    onClick={() =>
                        setShowAIReport(false)
                    }
                    style={{
                        position:
                            "fixed",

                        inset:
                            0,

                        background:
                            "rgba(0, 10, 12, 0.82)",

                        backdropFilter:
                            "blur(5px)",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        padding:
                            "24px",

                        zIndex:
                            9999,
                    }}
                >

                    <div
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        style={{
                            width:
                                "min(1000px, 94vw)",

                            maxHeight:
                                "88vh",

                            background:
                                "#062b2e",

                            border:
                                "1px solid rgba(61, 220, 210, 0.25)",

                            borderRadius:
                                "16px",

                            boxShadow:
                                "0 25px 80px rgba(0,0,0,.55)",

                            display:
                                "flex",

                            flexDirection:
                                "column",

                            overflow:
                                "hidden",
                        }}
                    >

                        {/* AI MODAL HEADER */}

                        <div
                            style={{
                                padding:
                                    "20px 24px",

                                borderBottom:
                                    "1px solid rgba(255,255,255,.08)",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

                                gap:
                                    "15px",
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "13px",
                                }}
                            >

                                <div
                                    style={{
                                        width:
                                            "44px",

                                        height:
                                            "44px",

                                        borderRadius:
                                            "12px",

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        background:
                                            "rgba(255,211,63,.12)",

                                        color:
                                            "#ffd33f",
                                    }}
                                >
                                    <BrainCircuit
                                        size={23}
                                    />
                                </div>


                                <div>

                                    <span
                                        style={{
                                            display:
                                                "block",

                                            color:
                                                "#ffd33f",

                                            fontSize:
                                                "10px",

                                            fontWeight:
                                                800,

                                            letterSpacing:
                                                "1.4px",
                                        }}
                                    >
                                        FACTORYX AI
                                    </span>

                                    <h2
                                        style={{
                                            margin:
                                                "3px 0 0",

                                            color:
                                                "#e8f4f4",

                                            fontSize:
                                                "21px",
                                        }}
                                    >
                                        AI Factory Report
                                    </h2>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowAIReport(false)
                                }
                                style={{
                                    width:
                                        "36px",

                                    height:
                                        "36px",

                                    borderRadius:
                                        "9px",

                                    border:
                                        "1px solid rgba(255,255,255,.1)",

                                    background:
                                        "rgba(255,255,255,.04)",

                                    color:
                                        "#9bb1b4",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    cursor:
                                        "pointer",
                                }}
                            >
                                <X size={18} />
                            </button>

                        </div>


                        {/* AI REPORT CONTENT */}

                        <div
                            style={{
                                padding:
                                    "24px",

                                overflowY:
                                    "auto",

                                flex:
                                    1,
                            }}
                        >

                            <div
                                style={{
                                    marginBottom:
                                        "18px",

                                    padding:
                                        "13px 15px",

                                    borderRadius:
                                        "10px",

                                    background:
                                        "rgba(61,220,210,.06)",

                                    border:
                                        "1px solid rgba(61,220,210,.14)",

                                    color:
                                        "#8da8ab",

                                    fontSize:
                                        "12px",

                                    lineHeight:
                                        1.6,
                                }}
                            >

                                <strong
                                    style={{
                                        color:
                                            "#b9d4d6",
                                    }}
                                >
                                    AI-generated from live factory data
                                </strong>

                                <br />

                                This report was generated using the current
                                Machines, Production, Maintenance, Inventory,
                                Quality and Incident data available in FactoryX.

                            </div>


                            <div
                                style={{
                                    whiteSpace:
                                        "pre-wrap",

                                    color:
                                        "#d5e5e6",

                                    fontSize:
                                        "13px",

                                    lineHeight:
                                        1.75,

                                    fontFamily:
                                        "Inter, Arial, sans-serif",
                                }}
                            >
                                {aiReport}
                            </div>

                        </div>


                        {/* AI MODAL FOOTER */}

                        <div
                            style={{
                                padding:
                                    "16px 24px",

                                borderTop:
                                    "1px solid rgba(255,255,255,.08)",

                                display:
                                    "flex",

                                justifyContent:
                                    "flex-end",

                                gap:
                                    "10px",
                            }}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAIReport(false)
                                }
                                style={{
                                    padding:
                                        "10px 17px",

                                    borderRadius:
                                        "9px",

                                    border:
                                        "1px solid rgba(255,255,255,.12)",

                                    background:
                                        "rgba(255,255,255,.04)",

                                    color:
                                        "#a9bec0",

                                    cursor:
                                        "pointer",

                                    fontSize:
                                        "12px",

                                    fontWeight:
                                        600,
                                }}
                            >
                                Close
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleDownloadAIReport
                                }
                                style={{
                                    padding:
                                        "10px 17px",

                                    borderRadius:
                                        "9px",

                                    border:
                                        "none",

                                    background:
                                        "#ffd33f",

                                    color:
                                        "#172000",

                                    cursor:
                                        "pointer",

                                    fontSize:
                                        "12px",

                                    fontWeight:
                                        800,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "7px",
                                }}
                            >

                                <Download
                                    size={16}
                                />

                                Download AI Report

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Reports;