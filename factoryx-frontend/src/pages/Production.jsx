import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    Box,
    BrainCircuit,
    ChevronDown,
    Factory,
    Gauge,
    LayoutDashboard,
    Package,
    Settings,
    ShieldCheck,
    Target,
    TrendingUp,
    Wrench,
    X,
    CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

import "../Production.css";


const API_URL = "http://localhost:8081/api/production";


const getToken = () => {
    return localStorage.getItem("token");
};


const Production = () => {

    /* =====================================================
       STATE
    ===================================================== */

    const [productionData, setProductionData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    /* NOTIFICATIONS */
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    /* VIEW ALL RECORDS */
    const [showAllRecords, setShowAllRecords] = useState(false);


    /* CREATE PLAN MODAL */

    const [showPlanModal, setShowPlanModal] =
        useState(false);

    const [planLoading, setPlanLoading] =
        useState(false);

    const [planError, setPlanError] =
        useState("");


    const [productionPlan, setProductionPlan] =
        useState({
            machine: "",
            date: new Date()
                .toISOString()
                .split("T")[0],
            shift: "Morning",
            targetQuantity: "",
            actualQuantity: "",
            defectiveQuantity: "0",
            downtime: "0",
        });


    /* =====================================================
       LOAD PRODUCTION DATA
    ===================================================== */

    const loadProduction = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                setError(
                    "Authentication token not found. Please login again."
                );
                return;
            }


            const response = await fetch(
                API_URL,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {
                localStorage.removeItem("token");

                setError(
                    "Session expired. Please login again."
                );

                return;
            }


            if (!response.ok) {
                throw new Error(
                    "Failed to load production data."
                );
            }


            const data = await response.json();

            setProductionData(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (err) {

            console.error(
                "Production API Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load production data."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadProduction();

    }, []);


    /* =====================================================
       NOTIFICATION DROPDOWN
    ===================================================== */

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };

    }, []);


    /* =====================================================
       CREATE PRODUCTION PLAN
    ===================================================== */

    const createProductionPlan = async (e) => {

        e.preventDefault();

        setPlanError("");


        /* VALIDATION */

        if (!productionPlan.machine.trim()) {

            setPlanError(
                "Machine is required."
            );

            return;
        }


        if (!productionPlan.date) {

            setPlanError(
                "Production date is required."
            );

            return;
        }


        if (!productionPlan.shift) {

            setPlanError(
                "Shift is required."
            );

            return;
        }


        if (
            !productionPlan.targetQuantity ||
            Number(productionPlan.targetQuantity) <= 0
        ) {

            setPlanError(
                "Target quantity must be greater than 0."
            );

            return;
        }


        if (
            Number(productionPlan.actualQuantity || 0) < 0
        ) {

            setPlanError(
                "Actual quantity cannot be negative."
            );

            return;
        }


        if (
            Number(productionPlan.defectiveQuantity || 0) < 0
        ) {

            setPlanError(
                "Defective quantity cannot be negative."
            );

            return;
        }


        if (
            Number(productionPlan.downtime || 0) < 0
        ) {

            setPlanError(
                "Downtime cannot be negative."
            );

            return;
        }


        try {

            setPlanLoading(true);


            const token = getToken();

            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }


            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({

                        machine:
                            productionPlan.machine.trim(),

                        date:
                        productionPlan.date,

                        shift:
                        productionPlan.shift,

                        targetQuantity:
                            Number(
                                productionPlan.targetQuantity
                            ),

                        actualQuantity:
                            Number(
                                productionPlan.actualQuantity || 0
                            ),

                        defectiveQuantity:
                            Number(
                                productionPlan.defectiveQuantity || 0
                            ),

                        downtime:
                            Number(
                                productionPlan.downtime || 0
                            ),
                    }),
                }
            );


            if (
                response.status === 401 ||
                response.status === 403
            ) {

                localStorage.removeItem("token");

                throw new Error(
                    "Session expired. Please login again."
                );
            }


            if (!response.ok) {

                let message =
                    "Failed to create production plan.";

                try {

                    const errorData =
                        await response.json();

                    message =
                        errorData.message ||
                        errorData.error ||
                        message;

                } catch {
                    // Ignore JSON parsing error
                }


                throw new Error(message);
            }


            await response.json();


            /* REFRESH DATA */

            await loadProduction();


            /* RESET FORM */

            setProductionPlan({
                machine: "",
                date: new Date()
                    .toISOString()
                    .split("T")[0],
                shift: "Morning",
                targetQuantity: "",
                actualQuantity: "",
                defectiveQuantity: "0",
                downtime: "0",
            });


            /* CLOSE MODAL */

            setShowPlanModal(false);


        } catch (err) {

            console.error(
                "Create Production Plan Error:",
                err
            );

            setPlanError(
                err.message ||
                "Unable to create production plan."
            );

        } finally {

            setPlanLoading(false);
        }
    };


    /* =====================================================
       DATE
    ===================================================== */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    /* =====================================================
       TODAY DATA
    ===================================================== */

    const todayData = useMemo(() => {

        return productionData.filter(
            (item) =>
                item.date === today
        );

    }, [productionData, today]);


    /* =====================================================
       KPI CALCULATIONS
    ===================================================== */

    const totalOutput = useMemo(() => {

        return todayData.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.actualQuantity || 0
                ),
            0
        );

    }, [todayData]);


    const totalTarget = useMemo(() => {

        return todayData.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.targetQuantity || 0
                ),
            0
        );

    }, [todayData]);


    const efficiency = useMemo(() => {

        if (totalTarget === 0) {
            return 0;
        }

        return (
            (totalOutput / totalTarget) *
            100
        );

    }, [totalOutput, totalTarget]);


    const totalDowntime = useMemo(() => {

        return todayData.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.downtime || 0
                ),
            0
        );

    }, [todayData]);


    const totalDefects = useMemo(() => {

        return todayData.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.defectiveQuantity || 0
                ),
            0
        );

    }, [todayData]);


    const activeMachines = useMemo(() => {

        return new Set(
            todayData
                .map(
                    (item) =>
                        item.machine
                )
                .filter(Boolean)
        ).size;

    }, [todayData]);


    /* =====================================================
       7 DAY CHART
    ===================================================== */

    const chartData = useMemo(() => {

        const days = [];

        for (let i = 6; i >= 0; i--) {

            const date =
                new Date();

            date.setDate(
                date.getDate() - i
            );


            const dateString =
                date.toISOString()
                    .split("T")[0];


            const output =
                productionData
                    .filter(
                        (item) =>
                            item.date ===
                            dateString
                    )
                    .reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.actualQuantity ||
                                0
                            ),
                        0
                    );


            days.push({
                date: dateString,
                label: date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short",
                    }
                ),
                output,
            });

        }


        return days;

    }, [productionData]);


    const maxChartOutput = useMemo(() => {

        const max =
            Math.max(
                ...chartData.map(
                    (item) =>
                        item.output
                ),
                0
            );

        return max || 1;

    }, [chartData]);


    /* =====================================================
       PRODUCTION RECORDS
    ===================================================== */

    const productionRecords = useMemo(() => {

        return [...productionData]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );

    }, [productionData]);


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    const notificationItems = useMemo(() => {

        const items = [];

        items.push({
            title: "Production Update",
            message: productionData.length > 0
                ? `${productionData.length} production record${productionData.length === 1 ? "" : "s"} available.`
                : "No production records have been created yet.",
            icon: "production",
        });

        items.push({
            title: "Efficiency Status",
            message: todayData.length > 0
                ? `Today's production efficiency is ${efficiency.toFixed(1)}%.`
                : "No production data is available for today.",
            icon: "efficiency",
        });

        items.push({
            title: "Downtime Status",
            message: todayData.length > 0
                ? `Today's recorded downtime is ${totalDowntime.toFixed(1)}.`
                : "No downtime has been recorded today.",
            icon: "downtime",
        });

        return items;

    }, [
        productionData.length,
        todayData.length,
        efficiency,
        totalDowntime,
    ]);


    /* =====================================================
       PERFORMANCE
    ===================================================== */

    const availability = useMemo(() => {

        if (todayData.length === 0) {
            return 0;
        }

        const value =
            100 - totalDowntime;

        return Math.max(
            0,
            Math.min(
                100,
                value
            )
        );

    }, [todayData, totalDowntime]);


    const performance = useMemo(() => {

        return Math.max(
            0,
            Math.min(
                100,
                efficiency
            )
        );

    }, [efficiency]);


    const quality = useMemo(() => {

        if (totalOutput === 0) {
            return 0;
        }

        return Math.max(
            0,
            (
                (totalOutput -
                    totalDefects) /
                totalOutput
            ) * 100
        );

    }, [totalOutput, totalDefects]);


    /* =====================================================
       EFFICIENCY CIRCLE
    ===================================================== */

    const efficiencyDegree =
        Math.max(
            0,
            Math.min(
                360,
                (performance / 100) *
                360
            )
        );


    /* =====================================================
       FORMAT NUMBER
    ===================================================== */

    const formatNumber = (value) => {

        return Number(value || 0)
            .toLocaleString("en-IN");

    };


    /* =====================================================
       RECORD STATUS
    ===================================================== */

    const getRecordStatus = (record) => {

        const target =
            Number(
                record.targetQuantity || 0
            );

        const actual =
            Number(
                record.actualQuantity || 0
            );


        if (target === 0) {
            return "Critical";
        }


        const value =
            (actual / target) * 100;


        if (value >= 90) {
            return "Running";
        }


        if (value >= 75) {
            return "Warning";
        }


        return "Critical";
    };


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    const getStatusClass = (status) => {

        if (status === "Running") {
            return "running";
        }

        if (status === "Warning") {
            return "warning";
        }

        return "warning";
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="production-page">

                <aside className="production-sidebar">

                    <div className="production-logo-area">

                        <div className="production-logo-icon">
                            <Factory size={25} />
                        </div>

                        <div className="production-logo-text">
                            FACTORY<span>X</span>
                        </div>

                    </div>

                </aside>


                <main className="production-main">

                    <div className="production-content">

                        <div
                            style={{
                                minHeight: "70vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#8fa7a9",
                            }}
                        >
                            Loading production data...
                        </div>

                    </div>

                </main>

            </div>

        );
    }


    /* =====================================================
       MAIN UI
    ===================================================== */

    return (

        <div className="production-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="production-sidebar">


                {/* LOGO */}

                <div className="production-logo-area">

                    <div className="production-logo-icon">
                        <Factory size={25} />
                    </div>

                    <div className="production-logo-text">
                        FACTORY<span>X</span>
                    </div>

                </div>


                {/* MENU */}

                <div className="production-sidebar-content">


                    <p className="production-menu-title">
                        MAIN
                    </p>


                    <Link
                        to="/dashboard"
                        className="production-menu-item"
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>


                    <Link
                        to="/machines"
                        className="production-menu-item"
                    >
                        <Gauge size={18} />
                        <span>Machines</span>
                    </Link>


                    <p className="production-menu-title operations-title">
                        OPERATIONS
                    </p>


                    <Link
                        to="/production"
                        className="production-menu-item active"
                    >
                        <Activity size={18} />
                        <span>Production</span>
                    </Link>


                    <Link
                        to="/maintenance"
                        className="production-menu-item"
                    >
                        <Wrench size={18} />
                        <span>Maintenance</span>
                    </Link>


                    <Link
                        to="/inventory"
                        className="production-menu-item"
                    >
                        <Package size={18} />
                        <span>Inventory</span>
                    </Link>


                    <Link
                        to="/quality"
                        className="production-menu-item"
                    >
                        <ShieldCheck size={18} />
                        <span>Quality</span>
                    </Link>


                    <Link
                        to="/incidents"
                        className="production-menu-item"
                    >
                        <AlertTriangle size={18} />
                        <span>Incidents</span>
                    </Link>


                    <p className="production-menu-title intelligence-title">
                        INTELLIGENCE
                    </p>


                    <Link
                        to="/ai-assistant"
                        className="production-menu-item production-ai-menu"
                    >
                        <BrainCircuit size={18} />
                        <span>AI Assistant</span>
                    </Link>


                    <Link
                        to="/documents"
                        className="production-menu-item"
                    >
                        <Box size={18} />
                        <span>Documents</span>
                    </Link>


                    <Link
                        to="/reports"
                        className="production-menu-item"
                    >
                        <BarChart3 size={18} />
                        <span>Reports</span>
                    </Link>

                </div>


                {/* BOTTOM */}

                <div className="production-sidebar-bottom">

                    <Link
                        to="/settings"
                        className="production-menu-item"
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                        <ChevronDown
                            size={15}
                            className="production-menu-arrow"
                        />
                    </Link>


                    <div className="production-profile">

                        <div className="production-profile-avatar">
                            RK
                        </div>

                        <div className="production-profile-info">

                            <strong>
                                Factory Admin
                            </strong>

                            <span>
                                Administrator
                            </span>

                        </div>

                    </div>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="production-main">


                {/* TOPBAR */}

                <header className="production-topbar">


                    <div className="production-breadcrumb">

                        <span>
                            FactoryX
                        </span>

                        <b>/</b>

                        <strong>
                            Production
                        </strong>

                    </div>


                    <div className="production-top-right">

                        <div
                            ref={notificationRef}
                            style={{
                                position: "relative",
                            }}
                        >

                            <button
                                className="production-notification"
                                type="button"
                                onClick={() =>
                                    setShowNotifications((prev) => !prev)
                                }
                                aria-label="Notifications"
                                aria-expanded={showNotifications}
                            >

                                <Bell size={19} />

                                {notificationItems.length > 0 && (
                                    <span>
                                        {notificationItems.length}
                                    </span>
                                )}

                            </button>


                            {showNotifications && (

                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 14px)",
                                        right: 0,
                                        width: "330px",
                                        maxWidth: "calc(100vw - 30px)",
                                        background: "#06272a",
                                        border: "1px solid rgba(255, 213, 79, 0.30)",
                                        borderRadius: "12px",
                                        boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
                                        zIndex: 10050,
                                        overflow: "hidden",
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "14px 16px",
                                            borderBottom: "1px solid rgba(130, 190, 193, 0.12)",
                                        }}
                                    >
                                        <strong
                                            style={{
                                                color: "#f4f7f7",
                                                fontSize: "13px",
                                            }}
                                        >
                                            Notifications
                                        </strong>

                                        <span
                                            style={{
                                                color: "#ffd54f",
                                                fontSize: "10px",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {notificationItems.length} NEW
                                        </span>
                                    </div>


                                    <div
                                        style={{
                                            maxHeight: "320px",
                                            overflowY: "auto",
                                        }}
                                    >

                                        {notificationItems.map((item, index) => (

                                            <div
                                                key={`${item.title}-${index}`}
                                                style={{
                                                    display: "flex",
                                                    gap: "12px",
                                                    padding: "14px 16px",
                                                    borderBottom: index < notificationItems.length - 1
                                                        ? "1px solid rgba(130, 190, 193, 0.10)"
                                                        : "none",
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        width: "30px",
                                                        height: "30px",
                                                        minWidth: "30px",
                                                        borderRadius: "8px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background: "rgba(255, 213, 79, 0.10)",
                                                        color: "#ffd54f",
                                                    }}
                                                >
                                                    {item.icon === "efficiency" ? (
                                                        <Gauge size={15} />
                                                    ) : item.icon === "downtime" ? (
                                                        <Activity size={15} />
                                                    ) : (
                                                        <Factory size={15} />
                                                    )}
                                                </div>

                                                <div style={{ minWidth: 0 }}>
                                                    <strong
                                                        style={{
                                                            display: "block",
                                                            color: "#f4f7f7",
                                                            fontSize: "11px",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        {item.title}
                                                    </strong>

                                                    <span
                                                        style={{
                                                            display: "block",
                                                            color: "#789496",
                                                            fontSize: "10px",
                                                            lineHeight: 1.5,
                                                        }}
                                                    >
                                                        {item.message}
                                                    </span>
                                                </div>

                                            </div>

                                        ))}

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() => setShowNotifications(false)}
                                        style={{
                                            width: "100%",
                                            border: 0,
                                            borderTop: "1px solid rgba(130, 190, 193, 0.10)",
                                            background: "transparent",
                                            color: "#ffd54f",
                                            padding: "12px",
                                            cursor: "pointer",
                                            fontSize: "10px",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Mark as Read
                                    </button>

                                </div>

                            )}

                        </div>


                        <div className="production-top-user">

                            <div className="production-top-avatar">
                                RK
                            </div>

                            <div className="production-top-user-info">

                                <strong>
                                    Factory Admin
                                </strong>

                                <small>
                                    Administrator
                                </small>

                            </div>

                            <ChevronDown
                                size={15}
                                color="#6f888a"
                            />

                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <div className="production-content">


                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                marginBottom: "18px",
                                padding: "12px 15px",
                                color: "#ff8c8c",
                                background:
                                    "rgba(255,70,70,0.08)",
                                border:
                                    "1px solid rgba(255,70,70,0.22)",
                                borderRadius: "8px",
                                fontSize: "11px",
                            }}
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="production-page-header">


                        <div>

                            <div className="production-eyebrow">
                                PRODUCTION CONTROL
                            </div>

                            <h1>
                                Production
                            </h1>

                            <p>
                                Monitor production output and operational performance.
                            </p>

                        </div>


                        <button
                            className="production-plan-button"
                            type="button"
                            style={{
                                position: "relative",
                                zIndex: 50,
                                pointerEvents: "auto",
                                cursor: "pointer",
                            }}
                            onClick={() => {

                                setPlanError("");

                                setShowPlanModal(true);

                            }}
                        >
                            <Target size={18} />

                            Create Production Plan

                        </button>

                    </div>


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div className="production-stats">


                        {/* OUTPUT */}

                        <div className="production-stat-card">

                            <div className="production-stat-icon">
                                <TrendingUp size={21} />
                            </div>

                            <div className="production-stat-content">

                                <span>
                                    Today's Output
                                </span>

                                <strong>
                                    {formatNumber(totalOutput)}
                                </strong>

                                <small>
                                    Units produced
                                </small>

                            </div>

                            <div className="production-stat-growth">
                                LIVE
                            </div>

                        </div>


                        {/* EFFICIENCY */}

                        <div className="production-stat-card">

                            <div className="production-stat-icon">
                                <Gauge size={21} />
                            </div>

                            <div className="production-stat-content">

                                <span>
                                    Production Efficiency
                                </span>

                                <strong>
                                    {efficiency.toFixed(1)}%
                                </strong>

                                <small>
                                    Target vs actual
                                </small>

                            </div>

                            <div className="production-stat-growth">
                                {efficiency >= 90
                                    ? "GOOD"
                                    : "WATCH"}
                            </div>

                        </div>


                        {/* MACHINES */}

                        <div className="production-stat-card">

                            <div className="production-stat-icon">
                                <Factory size={21} />
                            </div>

                            <div className="production-stat-content">

                                <span>
                                    Active Machines
                                </span>

                                <strong>
                                    {activeMachines}
                                </strong>

                                <small>
                                    Today's production
                                </small>

                            </div>

                            <div className="production-stat-growth">
                                ACTIVE
                            </div>

                        </div>


                        {/* DOWNTIME */}

                        <div className="production-stat-card downtime-card">

                            <div className="production-stat-icon">
                                <Activity size={21} />
                            </div>

                            <div className="production-stat-content">

                                <span>
                                    Downtime
                                </span>

                                <strong>
                                    {totalDowntime.toFixed(1)}
                                </strong>

                                <small>
                                    Recorded today
                                </small>

                            </div>

                            <div className="production-stat-growth">
                                {totalDowntime === 0
                                    ? "OPTIMAL"
                                    : "MONITOR"}
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ANALYTICS
                    ================================================= */}

                    <div className="production-analytics-grid">


                        {/* CHART */}

                        <div className="production-panel">


                            <div className="production-panel-header">

                                <div>

                                    <h3>
                                        Production Output
                                    </h3>

                                    <p>
                                        Last 7 days production performance
                                    </p>

                                </div>


                                <select
                                    defaultValue="7"
                                    onChange={() => {}}
                                >

                                    <option value="7">
                                        Last 7 Days
                                    </option>

                                </select>

                            </div>


                            <div className="production-chart">


                                <div className="production-y-axis">

                                    <span>
                                        {formatNumber(
                                            maxChartOutput
                                        )}
                                    </span>

                                    <span>
                                        {formatNumber(
                                            maxChartOutput * 0.75
                                        )}
                                    </span>

                                    <span>
                                        {formatNumber(
                                            maxChartOutput * 0.5
                                        )}
                                    </span>

                                    <span>
                                        {formatNumber(
                                            maxChartOutput * 0.25
                                        )}
                                    </span>

                                    <span>
                                        0
                                    </span>

                                </div>


                                <div className="production-chart-area">


                                    <div className="production-grid-line line-1" />
                                    <div className="production-grid-line line-2" />
                                    <div className="production-grid-line line-3" />
                                    <div className="production-grid-line line-4" />
                                    <div className="production-grid-line line-5" />


                                    <div className="production-bars">

                                        {chartData.map(
                                            (item, index) => {

                                                const height =
                                                    item.output === 0
                                                        ? 20
                                                        :
                                                        Math.max(
                                                            20,
                                                            (
                                                                item.output /
                                                                maxChartOutput
                                                            ) * 100
                                                        );


                                                return (

                                                    <div
                                                        key={item.date}
                                                        className={`production-bar-wrapper ${
                                                            index ===
                                                            chartData.length - 1
                                                                ? "current"
                                                                : ""
                                                        }`}
                                                    >

                                                        <div
                                                            className="production-bar"
                                                            style={{
                                                                height:
                                                                    `${height}%`,
                                                            }}
                                                            title={`${item.date}: ${formatNumber(item.output)} units`}
                                                        />

                                                        <span>
                                                            {item.label}
                                                        </span>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* EFFICIENCY */}

                        <div className="production-panel">


                            <div className="production-panel-header">

                                <div>

                                    <h3>
                                        Production Efficiency
                                    </h3>

                                    <p>
                                        Today's operational performance
                                    </p>

                                </div>

                            </div>


                            <div className="efficiency-content">


                                <div
                                    className="efficiency-circle"
                                    style={{
                                        background:
                                            `conic-gradient(
                                                #ffd33e 0deg,
                                                #ffd33e ${efficiencyDegree}deg,
                                                #1e3235 ${efficiencyDegree}deg,
                                                #1e3235 360deg
                                            )`,
                                    }}
                                >

                                    <div>

                                        <strong>
                                            {performance.toFixed(0)}
                                        </strong>

                                        <span>
                                            %
                                        </span>

                                    </div>

                                </div>


                                <div className="efficiency-list">


                                    <div>

                                        <span>
                                            Availability
                                        </span>

                                        <strong>
                                            {availability.toFixed(1)}%
                                        </strong>

                                        <div className="efficiency-progress">

                                            <i
                                                style={{
                                                    width:
                                                        `${availability}%`,
                                                }}
                                            />

                                        </div>

                                    </div>


                                    <div>

                                        <span>
                                            Performance
                                        </span>

                                        <strong>
                                            {performance.toFixed(1)}%
                                        </strong>

                                        <div className="efficiency-progress">

                                            <i
                                                style={{
                                                    width:
                                                        `${performance}%`,
                                                }}
                                            />

                                        </div>

                                    </div>


                                    <div>

                                        <span>
                                            Quality
                                        </span>

                                        <strong>
                                            {quality.toFixed(1)}%
                                        </strong>

                                        <div className="efficiency-progress">

                                            <i
                                                style={{
                                                    width:
                                                        `${quality}%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PRODUCTION RECORDS
                    ================================================= */}

                    <div className="production-panel lines-panel">


                        <div className="production-panel-header">

                            <div>

                                <h3>
                                    Production Records
                                </h3>

                                <p>
                                    Production plans and actual output
                                </p>

                            </div>


                            <button
                                className="production-view-all"
                                type="button"
                                onClick={() =>
                                    setShowAllRecords((prev) => !prev)
                                }
                            >
                                {showAllRecords ? "Show Less" : "View All"}
                            </button>

                        </div>


                        <div className="production-lines-table">


                            {/* HEADER */}

                            <div className="production-line-row table-header">

                                <span>
                                    Machine
                                </span>

                                <span>
                                    Shift
                                </span>

                                <span>
                                    Output
                                </span>

                                <span>
                                    Efficiency
                                </span>

                                <span>
                                    Status
                                </span>

                            </div>


                            {/* RECORDS */}

                            {productionRecords.length === 0 ? (

                                <div
                                    style={{
                                        minHeight: "100px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#607b7e",
                                        fontSize: "11px",
                                    }}
                                >
                                    No production records found.
                                </div>

                            ) : (

                                productionRecords
                                    .slice(
                                        0,
                                        showAllRecords
                                            ? productionRecords.length
                                            : 8
                                    )
                                    .map((record) => {

                                        const target =
                                            Number(
                                                record.targetQuantity ||
                                                0
                                            );

                                        const actual =
                                            Number(
                                                record.actualQuantity ||
                                                0
                                            );

                                        const recordEfficiency =
                                            target > 0
                                                ? (
                                                actual /
                                                target
                                            ) * 100
                                                : 0;

                                        const status =
                                            getRecordStatus(
                                                record
                                            );


                                        return (

                                            <div
                                                className="production-line-row"
                                                key={record.id}
                                            >


                                                {/* MACHINE */}

                                                <div className="line-name-box">

                                                    <div className="line-icon">
                                                        <Factory size={16} />
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {record.machine ||
                                                                "Unknown Machine"}
                                                        </strong>

                                                        <div
                                                            style={{
                                                                marginTop: "3px",
                                                                color: "#607a7d",
                                                                fontSize: "8px",
                                                            }}
                                                        >
                                                            {record.date}
                                                        </div>

                                                    </div>

                                                </div>


                                                {/* SHIFT */}

                                                <span>
                                                    {record.shift ||
                                                        "--"}
                                                </span>


                                                {/* OUTPUT */}

                                                <strong
                                                    style={{
                                                        color: "#dce8e8",
                                                        fontSize: "11px",
                                                    }}
                                                >
                                                    {formatNumber(
                                                        actual
                                                    )}
                                                </strong>


                                                {/* EFFICIENCY */}

                                                <div
                                                    className={`line-efficiency ${
                                                        recordEfficiency >= 90
                                                            ? ""
                                                            : "warning-efficiency"
                                                    }`}
                                                >

                                                    <span>
                                                        {recordEfficiency.toFixed(
                                                            1
                                                        )}%
                                                    </span>

                                                    <div>

                                                        <i
                                                            style={{
                                                                width:
                                                                    `${Math.min(
                                                                        recordEfficiency,
                                                                        100
                                                                    )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>


                                                {/* STATUS */}

                                                <div
                                                    className={`line-status ${getStatusClass(
                                                        status
                                                    )}`}
                                                >
                                                    {status}
                                                </div>

                                            </div>

                                        );

                                    })

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        AI INSIGHT
                    ================================================= */}

                    <div className="production-ai-card">


                        <div className="production-ai-icon">

                            <BrainCircuit size={25} />

                        </div>


                        <div className="production-ai-content">


                            <div className="production-ai-title">

                                <span>
                                    FACTORYX AI
                                </span>

                                <small>
                                    PRODUCTION INSIGHT
                                </small>

                            </div>


                            <h3>
                                Production Performance Analysis
                            </h3>


                            <p>

                                {todayData.length === 0
                                    ? "No production data is available for today. Create a production plan to start tracking output and performance."
                                    : `Today's production output is ${formatNumber(
                                        totalOutput
                                    )} units against a target of ${formatNumber(
                                        totalTarget
                                    )} units, with an overall efficiency of ${efficiency.toFixed(
                                        1
                                    )}%.`
                                }

                            </p>

                        </div>


                        <Link
                            to="/ai-assistant"
                            className="production-ai-button"
                            style={{
                                textDecoration: "none",
                            }}
                        >

                            <BrainCircuit size={15} />

                            Ask AI

                        </Link>

                    </div>

                </div>

            </main>


            {/* =========================================================
                CREATE PRODUCTION PLAN MODAL
            ========================================================= */}

            {showPlanModal && (

                <div
                    className="production-modal-overlay"
                    style={{
                        position: "fixed",
                        inset: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: 99999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        boxSizing: "border-box",
                        background: "rgba(0, 10, 12, 0.78)",
                        overflowY: "auto",
                        pointerEvents: "auto",
                    }}
                    onClick={() => {

                        if (!planLoading) {
                            setShowPlanModal(false);
                        }

                    }}
                >


                    <div
                        className="production-modal"
                        style={{
                            position: "relative",
                            zIndex: 100000,
                            width: "min(700px, 100%)",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            background: "#06272a",
                            border: "1px solid rgba(255, 213, 79, 0.45)",
                            borderRadius: "16px",
                            boxShadow: "0 25px 80px rgba(0,0,0,0.55), 0 0 40px rgba(255,213,79,0.08)",
                        }}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="production-modal-header">


                            <div className="production-modal-header-left">


                                <div className="production-modal-icon">
                                    <Target size={21} />
                                </div>


                                <div>

                                    <span className="production-modal-eyebrow">
                                        PRODUCTION PLANNING
                                    </span>

                                    <h2>
                                        Create Production Plan
                                    </h2>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="production-modal-close"
                                disabled={planLoading}
                                onClick={() =>
                                    setShowPlanModal(false)
                                }
                            >
                                <X size={18} />
                            </button>

                        </div>


                        {/* MODAL FORM */}

                        <form
                            className="production-modal-form"
                            onSubmit={
                                createProductionPlan
                            }
                        >


                            {/* ERROR */}

                            {planError && (

                                <div className="production-modal-error">

                                    {planError}

                                </div>

                            )}


                            <div className="production-form-grid">


                                {/* MACHINE */}

                                <div className="production-form-group">

                                    <label>
                                        Machine
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example: CNC-101"
                                        value={
                                            productionPlan.machine
                                        }
                                        onChange={(e) =>
                                            setProductionPlan({
                                                ...productionPlan,
                                                machine:
                                                e.target.value,
                                            })
                                        }
                                    />

                                    <span className="production-form-hint">
                                        Enter the machine ID.
                                    </span>

                                </div>


                                {/* DATE */}

                                <div className="production-form-group">

                                    <label>
                                        Production Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            productionPlan.date
                                        }
                                        onChange={(e) =>
                                            setProductionPlan({
                                                ...productionPlan,
                                                date:
                                                e.target.value,
                                            })
                                        }
                                    />

                                </div>


                                {/* SHIFT */}

                                <div className="production-form-group">

                                    <label>
                                        Shift
                                    </label>

                                    <select
                                        value={
                                            productionPlan.shift
                                        }
                                        onChange={(e) =>
                                            setProductionPlan({
                                                ...productionPlan,
                                                shift:
                                                e.target.value,
                                            })
                                        }
                                    >

                                        <option value="Morning">
                                            Morning
                                        </option>

                                        <option value="Afternoon">
                                            Afternoon
                                        </option>

                                        <option value="Night">
                                            Night
                                        </option>

                                    </select>

                                </div>


                                {/* TARGET */}

                                <div className="production-form-group">

                                    <label>
                                        Target Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Example: 5000"
                                        value={
                                            productionPlan.targetQuantity
                                        }
                                        onChange={(e) =>
                                            setProductionPlan({
                                                ...productionPlan,
                                                targetQuantity:
                                                e.target.value,
                                            })
                                        }
                                    />

                                </div>


                                {/* ACTUAL */}

                                <div className="production-form-group">

                                    <label>
                                        Actual Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Example: 4500"
                                        value={
                                            productionPlan.actualQuantity
                                        }
                                        onChange={(e) =>
                                            setProductionPlan({
                                                ...productionPlan,
                                                actualQuantity:
                                                e.target.value,
                                            })
                                        }
                                    />

                                </div>


                                {/* DEFECTIVE */}

                                <div className="production-form-group">

                                    <label>
                                        Defective Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Example: 25"
                                        value={
                                            productionPlan.defectiveQuantity
                                        }
                                        onChange={(e) =>
                                            setProductionPlan({
                                                ...productionPlan,
                                                defectiveQuantity:
                                                e.target.value,
                                            })
                                        }
                                    />

                                </div>


                                {/* DOWNTIME */}

                                <div className="production-form-group full-width">

                                    <label>
                                        Downtime
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        placeholder="Example: 2.5"
                                        value={
                                            productionPlan.downtime
                                        }
                                        onChange={(e) =>
                                            setProductionPlan({
                                                ...productionPlan,
                                                downtime:
                                                e.target.value,
                                            })
                                        }
                                    />

                                    <span className="production-form-hint">
                                        Enter downtime according to the unit used by your backend.
                                    </span>

                                </div>


                            </div>


                            {/* BUTTONS */}

                            <div className="production-modal-buttons">


                                <button
                                    type="button"
                                    className="production-cancel-button"
                                    disabled={planLoading}
                                    onClick={() =>
                                        setShowPlanModal(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="production-save-button"
                                    disabled={planLoading}
                                >

                                    <CheckCircle2
                                        size={16}
                                    />

                                    {planLoading
                                        ? "Saving..."
                                        : "Create Plan"}

                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}

        </div>

    );
};


export default Production;