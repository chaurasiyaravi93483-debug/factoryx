import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    Activity,
    AlertTriangle,
    Bell,
    Box,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock,
    Factory,
    Gauge,
    LayoutDashboard,
    Menu,
    Package,
    Plus,
    Search,
    ShieldCheck,
    TrendingUp,
    Wrench,
    X,
    Zap,
} from "lucide-react";

import "../maintenance.css";


const API_URL =
    "http://localhost:8081/api/maintenance";


function Maintenance() {

    const [tasks, setTasks] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All Status");

    const [showModal, setShowModal] =
        useState(false);

    const [mobileMenu, setMobileMenu] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [newTask, setNewTask] =
        useState({
            machine: "",
            type: "Preventive Maintenance",
            description: "",
            date: "",
            time: "",
            priority: "Medium",
        });


    // =========================================================
    // TOKEN
    // =========================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateString) => {

        if (!dateString) {
            return "--";
        }

        const date =
            new Date(
                `${dateString}T00:00:00`
            );

        const today =
            new Date();

        today.setHours(0, 0, 0, 0);

        const tomorrow =
            new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );


        if (
            date.getTime() ===
            today.getTime()
        ) {
            return "Today";
        }


        if (
            date.getTime() ===
            tomorrow.getTime()
        ) {
            return "Tomorrow";
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =========================================================
    // LOAD MAINTENANCE
    // =========================================================

    const loadMaintenance = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                getToken();


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
                    "Failed to load maintenance data."
                );
            }


            const data =
                await response.json();


            const formattedTasks =
                Array.isArray(data)
                    ? data.map((task) => ({
                        databaseId:
                        task.id,

                        id:
                        task.maintenanceId,

                        machine:
                            task.machine ||
                            "Unknown",

                        type:
                            task.type ||
                            "Maintenance",

                        description:
                            task.issue ||
                            "No description",

                        date:
                        task.scheduledDate,

                        time:
                            "--",

                        priority:
                            task.priority ||
                            "Medium",

                        status:
                            task.status ||
                            "Scheduled",

                        assignedTo:
                        task.assignedTo,

                        completedDate:
                        task.completedDate,

                        notes:
                        task.notes,
                    }))
                    : [];


            setTasks(
                formattedTasks
            );


        } catch (err) {

            console.error(
                "Maintenance API Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load maintenance data."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // LOAD PAGE
    // =========================================================

    useEffect(() => {

        loadMaintenance();

    }, []);


    // =========================================================
    // FILTER
    // =========================================================

    const filteredTasks =
        useMemo(() => {

            return tasks.filter(
                (task) => {

                    const searchText =
                        search.toLowerCase();


                    const matchesSearch =
                        task.machine
                            .toLowerCase()
                            .includes(searchText) ||

                        task.type
                            .toLowerCase()
                            .includes(searchText) ||

                        task.description
                            .toLowerCase()
                            .includes(searchText);


                    const matchesStatus =
                        statusFilter ===
                        "All Status" ||
                        task.status ===
                        statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            tasks,
            search,
            statusFilter,
        ]);


    // =========================================================
    // STATS
    // =========================================================

    const totalTasks =
        tasks.length;


    const pendingTasks =
        tasks.filter(
            (task) =>
                task.status ===
                "Pending"
        ).length;


    const inProgressTasks =
        tasks.filter(
            (task) =>
                task.status ===
                "In Progress"
        ).length;


    const criticalTasks =
        tasks.filter(
            (task) =>
                task.priority ===
                "Critical"
        ).length;


    // =========================================================
    // CREATE MAINTENANCE
    // =========================================================

    const createTask = async (e) => {

        e.preventDefault();


        if (
            !newTask.machine.trim() ||
            !newTask.description.trim()
        ) {

            alert(
                "Machine ID and description are required."
            );

            return;
        }


        try {

            const token =
                getToken();


            const maintenanceId =
                `MNT-${Date.now()}`;


            const response =
                await fetch(
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

                            maintenanceId:
                            maintenanceId,

                            machine:
                                newTask.machine
                                    .trim()
                                    .toUpperCase(),

                            issue:
                                newTask.description
                                    .trim(),

                            type:
                            newTask.type,

                            priority:
                            newTask.priority,

                            status:
                                "Scheduled",

                            assignedTo:
                                null,

                            scheduledDate:
                                newTask.date ||
                                new Date()
                                    .toISOString()
                                    .split("T")[0],

                            completedDate:
                                null,

                            notes:
                                null,
                        }),
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


                const errorText =
                    await response.text();


                throw new Error(
                    errorText ||
                    "Failed to schedule maintenance."
                );
            }


            const createdTask =
                await response.json();


            const formattedTask = {

                databaseId:
                createdTask.id,

                id:
                createdTask.maintenanceId,

                machine:
                createdTask.machine,

                type:
                createdTask.type,

                description:
                createdTask.issue,

                date:
                createdTask.scheduledDate,

                time:
                    "--",

                priority:
                createdTask.priority,

                status:
                createdTask.status,

                assignedTo:
                createdTask.assignedTo,

                completedDate:
                createdTask.completedDate,

                notes:
                createdTask.notes,
            };


            setTasks(
                (previous) => [
                    ...previous,
                    formattedTask,
                ]
            );


            setNewTask({
                machine: "",
                type: "Preventive Maintenance",
                description: "",
                date: "",
                time: "",
                priority: "Medium",
            });


            setShowModal(false);


        } catch (err) {

            console.error(
                "Create maintenance error:",
                err
            );

            alert(
                err.message ||
                "Unable to schedule maintenance."
            );
        }
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="maintenance-page">


            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside
                className={`maintenance-sidebar ${
                    mobileMenu
                        ? "mobile-open"
                        : ""
                }`}
            >

                <div className="maintenance-logo">

                    <div className="maintenance-logo-icon">
                        <Factory size={24} />
                    </div>

                    <div className="maintenance-logo-text">
                        FACTORY<span>X</span>
                    </div>

                </div>


                <div className="maintenance-sidebar-content">


                    <div className="maintenance-section-title">
                        MAIN
                    </div>


                    <Link
                        to="/dashboard"
                        className="maintenance-menu-item"
                    >
                        <LayoutDashboard size={21} />
                        <span>Dashboard</span>
                    </Link>


                    <Link
                        to="/dashboard"
                        className="maintenance-menu-item"
                    >
                        <Factory size={21} />
                        <span>Factory</span>

                        <ChevronDown
                            size={15}
                            className="menu-arrow"
                        />
                    </Link>


                    <Link
                        to="/machines"
                        className="maintenance-menu-item"
                    >
                        <Gauge size={21} />
                        <span>Machines</span>
                    </Link>


                    <Link
                        to="/production"
                        className="maintenance-menu-item"
                    >
                        <TrendingUp size={21} />
                        <span>Production</span>
                    </Link>


                    <div className="maintenance-section-title operations">
                        OPERATIONS
                    </div>


                    <Link
                        to="/maintenance"
                        className="maintenance-menu-item active"
                    >
                        <Wrench size={21} />
                        <span>Maintenance</span>
                    </Link>


                    <Link
                        to="/inventory"
                        className="maintenance-menu-item"
                    >
                        <Package size={21} />
                        <span>Inventory</span>
                    </Link>


                    <Link
                        to="/quality"
                        className="maintenance-menu-item"
                    >
                        <CheckCircle2 size={21} />
                        <span>Quality</span>
                    </Link>


                    <Link
                        to="/incidents"
                        className="maintenance-menu-item"
                    >
                        <AlertTriangle size={21} />
                        <span>Incidents</span>
                    </Link>


                    <div className="maintenance-section-title intelligence">
                        INTELLIGENCE
                    </div>


                    <Link
                        to="/ai-assistant"
                        className="maintenance-menu-item ai-item"
                    >
                        <Zap size={21} />
                        <span>AI Assistant</span>
                    </Link>


                    <Link
                        to="/documents"
                        className="maintenance-menu-item"
                    >
                        <Box size={21} />
                        <span>Documents</span>
                    </Link>


                    <Link
                        to="/reports"
                        className="maintenance-menu-item"
                    >
                        <ShieldCheck size={21} />
                        <span>Reports</span>
                    </Link>

                </div>


                <div className="maintenance-user">

                    <div className="maintenance-avatar">
                        RK
                    </div>

                    <div className="maintenance-user-info">

                        <strong>
                            Ravi Kumar
                        </strong>

                        <span>
                            Manager
                        </span>

                    </div>

                    <ChevronDown size={16} />

                </div>

            </aside>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="maintenance-main">


                <header className="maintenance-topbar">

                    <button
                        className="maintenance-mobile-menu"
                        onClick={() =>
                            setMobileMenu(
                                !mobileMenu
                            )
                        }
                    >
                        <Menu size={24} />
                    </button>


                    <div className="maintenance-breadcrumb">

                        <span>
                            Factory
                        </span>

                        <b>
                            /
                        </b>

                        <strong>
                            Maintenance
                        </strong>

                    </div>


                    <div className="maintenance-top-right">

                        <div className="maintenance-notification">

                            <Bell size={23} />

                            <span>
                                {criticalTasks}
                            </span>

                        </div>


                        <div className="maintenance-top-user">

                            <div className="maintenance-top-avatar">
                                RK
                            </div>

                            <div>

                                <strong>
                                    Ravi Kumar
                                </strong>

                                <small>
                                    Manager
                                </small>

                            </div>

                            <ChevronDown size={16} />

                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <div className="maintenance-content">


                    {/* PAGE HEADER */}

                    <div className="maintenance-heading">

                        <div>

                            <div className="maintenance-eyebrow">
                                MAINTENANCE MANAGEMENT
                            </div>

                            <h1>
                                Maintenance
                            </h1>

                            <p>
                                Schedule, monitor and manage
                                maintenance activities across your factory.
                            </p>

                        </div>


                        <button
                            className="create-maintenance-button"
                            onClick={() =>
                                setShowModal(true)
                            }
                        >
                            <Plus size={20} />
                            Schedule Maintenance
                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                padding:
                                    "12px 16px",
                                marginBottom:
                                    "16px",
                                borderRadius:
                                    "8px",
                                background:
                                    "rgba(255,70,70,0.08)",
                                border:
                                    "1px solid rgba(255,70,70,0.25)",
                                color:
                                    "#ff7676",
                            }}
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div className="maintenance-stats">


                        <div className="maintenance-stat-card">

                            <div className="maintenance-stat-icon">
                                <Wrench size={23} />
                            </div>

                            <div>

                                <span>
                                    Total Tasks
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : totalTasks}
                                </strong>

                            </div>

                            <small className="positive">
                                Live
                            </small>

                        </div>


                        <div className="maintenance-stat-card">

                            <div className="maintenance-stat-icon cyan">
                                <Clock size={23} />
                            </div>

                            <div>

                                <span>
                                    Pending
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : pendingTasks}
                                </strong>

                            </div>

                            <small>
                                Active
                            </small>

                        </div>


                        <div className="maintenance-stat-card">

                            <div className="maintenance-stat-icon">
                                <Activity size={23} />
                            </div>

                            <div>

                                <span>
                                    In Progress
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : inProgressTasks}
                                </strong>

                            </div>

                            <small>
                                Active
                            </small>

                        </div>


                        <div className="maintenance-stat-card warning-card">

                            <div className="maintenance-stat-icon warning">
                                <AlertTriangle size={23} />
                            </div>

                            <div>

                                <span>
                                    Critical
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : criticalTasks}
                                </strong>

                            </div>

                            <small>
                                Requires attention
                            </small>

                        </div>

                    </div>


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="maintenance-filter-bar">


                        <div className="maintenance-search">

                            <Search size={20} />

                            <input
                                type="text"
                                placeholder="Search machine, task or maintenance type..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="maintenance-filter">

                            <span>
                                Status:
                            </span>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    All Status
                                </option>

                                <option>
                                    Pending
                                </option>

                                <option>
                                    In Progress
                                </option>

                                <option>
                                    Scheduled
                                </option>

                            </select>

                            <ChevronDown size={15} />

                        </div>

                    </div>


                    {/* =================================================
                        MAINTENANCE TASKS
                    ================================================= */}

                    <section className="maintenance-panel">


                        <div className="maintenance-panel-header">

                            <div>

                                <h2>
                                    Maintenance Schedule
                                </h2>

                                <p>
                                    Upcoming and active maintenance activities
                                </p>

                            </div>


                            <button
                                className="calendar-button"
                                type="button"
                            >

                                <CalendarDays size={17} />

                                Calendar View

                            </button>

                        </div>


                        {loading ? (

                            <div className="maintenance-empty">

                                <Clock size={38} />

                                <h3>
                                    Loading maintenance...
                                </h3>

                            </div>

                        ) : (

                            <div className="maintenance-table">


                                <div className="maintenance-table-header">

                                    <span>
                                        MACHINE
                                    </span>

                                    <span>
                                        MAINTENANCE
                                    </span>

                                    <span>
                                        SCHEDULE
                                    </span>

                                    <span>
                                        PRIORITY
                                    </span>

                                    <span>
                                        STATUS
                                    </span>

                                </div>


                                {filteredTasks.map(
                                    (task) => (

                                        <div
                                            className="maintenance-row"
                                            key={
                                                task.databaseId
                                            }
                                        >


                                            <div className="maintenance-machine">

                                                <div className="machine-icon">
                                                    <Factory size={19} />
                                                </div>

                                                <div>

                                                    <strong>
                                                        {task.machine}
                                                    </strong>

                                                    <span>
                                                        Production Equipment
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="maintenance-task">

                                                <strong>
                                                    {task.type}
                                                </strong>

                                                <span>
                                                    {task.description}
                                                </span>

                                            </div>


                                            <div className="maintenance-schedule">

                                                <strong>
                                                    {formatDate(
                                                        task.date
                                                    )}
                                                </strong>

                                                <span>
                                                    {task.time}
                                                </span>

                                            </div>


                                            <div>

                                                <span
                                                    className={`priority ${task.priority
                                                        .toLowerCase()}`}
                                                >
                                                    {task.priority}
                                                </span>

                                            </div>


                                            <div>

                                                <span
                                                    className={`task-status ${task.status
                                                        .toLowerCase()
                                                        .replace(
                                                            " ",
                                                            "-"
                                                        )}`}
                                                >
                                                    {task.status}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        {!loading &&
                            filteredTasks.length === 0 && (

                                <div className="maintenance-empty">

                                    <Search size={38} />

                                    <h3>
                                        No maintenance tasks found
                                    </h3>

                                    <p>
                                        Try changing your search
                                        or status filter.
                                    </p>

                                </div>

                            )}

                    </section>


                    {/* =================================================
                        AI INSIGHT
                    ================================================= */}

                    <section className="maintenance-ai-card">

                        <div className="maintenance-ai-icon">
                            <Zap size={25} />
                        </div>

                        <div>

                            <div className="maintenance-ai-title">
                                FACTORYX AI INSIGHT
                            </div>

                            <h3>

                                {criticalTasks > 0
                                    ? `${criticalTasks} critical maintenance task${
                                        criticalTasks > 1
                                            ? "s"
                                            : ""
                                    } require attention.`
                                    : "No critical maintenance tasks currently recorded."}

                            </h3>

                            <p>

                                {totalTasks > 0
                                    ? "Review the maintenance schedule and complete high-priority activities before the next production cycle."
                                    : "Add maintenance records to generate FactoryX maintenance insights."}

                            </p>

                        </div>

                        <Link
                            to="/machines"
                            className="maintenance-ai-button"
                        >
                            View Machine
                            <Gauge size={16} />
                        </Link>

                    </section>

                </div>

            </main>


            {/* =====================================================
                MODAL
            ===================================================== */}

            {showModal && (

                <div
                    className="maintenance-modal-overlay"
                    onClick={() =>
                        setShowModal(false)
                    }
                >

                    <div
                        className="maintenance-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <div className="maintenance-modal-header">

                            <div>

                                <span>
                                    FACTORY EQUIPMENT
                                </span>

                                <h2>
                                    Schedule Maintenance
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                <X size={21} />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                createTask
                            }
                        >


                            <div className="maintenance-form-group">

                                <label>
                                    Machine ID
                                </label>

                                <input
                                    type="text"
                                    placeholder="Example: CNC-103"
                                    value={
                                        newTask.machine
                                    }
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            machine:
                                            e.target.value,
                                        })
                                    }
                                />

                            </div>


                            <div className="maintenance-form-group">

                                <label>
                                    Maintenance Type
                                </label>

                                <select
                                    value={
                                        newTask.type
                                    }
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            type:
                                            e.target.value,
                                        })
                                    }
                                >

                                    <option>
                                        Preventive Maintenance
                                    </option>

                                    <option>
                                        Routine Inspection
                                    </option>

                                    <option>
                                        Emergency Repair
                                    </option>

                                    <option>
                                        Calibration
                                    </option>

                                </select>

                            </div>


                            <div className="maintenance-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    placeholder="Enter maintenance details..."
                                    value={
                                        newTask.description
                                    }
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            description:
                                            e.target.value,
                                        })
                                    }
                                />

                            </div>


                            <div className="maintenance-form-row">

                                <div className="maintenance-form-group">

                                    <label>
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            newTask.date
                                        }
                                        onChange={(e) =>
                                            setNewTask({
                                                ...newTask,
                                                date:
                                                e.target.value,
                                            })
                                        }
                                    />

                                </div>


                                <div className="maintenance-form-group">

                                    <label>
                                        Time
                                    </label>

                                    <input
                                        type="time"
                                        value={
                                            newTask.time
                                        }
                                        onChange={(e) =>
                                            setNewTask({
                                                ...newTask,
                                                time:
                                                e.target.value,
                                            })
                                        }
                                    />

                                </div>

                            </div>


                            <div className="maintenance-form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    value={
                                        newTask.priority
                                    }
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            priority:
                                            e.target.value,
                                        })
                                    }
                                >

                                    <option>
                                        Low
                                    </option>

                                    <option>
                                        Medium
                                    </option>

                                    <option>
                                        High
                                    </option>

                                    <option>
                                        Critical
                                    </option>

                                </select>

                            </div>


                            <div className="maintenance-modal-buttons">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                    className="modal-cancel"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="modal-save"
                                >

                                    <CheckCircle2 size={18} />

                                    Schedule Maintenance

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


export default Maintenance;