import React, { useEffect, useRef, useState } from "react";
import "../dashboard.css";

import {
    Activity,
    AlertTriangle,
    Bell,
    BrainCircuit,
    ChevronDown,
    Factory,
    Gauge,
    LayoutDashboard,
    Package,
    TrendingUp,
    Wrench,
    CheckCircle2,
    CircleAlert,
    CalendarDays,
    LogOut,
    User,
    RefreshCw,
    FileText,
    BarChart3,
    X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:8081/api";

const Dashboard = () => {

    const navigate = useNavigate();

    const [machines, setMachines] = useState([]);
    const [production, setProduction] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [quality, setQuality] = useState([]);
    const [incidents, setIncidents] = useState([]);

    const [period, setPeriod] = useState("This Week");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [showUserMenu, setShowUserMenu] =
        useState(false);

    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);


    /* =====================================================
       LOAD DATA
    ===================================================== */

    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }


            const headers = {
                Authorization:
                    `Bearer ${token}`,
            };


            const responses = await Promise.all([
                fetch(`${API}/machines`, {
                    headers,
                }),

                fetch(`${API}/production`, {
                    headers,
                }),

                fetch(`${API}/maintenance`, {
                    headers,
                }),

                fetch(`${API}/inventory`, {
                    headers,
                }),

                fetch(`${API}/quality`, {
                    headers,
                }),

                fetch(`${API}/incidents`, {
                    headers,
                }),
            ]);


            if (
                responses.some(
                    (res) =>
                        res.status === 401 ||
                        res.status === 403
                )
            ) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }


            const data = await Promise.all(
                responses.map(
                    async (res) => {

                        if (!res.ok) {
                            return [];
                        }

                        return await res.json();
                    }
                )
            );


            setMachines(
                Array.isArray(data[0])
                    ? data[0]
                    : []
            );

            setProduction(
                Array.isArray(data[1])
                    ? data[1]
                    : []
            );

            setMaintenance(
                Array.isArray(data[2])
                    ? data[2]
                    : []
            );

            setInventory(
                Array.isArray(data[3])
                    ? data[3]
                    : []
            );

            setQuality(
                Array.isArray(data[4])
                    ? data[4]
                    : []
            );

            setIncidents(
                Array.isArray(data[5])
                    ? data[5]
                    : []
            );


        } catch (error) {

            console.error(
                "Dashboard data error:",
                error
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = async () => {

        if (refreshing) {
            return;
        }

        setRefreshing(true);

        await loadDashboard();
    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        localStorage.removeItem("token");

        /*
         * Agar future mein user information
         * localStorage mein save ho to yahan
         * usko bhi remove kar sakte hain.
         */

        setShowUserMenu(false);
        setShowNotifications(false);

        navigate("/login");
    };


    /* =====================================================
       OUTSIDE CLICK + ESCAPE
    ===================================================== */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setShowNotifications(false);
            }


            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(
                    event.target
                )
            ) {
                setShowUserMenu(false);
            }
        };


        const handleEscape = (event) => {

            if (event.key === "Escape") {

                setShowNotifications(false);
                setShowUserMenu(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };

    }, []);


    /* =====================================================
       MACHINE DATA
    ===================================================== */

    const totalMachines =
        machines.length;


    const runningMachines =
        machines.filter(
            (machine) =>
                machine.status
                    ?.toLowerCase() ===
                "running"
        ).length;


    const idleMachines =
        machines.filter(
            (machine) =>
                machine.status
                    ?.toLowerCase() ===
                "idle"
        ).length;


    const attentionMachines =
        machines.filter(
            (machine) => {

                const status =
                    machine.status
                        ?.toLowerCase();

                return (
                    status === "warning" ||
                    status === "critical" ||
                    status === "needs attention"
                );
            }
        ).length;


    /* =====================================================
       PRODUCTION DATA
    ===================================================== */

    const totalOutput =
        production.reduce(
            (total, item) =>
                total +
                Number(
                    item.actualQuantity || 0
                ),
            0
        );


    const totalTarget =
        production.reduce(
            (total, item) =>
                total +
                Number(
                    item.targetQuantity || 0
                ),
            0
        );


    const productionEfficiency =
        totalTarget > 0
            ? (totalOutput / totalTarget) * 100
            : 0;


    /* =====================================================
       QUALITY
    ===================================================== */

    const qualityRate =
        quality.length > 0
            ? quality.reduce(
            (total, item) =>
                total +
                Number(
                    item.qualityScore || 0
                ),
            0
        ) / quality.length
            : 0;


    /* =====================================================
       INCIDENTS
    ===================================================== */

    const activeIncidents =
        incidents.filter(
            (incident) =>
                incident.status
                    ?.toLowerCase() !==
                "resolved"
        );


    /* =====================================================
       INVENTORY ALERTS
    ===================================================== */

    const inventoryAlerts =
        inventory.filter(
            (item) => {

                const status =
                    item.status
                        ?.toLowerCase();

                return (
                    status === "low stock" ||
                    status === "out of stock"
                );
            }
        );


    /* =====================================================
       MAINTENANCE ALERTS
    ===================================================== */

    const maintenanceAlerts =
        maintenance.filter(
            (item) => {

                const status =
                    item.status
                        ?.toLowerCase();

                return (
                    status !== "completed"
                );
            }
        );


    const activeAlerts =
        activeIncidents.length +
        inventoryAlerts.length +
        attentionMachines;


    /* =====================================================
       MACHINE EFFICIENCY
    ===================================================== */

    const averageEfficiency =
        machines.length > 0
            ? machines.reduce(
            (total, machine) =>
                total +
                Number(
                    machine.efficiency || 0
                ),
            0
        ) / machines.length
            : 0;


    /* =====================================================
       CHART
    ===================================================== */

    const chartData =
        production.slice(-7);


    const maxProduction =
        chartData.length > 0
            ? Math.max(
                ...chartData.map(
                    (item) =>
                        Number(
                            item.actualQuantity ||
                            0
                        )
                )
            )
            : 1;


    /* =====================================================
       MACHINE STATUS
    ===================================================== */

    const getStatusClass = (status) => {

        const value =
            status?.toLowerCase();


        if (value === "running") {
            return "running";
        }


        if (
            value === "warning" ||
            value === "needs attention"
        ) {
            return "warning";
        }


        if (value === "critical") {
            return "critical";
        }


        return "idle";
    };


    /* =====================================================
       ALERTS
    ===================================================== */

    const alerts = [

        ...activeIncidents
            .slice(0, 3)
            .map((incident) => ({
                title:
                    incident.issue ||
                    incident.title ||
                    "Factory Incident",

                machine:
                    incident.machine ||
                    "Factory",

                priority:
                    incident.priority ||
                    incident.status ||
                    "Warning",

                type:
                    incident.priority
                        ?.toLowerCase() ===
                    "critical"
                        ? "critical"
                        : "warning",

                link:
                    "/incidents",
            })),


        ...maintenanceAlerts
            .slice(0, 2)
            .map((item) => ({
                title:
                    item.issue ||
                    "Maintenance Required",

                machine:
                    item.machine ||
                    "Machine",

                priority:
                    item.priority ||
                    item.status ||
                    "Maintenance",

                type:
                    item.priority
                        ?.toLowerCase() ===
                    "critical"
                        ? "critical"
                        : "warning",

                link:
                    "/maintenance",
            })),


        ...inventoryAlerts
            .slice(0, 2)
            .map((item) => ({
                title:
                    `Low Inventory - ${
                        item.itemName
                    }`,

                machine:
                item.itemCode,

                priority:
                item.status,

                type:
                    "warning",

                link:
                    "/inventory",
            })),

    ].slice(0, 5);


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="dashboard-layout">

                <main
                    className="dashboard-main"
                    style={{
                        marginLeft: 0,
                        width: "100%",
                    }}
                >

                    <div
                        style={{
                            minHeight: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#8fa7a9",
                            background: "#031a1d",
                            fontSize: "14px",
                        }}
                    >
                        Loading FactoryX Dashboard...
                    </div>

                </main>

            </div>
        );
    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="dashboard-layout">


            {/* =================================================
               SIDEBAR
            ================================================= */}

            <aside className="dashboard-sidebar">


                {/* LOGO */}

                <div className="sidebar-logo">

                    <div className="sidebar-logo-icon">
                        <Factory size={25} />
                    </div>

                    <div>
                        FACTORY<span>X</span>
                    </div>

                </div>


                {/* MAIN */}

                <div className="sidebar-section">

                    <p className="sidebar-label">
                        MAIN
                    </p>


                    <Link
                        to="/dashboard"
                        className="sidebar-link active"
                    >
                        <LayoutDashboard size={20} />
                        <span>
                            Dashboard
                        </span>
                    </Link>


                    <Link
                        to="/machines"
                        className="sidebar-link"
                    >
                        <Factory size={20} />
                        <span>
                            Machines
                        </span>
                    </Link>


                    <Link
                        to="/production"
                        className="sidebar-link"
                    >
                        <TrendingUp size={20} />
                        <span>
                            Production
                        </span>
                    </Link>

                </div>


                {/* OPERATIONS */}

                <div className="sidebar-section">

                    <p className="sidebar-label">
                        OPERATIONS
                    </p>


                    <Link
                        to="/maintenance"
                        className="sidebar-link"
                    >
                        <Wrench size={20} />
                        <span>
                            Maintenance
                        </span>
                    </Link>


                    <Link
                        to="/inventory"
                        className="sidebar-link"
                    >
                        <Package size={20} />
                        <span>
                            Inventory
                        </span>
                    </Link>


                    <Link
                        to="/quality"
                        className="sidebar-link"
                    >
                        <CheckCircle2 size={20} />
                        <span>
                            Quality
                        </span>
                    </Link>


                    <Link
                        to="/incidents"
                        className="sidebar-link"
                    >
                        <AlertTriangle size={20} />
                        <span>
                            Incidents
                        </span>
                    </Link>

                </div>


                {/* INTELLIGENCE */}

                <div className="sidebar-section">

                    <p className="sidebar-label">
                        INTELLIGENCE
                    </p>


                    <Link
                        to="/ai-assistant"
                        className="sidebar-link ai-link"
                    >
                        <BrainCircuit size={20} />
                        <span>
                            AI Assistant
                        </span>
                    </Link>


                    <Link
                        to="/documents"
                        className="sidebar-link"
                    >
                        <FileText size={20} />
                        <span>
                            Documents
                        </span>
                    </Link>


                    <Link
                        to="/reports"
                        className="sidebar-link"
                    >
                        <BarChart3 size={20} />
                        <span>
                            Reports
                        </span>
                    </Link>

                </div>


                {/* BOTTOM USER */}

                <div className="sidebar-bottom">

                    <div className="sidebar-user">

                        <div className="user-avatar">
                            RK
                        </div>

                        <div className="user-info">

                            <strong>
                                Ravi Kumar
                            </strong>

                            <span>
                                Factory Manager
                            </span>

                        </div>

                    </div>

                </div>

            </aside>


            {/* =================================================
               MAIN
            ================================================= */}

            <main className="dashboard-main">


                {/* TOPBAR */}

                <header className="dashboard-topbar">


                    <div className="mobile-brand">

                        <Factory size={20} />

                        FACTORY
                        <span>X</span>

                    </div>


                    <div className="breadcrumb">

                        <div>
                            Factory
                        </div>

                        <span>
                            /
                        </span>

                        <strong>
                            Dashboard
                        </strong>

                    </div>


                    <div className="topbar-right">


                        {/* REFRESH */}

                        <button
                            type="button"
                            className="dashboard-refresh-btn"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            title="Refresh dashboard"
                            aria-label="Refresh dashboard"
                        >

                            <RefreshCw
                                size={18}
                                className={
                                    refreshing
                                        ? "refresh-spinning"
                                        : ""
                                }
                            />

                        </button>


                        {/* =================================================
                           NOTIFICATION
                        ================================================= */}

                        <div
                            className="dashboard-dropdown-wrapper"
                            ref={notificationRef}
                        >

                            <button
                                type="button"
                                className="notification-btn"
                                onClick={() => {

                                    setShowNotifications(
                                        (value) =>
                                            !value
                                    );

                                    setShowUserMenu(
                                        false
                                    );
                                }}
                                aria-label="Notifications"
                                aria-expanded={
                                    showNotifications
                                }
                            >

                                <Bell size={22} />

                                {activeAlerts > 0 && (

                                    <span className="notification-count">
                                        {activeAlerts > 99
                                            ? "99+"
                                            : activeAlerts}
                                    </span>

                                )}

                            </button>


                            {/* NOTIFICATION DROPDOWN */}

                            {showNotifications && (

                                <div className="dashboard-notification-panel">


                                    <div className="dashboard-dropdown-header">

                                        <div>

                                            <strong>
                                                Notifications
                                            </strong>

                                            <span>
                                                {activeAlerts} active alerts
                                            </span>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNotifications(
                                                    false
                                                )
                                            }
                                            aria-label="Close notifications"
                                        >
                                            <X size={15} />
                                        </button>

                                    </div>


                                    <div className="dashboard-notification-list">

                                        {alerts.length > 0 ? (

                                            alerts.map(
                                                (
                                                    alert,
                                                    index
                                                ) => (

                                                    <Link
                                                        to={
                                                            alert.link
                                                        }
                                                        className="dashboard-notification-item"
                                                        key={
                                                            index
                                                        }
                                                        onClick={() =>
                                                            setShowNotifications(
                                                                false
                                                            )
                                                        }
                                                    >

                                                        <div
                                                            className={`dashboard-notification-icon ${
                                                                alert.type ===
                                                                "critical"
                                                                    ? "critical"
                                                                    : "warning"
                                                            }`}
                                                        >

                                                            <AlertTriangle
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {
                                                                    alert.title
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    alert.machine
                                                                }
                                                            </span>

                                                            <small>
                                                                {
                                                                    alert.priority
                                                                }
                                                            </small>

                                                        </div>

                                                    </Link>

                                                )
                                            )

                                        ) : (

                                            <div className="dashboard-no-notifications">

                                                <CheckCircle2
                                                    size={22}
                                                />

                                                <span>
                                                    No active alerts
                                                </span>

                                            </div>

                                        )}

                                    </div>


                                    <Link
                                        to="/incidents"
                                        className="dashboard-notification-footer"
                                        onClick={() =>
                                            setShowNotifications(
                                                false
                                            )
                                        }
                                    >
                                        View all alerts
                                    </Link>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                           USER MENU
                        ================================================= */}

                        <div
                            className="dashboard-dropdown-wrapper"
                            ref={userMenuRef}
                        >

                            <button
                                type="button"
                                className="top-user dashboard-user-button"
                                onClick={() => {

                                    setShowUserMenu(
                                        (value) =>
                                            !value
                                    );

                                    setShowNotifications(
                                        false
                                    );
                                }}
                                aria-expanded={
                                    showUserMenu
                                }
                            >

                                <div className="top-avatar">
                                    RK
                                </div>

                                <div className="dashboard-user-text">

                                    <strong>
                                        Ravi Kumar
                                    </strong>

                                    <span>
                                        Factory Manager
                                    </span>

                                </div>

                                <ChevronDown
                                    size={16}
                                    className={
                                        showUserMenu
                                            ? "user-chevron-open"
                                            : ""
                                    }
                                />

                            </button>


                            {/* USER DROPDOWN */}

                            {showUserMenu && (

                                <div className="dashboard-user-menu">


                                    <div className="dashboard-user-menu-profile">

                                        <div className="top-avatar">
                                            RK
                                        </div>

                                        <div>

                                            <strong>
                                                Ravi Kumar
                                            </strong>

                                            <span>
                                                Factory Manager
                                            </span>

                                        </div>

                                    </div>


                                    <div className="dashboard-user-menu-divider" />


                                    <button
                                        type="button"
                                        className="dashboard-user-menu-item"
                                        onClick={() =>
                                            setShowUserMenu(
                                                false
                                            )
                                        }
                                    >

                                        <User size={17} />

                                        <span>
                                            My Profile
                                        </span>

                                    </button>


                                    <button
                                        type="button"
                                        className="dashboard-user-menu-item logout-item"
                                        onClick={
                                            handleLogout
                                        }
                                    >

                                        <LogOut size={17} />

                                        <span>
                                            Logout
                                        </span>

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </header>


                {/* =================================================
                   CONTENT
                ================================================= */}

                <section className="dashboard-content">


                    {/* HEADING */}

                    <div className="dashboard-heading">

                        <div>

                            <p className="dashboard-eyebrow">
                                FACTORY OVERVIEW
                            </p>

                            <h1>
                                Dashboard
                            </h1>

                            <p>
                                Monitor and manage all factory operations in real time.
                            </p>

                        </div>


                        <div className="dashboard-date">

                            <CalendarDays
                                size={16}
                            />

                            <span />

                            Live Monitoring

                        </div>

                    </div>


                    {/* =================================================
                       KPI
                    ================================================= */}

                    <div className="kpi-grid">


                        <Link
                            to="/machines"
                            className="kpi-card dashboard-card-link"
                        >

                            <div className="kpi-top">

                                <div className="kpi-icon">
                                    <Factory size={21} />
                                </div>

                                <span className="kpi-trend positive">
                                    LIVE
                                </span>

                            </div>

                            <p>
                                Total Machines
                            </p>

                            <h2>
                                {totalMachines}
                            </h2>

                            <span className="kpi-description">
                                {runningMachines} running · {idleMachines} idle
                            </span>

                        </Link>


                        <Link
                            to="/production"
                            className="kpi-card dashboard-card-link"
                        >

                            <div className="kpi-top">

                                <div className="kpi-icon">
                                    <TrendingUp size={21} />
                                </div>

                                <span className="kpi-trend positive">
                                    OUTPUT
                                </span>

                            </div>

                            <p>
                                Production Output
                            </p>

                            <h2>
                                {totalOutput.toLocaleString()}
                            </h2>

                            <span className="kpi-description">
                                Total actual production
                            </span>

                        </Link>


                        <Link
                            to="/production"
                            className="kpi-card dashboard-card-link"
                        >

                            <div className="kpi-top">

                                <div className="kpi-icon">
                                    <Gauge size={21} />
                                </div>

                                <span className="kpi-trend positive">
                                    {runningMachines} RUNNING
                                </span>

                            </div>

                            <p>
                                Overall Efficiency
                            </p>

                            <h2>
                                {productionEfficiency.toFixed(1)}%
                            </h2>

                            <span className="kpi-description">
                                Production efficiency
                            </span>

                        </Link>


                        <Link
                            to="/incidents"
                            className="kpi-card dashboard-card-link"
                        >

                            <div className="kpi-top">

                                <div className="kpi-icon alert-icon">
                                    <AlertTriangle size={21} />
                                </div>

                                <span className="kpi-trend warning">
                                    ATTENTION
                                </span>

                            </div>

                            <p>
                                Active Alerts
                            </p>

                            <h2>
                                {activeAlerts}
                            </h2>

                            <span className="kpi-description">
                                Issues requiring attention
                            </span>

                        </Link>

                    </div>


                    {/* =================================================
                       PRODUCTION + PERFORMANCE
                    ================================================= */}

                    <div className="dashboard-grid">


                        {/* PRODUCTION */}

                        <div className="dashboard-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Production Overview
                                    </h3>

                                    <p>
                                        Daily production output
                                    </p>

                                </div>


                                <select
                                    value={period}
                                    onChange={(e) =>
                                        setPeriod(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option>
                                        This Week
                                    </option>

                                    <option>
                                        This Month
                                    </option>

                                    <option>
                                        Last 7 Days
                                    </option>

                                </select>

                            </div>


                            <div className="production-chart">

                                <div className="chart-y-axis">

                                    <span>
                                        100%
                                    </span>

                                    <span>
                                        80%
                                    </span>

                                    <span>
                                        60%
                                    </span>

                                    <span>
                                        40%
                                    </span>

                                    <span>
                                        20%
                                    </span>

                                    <span>
                                        0
                                    </span>

                                </div>


                                <div className="chart-area">

                                    <div className="chart-grid-line line-1" />
                                    <div className="chart-grid-line line-2" />
                                    <div className="chart-grid-line line-3" />
                                    <div className="chart-grid-line line-4" />
                                    <div className="chart-grid-line line-5" />


                                    <div className="chart-bars">

                                        {chartData.length > 0 ? (

                                            chartData.map(
                                                (
                                                    item,
                                                    index
                                                ) => {

                                                    const value =
                                                        Number(
                                                            item.actualQuantity ||
                                                            0
                                                        );

                                                    const height =
                                                        (
                                                            value /
                                                            maxProduction
                                                        ) *
                                                        100;


                                                    return (

                                                        <div
                                                            key={
                                                                item.id ||
                                                                index
                                                            }
                                                            className={`bar ${
                                                                index ===
                                                                chartData.length -
                                                                1
                                                                    ? "current"
                                                                    : ""
                                                            }`}
                                                            style={{
                                                                height:
                                                                    `${Math.max(
                                                                        height,
                                                                        8
                                                                    )}%`,
                                                            }}
                                                            title={`Production: ${value}`}
                                                        >

                                                            <span>
                                                                {item.date
                                                                    ? new Date(
                                                                        item.date
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            weekday:
                                                                                "short",
                                                                        }
                                                                    )
                                                                    : `Day ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                            </span>

                                                        </div>

                                                    );
                                                }
                                            )

                                        ) : (

                                            <div
                                                style={{
                                                    color:
                                                        "#687878",
                                                    fontSize:
                                                        "11px",
                                                }}
                                            >
                                                No production data available
                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* PERFORMANCE */}

                        <div className="dashboard-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Factory Performance
                                    </h3>

                                    <p>
                                        Current operational performance
                                    </p>

                                </div>

                            </div>


                            <div className="oee-content">


                                <div
                                    className="oee-circle"
                                    style={{
                                        background:
                                            `conic-gradient(
                                                #ffd343 0deg ${
                                                Math.min(
                                                    averageEfficiency,
                                                    100
                                                ) * 3.6
                                            }deg,
                                                #174346 ${
                                                Math.min(
                                                    averageEfficiency,
                                                    100
                                                ) * 3.6
                                            }deg 360deg
                                            )`,
                                    }}
                                >

                                    <div>

                                        <strong>
                                            {averageEfficiency.toFixed(1)}
                                        </strong>

                                        <span>
                                            %
                                        </span>

                                    </div>

                                </div>


                                <div className="oee-items">

                                    <div>

                                        <span>
                                            Availability
                                        </span>

                                        <strong>
                                            {averageEfficiency.toFixed(1)}%
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Performance
                                        </span>

                                        <strong>
                                            {productionEfficiency.toFixed(1)}%
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Quality
                                        </span>

                                        <strong>
                                            {qualityRate.toFixed(1)}%
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       MACHINE + ALERTS
                    ================================================= */}

                    <div className="dashboard-grid bottom-grid">


                        {/* MACHINE HEALTH */}

                        <div className="dashboard-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Machine Health
                                    </h3>

                                    <p>
                                        Current machine condition
                                    </p>

                                </div>


                                <Link
                                    to="/machines"
                                    className="view-all"
                                >
                                    View All
                                </Link>

                            </div>


                            <div className="machine-list">

                                {machines
                                    .slice(0, 5)
                                    .map(
                                        (machine) => {

                                            const status =
                                                getStatusClass(
                                                    machine.status
                                                );


                                            return (

                                                <Link
                                                    to="/machines"
                                                    className="machine-row dashboard-row-link"
                                                    key={
                                                        machine.id
                                                    }
                                                >

                                                    <div
                                                        className={`machine-status ${status}`}
                                                    >

                                                        <Activity
                                                            size={17}
                                                        />

                                                    </div>


                                                    <div className="machine-details">

                                                        <strong>
                                                            {
                                                                machine.machineCode
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                machine.machineName ||
                                                                machine.type ||
                                                                "Factory Machine"
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="machine-reading">

                                                        <span>
                                                            Temperature
                                                        </span>

                                                        <strong>
                                                            {
                                                                machine.temperature ??
                                                                0
                                                            }°C
                                                        </strong>

                                                    </div>


                                                    <span
                                                        className={`status-badge ${status}-badge`}
                                                    >
                                                        {
                                                            machine.status
                                                        }
                                                    </span>

                                                </Link>

                                            );
                                        }
                                    )}


                                {machines.length === 0 && (

                                    <div className="empty-state">
                                        No machine data available.
                                    </div>

                                )}

                            </div>

                        </div>


                        {/* ALERTS */}

                        <div className="dashboard-panel alerts-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Active Alerts
                                    </h3>

                                    <p>
                                        Items requiring attention
                                    </p>

                                </div>


                                <Link
                                    to="/incidents"
                                    className="view-all"
                                >
                                    View All
                                </Link>

                            </div>


                            <div className="alert-list">

                                {alerts.map(
                                    (
                                        alert,
                                        index
                                    ) => (

                                        <Link
                                            to={
                                                alert.link
                                            }
                                            className={`alert-item ${alert.type}-alert dashboard-alert-link`}
                                            key={
                                                index
                                            }
                                        >

                                            <div className="alert-icon-box">

                                                {alert.type ===
                                                "critical" ? (

                                                    <AlertTriangle
                                                        size={17}
                                                    />

                                                ) : (

                                                    <CircleAlert
                                                        size={17}
                                                    />

                                                )}

                                            </div>


                                            <div>

                                                <strong>
                                                    {
                                                        alert.title
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        alert.machine
                                                    }
                                                </span>

                                                <small>
                                                    {
                                                        alert.priority
                                                    }
                                                </small>

                                            </div>

                                        </Link>

                                    )
                                )}


                                {alerts.length === 0 && (

                                    <div className="alert-item">

                                        <div className="alert-icon-box">

                                            <CheckCircle2
                                                size={17}
                                            />

                                        </div>

                                        <div>

                                            <strong>
                                                No active alerts
                                            </strong>

                                            <span>
                                                Factory operations are normal
                                            </span>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       AI INSIGHT
                    ================================================= */}

                    <div className="ai-insight-card">

                        <div className="ai-insight-icon">

                            <BrainCircuit
                                size={24}
                            />

                        </div>


                        <div className="ai-insight-content">

                            <div className="ai-insight-title">

                                <span>
                                    FACTORYX AI INSIGHT
                                </span>

                                <small>
                                    LIVE ANALYSIS
                                </small>

                            </div>


                            <h3>
                                Factory performance analysis
                            </h3>


                            <p>

                                {attentionMachines > 0

                                    ? `${attentionMachines} machine(s) currently need attention. Review machine health and maintenance activities.`

                                    : "Factory operations are running normally. Production, quality and machine performance are being monitored."
                                }

                            </p>

                        </div>


                        <Link
                            to="/ai-assistant"
                            className="ai-action"
                        >

                            <BrainCircuit
                                size={16}
                            />

                            Ask FactoryX AI

                        </Link>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Dashboard;