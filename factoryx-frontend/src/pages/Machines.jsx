import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../machines.css";

import {
    Activity,
    AlertTriangle,
    Bell,
    Box,
    ChevronDown,
    Factory,
    Gauge,
    LayoutDashboard,
    Menu,
    Package,
    Plus,
    Search,
    SlidersHorizontal,
    TrendingUp,
    Wrench,
    X,
    Zap,
    CheckCircle2,
} from "lucide-react";

const API_URL = "http://localhost:8081/api/machines";

function Machines() {

    const [machines, setMachines] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All States");

    const [lineFilter, setLineFilter] =
        useState("All Lines");

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [showMobileMenu, setShowMobileMenu] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [newMachine, setNewMachine] = useState({
        id: "",
        type: "",
        line: "Production Line A",
    });


    // =========================================================
    // GET TOKEN
    // =========================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // =========================================================
    // LOAD MACHINES
    // =========================================================

    const loadMachines = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

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
                    "Failed to load machines."
                );
            }

            const data = await response.json();

            const formattedMachines =
                data.map((machine) => ({
                    databaseId: machine.id,

                    id: machine.machineCode,

                    type: machine.machineName ||
                        machine.type ||
                        "Machine",

                    line: machine.location ||
                        "Factory Floor",

                    status: machine.status ||
                        "Running",

                    temperature:
                        machine.temperature != null
                            ? `${machine.temperature}°C`
                            : "--",

                    vibration:
                        machine.vibration != null
                            ? `${machine.vibration} mm/s`
                            : "--",

                    rpm: "--",

                    power: "--",

                    efficiency:
                    machine.efficiency,

                    lastMaintenance:
                    machine.lastMaintenance,
                }));

            setMachines(formattedMachines);

        } catch (err) {

            console.error(
                "Error loading machines:",
                err
            );

            setError(
                err.message ||
                "Unable to load machines."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // LOAD WHEN PAGE OPENS
    // =========================================================

    useEffect(() => {

        loadMachines();

    }, []);


    // =========================================================
    // FILTER MACHINES
    // =========================================================

    const filteredMachines = useMemo(() => {

        return machines.filter((machine) => {

            const searchValue =
                search.toLowerCase();

            const matchesSearch =
                machine.id
                    .toLowerCase()
                    .includes(searchValue) ||

                machine.type
                    .toLowerCase()
                    .includes(searchValue) ||

                machine.line
                    .toLowerCase()
                    .includes(searchValue);


            const matchesStatus =
                statusFilter === "All States" ||
                machine.status === statusFilter;


            const matchesLine =
                lineFilter === "All Lines" ||
                machine.line === lineFilter;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesLine
            );

        });

    }, [
        machines,
        search,
        statusFilter,
        lineFilter,
    ]);


    // =========================================================
    // MACHINE STATISTICS
    // =========================================================

    const totalMachines =
        machines.length;

    const runningMachines =
        machines.filter(
            (machine) =>
                machine.status === "Running"
        ).length;

    const idleMachines =
        machines.filter(
            (machine) =>
                machine.status === "Idle"
        ).length;

    const attentionMachines =
        machines.filter(
            (machine) =>
                machine.status === "Needs Attention" ||
                machine.status === "Critical"
        ).length;


    // =========================================================
    // ADD MACHINE
    // =========================================================

    const addMachine = async (e) => {

        e.preventDefault();

        if (
            !newMachine.id.trim() ||
            !newMachine.type.trim()
        ) {

            alert(
                "Machine ID and Machine Type are required."
            );

            return;
        }


        try {

            const token = getToken();

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

                        machineCode:
                            newMachine.id
                                .trim()
                                .toUpperCase(),

                        machineName:
                            newMachine.type
                                .trim(),

                        type:
                            newMachine.type
                                .trim(),

                        location:
                        newMachine.line,

                        status:
                            "Running",

                        efficiency:
                            0,

                        temperature:
                            65,

                        vibration:
                            2.0,

                        lastMaintenance:
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
                    "Failed to add machine."
                );
            }


            const createdMachine =
                await response.json();


            const formattedMachine = {

                databaseId:
                createdMachine.id,

                id:
                createdMachine.machineCode,

                type:
                    createdMachine.machineName ||
                    createdMachine.type,

                line:
                    createdMachine.location ||
                    newMachine.line,

                status:
                    createdMachine.status ||
                    "Running",

                temperature:
                    createdMachine.temperature != null
                        ? `${createdMachine.temperature}°C`
                        : "--",

                vibration:
                    createdMachine.vibration != null
                        ? `${createdMachine.vibration} mm/s`
                        : "--",

                rpm: "--",

                power: "--",

                efficiency:
                createdMachine.efficiency,

                lastMaintenance:
                createdMachine.lastMaintenance,
            };


            setMachines((previous) => [
                ...previous,
                formattedMachine,
            ]);


            setNewMachine({
                id: "",
                type: "",
                line: "Production Line A",
            });


            setShowAddModal(false);


        } catch (err) {

            console.error(
                "Error adding machine:",
                err
            );

            alert(
                err.message ||
                "Unable to add machine."
            );
        }
    };


    // =========================================================
    // CLOSE MOBILE MENU
    // =========================================================

    const closeMobileMenu = () => {
        setShowMobileMenu(false);
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="factory-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`factory-sidebar ${
                    showMobileMenu
                        ? "mobile-open"
                        : ""
                }`}
            >

                <div className="sidebar-logo">

                    <div className="factory-logo-icon">
                        <Factory size={25} />
                    </div>

                    <div className="factory-logo-text">
                        FACTORY<span>X</span>
                    </div>

                </div>


                <div className="sidebar-content">

                    <div className="sidebar-section-title">
                        MAIN
                    </div>


                    <Link
                        to="/dashboard"
                        className="sidebar-link"
                        onClick={closeMobileMenu}
                    >
                        <LayoutDashboard size={22} />
                        <span>Dashboard</span>
                    </Link>


                    <Link
                        to="/dashboard"
                        className="sidebar-link"
                        onClick={closeMobileMenu}
                    >
                        <Factory size={22} />
                        <span>Factory</span>

                        <ChevronDown
                            size={16}
                            className="sidebar-chevron"
                        />
                    </Link>


                    <Link
                        to="/machines"
                        className="sidebar-link active"
                        onClick={closeMobileMenu}
                    >
                        <SlidersHorizontal size={22} />
                        <span>Machines</span>
                    </Link>


                    <Link
                        to="/production"
                        className="sidebar-link"
                        onClick={closeMobileMenu}
                    >
                        <TrendingUp size={22} />
                        <span>Production</span>
                    </Link>


                    <div className="sidebar-section-title operations-title">
                        OPERATIONS
                    </div>


                    <Link
                        to="/maintenance"
                        className="sidebar-link"
                        onClick={closeMobileMenu}
                    >
                        <Wrench size={22} />
                        <span>Maintenance</span>
                    </Link>


                    <Link
                        to="/inventory"
                        className="sidebar-link"
                        onClick={closeMobileMenu}
                    >
                        <Package size={22} />
                        <span>Inventory</span>
                    </Link>


                    <Link
                        to="/quality"
                        className="sidebar-link"
                        onClick={closeMobileMenu}
                    >
                        <CheckCircle2 size={22} />
                        <span>Quality</span>
                    </Link>


                    <Link
                        to="/incidents"
                        className="sidebar-link"
                        onClick={closeMobileMenu}
                    >
                        <AlertTriangle size={22} />
                        <span>Incidents</span>
                    </Link>


                    <div className="sidebar-section-title intelligence-title">
                        INTELLIGENCE
                    </div>


                    <Link
                        to="/ai-assistant"
                        className="sidebar-link ai-link"
                        onClick={closeMobileMenu}
                    >
                        <Zap size={22} />
                        <span>AI Assistant</span>
                    </Link>


                    <Link
                        to="/documents"
                        className="sidebar-link"
                        onClick={closeMobileMenu}
                    >
                        <Box size={22} />
                        <span>Documents</span>
                    </Link>

                </div>


                <div className="sidebar-user">

                    <div className="user-avatar">
                        RK
                    </div>

                    <div className="user-details">

                        <strong>
                            Ravi Kumar
                        </strong>

                        <span>
                            Factory Manager
                        </span>

                    </div>

                    <ChevronDown size={17} />

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="factory-main">


                {/* NAVBAR */}

                <header className="factory-navbar">

                    <button
                        className="mobile-menu-button"
                        type="button"
                        onClick={() =>
                            setShowMobileMenu(
                                !showMobileMenu
                            )
                        }
                    >
                        <Menu size={24} />
                    </button>


                    <div className="breadcrumb">

                        <span>
                            Factory
                        </span>

                        <span className="breadcrumb-slash">
                            /
                        </span>

                        <strong>
                            Machines
                        </strong>

                    </div>


                    <div className="navbar-right">

                        <div className="notification">

                            <Bell size={25} />

                            <span>
                                {attentionMachines}
                            </span>

                        </div>


                        <div className="navbar-user">

                            <div className="navbar-avatar">
                                RK
                            </div>

                            <div>

                                <strong>
                                    Ravi Kumar
                                </strong>

                                <small>
                                    Factory Manager
                                </small>

                            </div>

                            <ChevronDown size={17} />

                        </div>

                    </div>

                </header>


                {/* PAGE */}

                <section className="machines-content">


                    {/* HEADER */}

                    <div className="machines-heading">

                        <div>

                            <div className="eyebrow">
                                MACHINE MANAGEMENT
                            </div>

                            <h1>
                                Machines
                            </h1>

                            <p>
                                Monitor and manage all factory
                                equipment in real time.
                            </p>

                        </div>


                        <button
                            className="add-machine-button"
                            type="button"
                            onClick={() =>
                                setShowAddModal(true)
                            }
                        >

                            <Plus size={21} />

                            Add Machine

                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                padding: "12px 16px",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                background:
                                    "rgba(255, 70, 70, 0.08)",
                                border:
                                    "1px solid rgba(255, 70, 70, 0.25)",
                                color: "#ff7676",
                            }}
                        >
                            {error}
                        </div>

                    )}


                    {/* STATS */}

                    <div className="machine-stats">


                        <div className="machine-stat-card yellow-card">

                            <div className="stat-icon">
                                <SlidersHorizontal size={25} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Total Machines
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : totalMachines}
                                </strong>

                            </div>

                        </div>


                        <div className="machine-stat-card yellow-card running-stat">

                            <div className="stat-icon cyan-icon">
                                <Activity size={26} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Running
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : runningMachines}
                                </strong>

                            </div>

                            <div className="stat-percentage">

                                {totalMachines > 0
                                    ? `${(
                                        (runningMachines /
                                            totalMachines) *
                                        100
                                    ).toFixed(1)}%`
                                    : "0%"}

                            </div>

                            <div className="mini-chart">

                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        </div>


                        <div className="machine-stat-card white-card">

                            <div className="stat-icon">
                                <Activity size={26} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Idle
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : idleMachines}
                                </strong>

                            </div>

                        </div>


                        <div className="machine-stat-card yellow-card">

                            <div className="stat-icon warning-icon">
                                <AlertTriangle size={25} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Needs Attention
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : attentionMachines}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* SEARCH */}

                    <div className="machine-search-bar">


                        <div className="search-container">

                            <Search size={21} />

                            <input
                                type="text"
                                placeholder="Search machine, ID or production line..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="filter-container">

                            <label>
                                Status:
                            </label>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    All States
                                </option>

                                <option>
                                    Running
                                </option>

                                <option>
                                    Needs Attention
                                </option>

                                <option>
                                    Idle
                                </option>

                                <option>
                                    Critical
                                </option>

                            </select>

                            <ChevronDown size={16} />

                        </div>


                        <div className="filter-container">

                            <label>
                                Line:
                            </label>

                            <select
                                value={lineFilter}
                                onChange={(e) =>
                                    setLineFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    All Lines
                                </option>

                                <option>
                                    Production Line A
                                </option>

                                <option>
                                    Production Line B
                                </option>

                                <option>
                                    Production Line C
                                </option>

                            </select>

                            <ChevronDown size={16} />

                        </div>

                    </div>


                    {/* MACHINE GRID */}

                    <div className="machines-grid">


                        {loading ? (

                            <div className="no-machines">

                                <h3>
                                    Loading machines...
                                </h3>

                            </div>

                        ) : filteredMachines.length === 0 ? (

                            <div className="no-machines">

                                <Search size={40} />

                                <h3>
                                    No machines found
                                </h3>

                                <p>
                                    Try changing your search
                                    or filters.
                                </p>

                            </div>

                        ) : (

                            filteredMachines.map(
                                (machine) => (

                                    <Link
                                        key={
                                            machine.databaseId
                                        }
                                        to={`/machines/${machine.id}`}
                                        className={`machine-card ${
                                            machine.status ===
                                            "Needs Attention"
                                                ? "attention-machine"
                                                : ""
                                        }`}
                                    >


                                        <div className="machine-card-top">


                                            <div className="machine-symbol">

                                                <SlidersHorizontal
                                                    size={24}
                                                />

                                            </div>


                                            <div className="machine-card-actions">

                                                <span
                                                    className={
                                                        machine.status ===
                                                        "Running"
                                                            ? "status-running"
                                                            : "status-attention"
                                                    }
                                                >
                                                    {machine.status}
                                                </span>


                                                <button
                                                    className="dots-button"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    •••
                                                </button>

                                            </div>

                                        </div>


                                        <div className="machine-info">

                                            <h2>
                                                {machine.id}
                                            </h2>

                                            <p>
                                                {machine.type}
                                            </p>


                                            <div className="production-line">

                                                <Box size={16} />

                                                {machine.line}

                                            </div>

                                        </div>


                                        <div className="machine-metrics">


                                            <div className="metric-box">

                                                <div className="metric-label">

                                                    <Gauge size={19} />

                                                    Temperature

                                                </div>

                                                <strong>
                                                    {machine.temperature}
                                                </strong>

                                                <div className="metric-wave">
                                                    ~~~
                                                </div>

                                            </div>


                                            <div className="metric-box">

                                                <div className="metric-label">

                                                    <Activity size={19} />

                                                    Vibration

                                                </div>

                                                <strong>
                                                    {machine.vibration}
                                                </strong>

                                                <div className="metric-wave cyan-wave">
                                                    ~~~
                                                </div>

                                            </div>


                                            <div className="metric-box">

                                                <div className="metric-label">

                                                    <Gauge size={19} />

                                                    TPM

                                                </div>

                                                <strong>
                                                    {machine.efficiency != null
                                                        ? `${machine.efficiency}%`
                                                        : "--"}
                                                </strong>

                                                <div className="metric-wave">
                                                    ~~~
                                                </div>

                                            </div>


                                            <div className="metric-box">

                                                <div className="metric-label">

                                                    <Zap size={19} />

                                                    Power

                                                </div>

                                                <strong>
                                                    --
                                                </strong>

                                                <div className="metric-wave cyan-wave">
                                                    ↗
                                                </div>

                                            </div>

                                        </div>


                                    </Link>

                                )
                            )

                        )}

                    </div>

                </section>

            </main>


            {/* =================================================
                ADD MACHINE MODAL
            ================================================= */}

            {showAddModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowAddModal(false)
                    }
                >

                    <div
                        className="add-machine-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <div className="modal-header">

                            <div>

                                <span className="eyebrow">
                                    FACTORY EQUIPMENT
                                </span>

                                <h2>
                                    Add Machine
                                </h2>

                            </div>


                            <button
                                className="modal-close"
                                type="button"
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                            >

                                <X size={22} />

                            </button>

                        </div>


                        <form
                            onSubmit={addMachine}
                        >


                            <div className="form-group">

                                <label>
                                    Machine ID
                                </label>

                                <input
                                    type="text"
                                    placeholder="Example: CNC-103"
                                    value={
                                        newMachine.id
                                    }
                                    onChange={(e) =>
                                        setNewMachine({
                                            ...newMachine,
                                            id: e.target.value,
                                        })
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Machine Type
                                </label>

                                <input
                                    type="text"
                                    placeholder="Example: CNC Machine"
                                    value={
                                        newMachine.type
                                    }
                                    onChange={(e) =>
                                        setNewMachine({
                                            ...newMachine,
                                            type: e.target.value,
                                        })
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Production Line
                                </label>

                                <select
                                    value={
                                        newMachine.line
                                    }
                                    onChange={(e) =>
                                        setNewMachine({
                                            ...newMachine,
                                            line: e.target.value,
                                        })
                                    }
                                >

                                    <option>
                                        Production Line A
                                    </option>

                                    <option>
                                        Production Line B
                                    </option>

                                    <option>
                                        Production Line C
                                    </option>

                                </select>

                            </div>


                            <div className="modal-buttons">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowAddModal(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-button"
                                >

                                    <CheckCircle2 size={18} />

                                    Add Machine

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Machines;