import React, { useEffect, useMemo, useState } from "react";
import "../incidents.css";

import {
    Activity,
    AlertTriangle,
    Bell,
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    Factory,
    Gauge,
    LayoutDashboard,
    Package,
    Plus,
    Search,
    ShieldAlert,
    Wrench,
    XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

const API_URL = "http://localhost:8081/api/incidents";


function Incidents() {

    const [incidents, setIncidents] = useState([]);

    const [search, setSearch] = useState("");

    const [severityFilter, setSeverityFilter] =
        useState("All Severity");

    const [statusFilter, setStatusFilter] =
        useState("All Status");

    const [showModal, setShowModal] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [newIncident, setNewIncident] = useState({
        title: "",
        machine: "",
        location: "",
        severity: "Medium",
        team: "Maintenance Team",
    });


    // =========================================
    // FORMAT INCIDENT TIME
    // =========================================

    const formatIncidentTime = (createdAt) => {

        if (!createdAt) {
            return "Recently";
        }

        const created = new Date(createdAt);

        const now = new Date();

        const diffMs = now - created;

        const diffMinutes =
            Math.floor(diffMs / (1000 * 60));


        if (diffMinutes < 1) {
            return "Just now";
        }


        if (diffMinutes < 60) {
            return `${diffMinutes} min ago`;
        }


        const diffHours =
            Math.floor(diffMinutes / 60);


        if (diffHours < 24) {
            return `${diffHours} hr ago`;
        }


        const diffDays =
            Math.floor(diffHours / 24);


        if (diffDays === 1) {
            return "1 day ago";
        }


        return `${diffDays} days ago`;
    };


    // =========================================
    // LOAD INCIDENTS FROM BACKEND
    // =========================================

    const loadIncidents = async () => {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem("token");


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

                if (response.status === 401 ||
                    response.status === 403) {

                    throw new Error(
                        "Authentication failed. Please login again."
                    );
                }

                throw new Error(
                    "Failed to load incidents."
                );
            }


            const data =
                await response.json();


            const formattedIncidents =
                data.map((incident) => ({

                    databaseId:
                    incident.id,

                    id:
                    incident.incidentId,

                    title:
                    incident.title,

                    machine:
                    incident.machine,

                    location:
                    incident.location,

                    severity:
                    incident.severity,

                    status:
                    incident.status,

                    team:
                    incident.assignedTeam,

                    createdAt:
                    incident.createdAt,

                    time:
                        formatIncidentTime(
                            incident.createdAt
                        ),
                }));


            setIncidents(
                formattedIncidents
            );

        } catch (err) {

            console.error(
                "Error loading incidents:",
                err
            );

            setError(
                err.message ||
                "Unable to load incidents."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================
    // LOAD ON PAGE OPEN
    // =========================================

    useEffect(() => {

        loadIncidents();

    }, []);


    // =========================================
    // FILTER INCIDENTS
    // =========================================

    const filteredIncidents = useMemo(() => {

        return incidents.filter((incident) => {

            const searchValue =
                search.toLowerCase();


            const searchMatch =
                incident.title
                    .toLowerCase()
                    .includes(searchValue) ||

                incident.id
                    .toLowerCase()
                    .includes(searchValue) ||

                incident.machine
                    .toLowerCase()
                    .includes(searchValue) ||

                incident.team
                    .toLowerCase()
                    .includes(searchValue);


            const severityMatch =
                severityFilter === "All Severity" ||
                incident.severity === severityFilter;


            const statusMatch =
                statusFilter === "All Status" ||
                incident.status === statusFilter;


            return (
                searchMatch &&
                severityMatch &&
                statusMatch
            );
        });

    }, [
        incidents,
        search,
        severityFilter,
        statusFilter,
    ]);


    // =========================================
    // STATS
    // =========================================

    const openCount =
        incidents.filter(
            (item) =>
                item.status === "Open"
        ).length;


    const investigatingCount =
        incidents.filter(
            (item) =>
                item.status === "Investigating"
        ).length;


    const criticalCount =
        incidents.filter(
            (item) =>
                item.severity === "Critical" &&
                item.status !== "Resolved"
        ).length;


    const resolvedCount =
        incidents.filter(
            (item) =>
                item.status === "Resolved"
        ).length;


    // =========================================
    // RESOLVE INCIDENT
    // =========================================

    const resolveIncident = async (incidentId) => {

        const incident =
            incidents.find(
                (item) =>
                    item.id === incidentId
            );


        if (!incident) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_URL}/${incident.databaseId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: JSON.stringify({

                            incidentId:
                            incident.id,

                            title:
                            incident.title,

                            machine:
                            incident.machine,

                            location:
                            incident.location,

                            severity:
                            incident.severity,

                            status:
                                "Resolved",

                            assignedTeam:
                            incident.team,

                            createdAt:
                            incident.createdAt,
                        }),
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to resolve incident."
                );
            }


            setIncidents((current) =>
                current.map((item) =>
                    item.id === incidentId
                        ? {
                            ...item,
                            status: "Resolved",
                        }
                        : item
                )
            );

        } catch (err) {

            console.error(
                "Error resolving incident:",
                err
            );

            alert(
                "Unable to resolve incident."
            );
        }
    };


    // =========================================
    // CREATE NEW INCIDENT
    // =========================================

    const handleNewIncident = async (e) => {

        e.preventDefault();


        if (
            !newIncident.title ||
            !newIncident.machine
        ) {

            alert(
                "Incident title and machine are required."
            );

            return;
        }


        try {

            const token =
                localStorage.getItem("token");


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

                            incidentId:
                                `INC-${Date.now()}`,

                            title:
                            newIncident.title,

                            machine:
                            newIncident.machine,

                            location:
                                newIncident.location ||
                                "Production Floor",

                            severity:
                            newIncident.severity,

                            status:
                                "Open",

                            assignedTeam:
                            newIncident.team,

                            createdAt:
                                new Date().toISOString(),
                        }),
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to create incident."
                );
            }


            const createdIncident =
                await response.json();


            const formattedIncident = {

                databaseId:
                createdIncident.id,

                id:
                createdIncident.incidentId,

                title:
                createdIncident.title,

                machine:
                createdIncident.machine,

                location:
                createdIncident.location,

                severity:
                createdIncident.severity,

                status:
                createdIncident.status,

                team:
                createdIncident.assignedTeam,

                createdAt:
                createdIncident.createdAt,

                time:
                    "Just now",
            };


            setIncidents((current) => [
                formattedIncident,
                ...current,
            ]);


            setNewIncident({

                title: "",

                machine: "",

                location: "",

                severity: "Medium",

                team: "Maintenance Team",
            });


            setShowModal(false);

        } catch (err) {

            console.error(
                "Error creating incident:",
                err
            );

            alert(
                "Unable to create incident."
            );
        }
    };


    // =========================================
    // CSS CLASSES
    // =========================================

    const getSeverityClass = (severity) => {

        return severity
            .toLowerCase();
    };


    const getStatusClass = (status) => {

        return status
            .toLowerCase()
            .replace(" ", "-");
    };


    // =========================================
    // UI
    // =========================================

    return (

        <div className="incidents-page">


            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside className="incidents-sidebar">

                <div className="incidents-logo-area">

                    <div className="incidents-logo-icon">

                        <Factory size={22} />

                    </div>


                    <div className="incidents-logo-text">

                        FACTORY<span>X</span>

                    </div>

                </div>


                <div className="incidents-sidebar-content">

                    <div className="incidents-menu-title">
                        MAIN MENU
                    </div>


                    <Link
                        to="/dashboard"
                        className="incidents-menu-item"
                    >

                        <LayoutDashboard size={18} />

                        <span>
                            Dashboard
                        </span>

                    </Link>


                    <Link
                        to="/dashboard"
                        className="incidents-menu-item"
                    >

                        <Factory size={18} />

                        <span>
                            Factory
                        </span>

                    </Link>


                    <Link
                        to="/machines"
                        className="incidents-menu-item"
                    >

                        <Gauge size={18} />

                        <span>
                            Machines
                        </span>

                    </Link>


                    <Link
                        to="/production"
                        className="incidents-menu-item"
                    >

                        <Activity size={18} />

                        <span>
                            Production
                        </span>

                    </Link>


                    <Link
                        to="/maintenance"
                        className="incidents-menu-item"
                    >

                        <Wrench size={18} />

                        <span>
                            Maintenance
                        </span>

                    </Link>


                    <Link
                        to="/inventory"
                        className="incidents-menu-item"
                    >

                        <Package size={18} />

                        <span>
                            Inventory
                        </span>

                    </Link>


                    <Link
                        to="/quality"
                        className="incidents-menu-item"
                    >

                        <CheckCircle2 size={18} />

                        <span>
                            Quality
                        </span>

                    </Link>


                    <Link
                        to="/incidents"
                        className="incidents-menu-item active"
                    >

                        <AlertTriangle size={18} />

                        <span>
                            Incidents
                        </span>

                    </Link>


                    <div className="incidents-menu-title incidents-secondary-title">

                        INTELLIGENCE

                    </div>


                    <Link
                        to="/ai-assistant"
                        className="incidents-menu-item"
                    >

                        <BrainCircuit size={18} />

                        <span>
                            AI Assistant
                        </span>

                    </Link>


                    <div className="incidents-menu-item">

                        <ShieldAlert size={18} />

                        <span>
                            Documents
                        </span>

                    </div>


                    <div className="incidents-menu-item">

                        <Activity size={18} />

                        <span>
                            Reports
                        </span>

                    </div>

                </div>


                <div className="incidents-sidebar-bottom">

                    <div className="incidents-user">

                        <div className="incidents-user-avatar">
                            RK
                        </div>


                        <div className="incidents-user-info">

                            <div className="incidents-user-name">
                                Ravi Kumar
                            </div>


                            <div className="incidents-user-role">
                                Factory Manager
                            </div>

                        </div>

                    </div>

                </div>

            </aside>


            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <main className="incidents-main-content">


                {/* TOPBAR */}

                <header className="incidents-topbar">

                    <div className="incidents-topbar-left">

                        <div className="incidents-topbar-title">
                            INCIDENT MANAGEMENT
                        </div>


                        <div className="incidents-live">

                            <span className="incidents-live-dot"></span>

                            SYSTEM LIVE

                        </div>

                    </div>


                    <div className="incidents-topbar-actions">

                        <div className="incidents-notification">

                            <Bell size={19} />

                            <span className="incidents-notification-count">

                                {criticalCount}

                            </span>

                        </div>

                    </div>

                </header>


                {/* PAGE */}

                <section className="incidents-page-content">


                    {/* HEADER */}

                    <div className="incidents-page-header">

                        <div>

                            <div className="incidents-breadcrumb">

                                OPERATIONS / INCIDENTS

                            </div>


                            <h1 className="incidents-page-title">

                                Incident Management

                            </h1>


                            <p className="incidents-page-subtitle">

                                Monitor, investigate and resolve factory incidents.

                            </p>

                        </div>


                        <button
                            className="incidents-add-button"
                            onClick={() =>
                                setShowModal(true)
                            }
                        >

                            <Plus size={17} />

                            New Incident

                        </button>

                    </div>


                    {/* STATS */}

                    <div className="incidents-stats-row">


                        <div className="incidents-stat-card">

                            <div className="incidents-stat-label">
                                Open Incidents
                            </div>


                            <div className="incidents-stat-value gold">

                                {openCount}

                            </div>


                            <div className="incidents-stat-bottom">

                                Requires attention

                            </div>

                        </div>


                        <div className="incidents-stat-card">

                            <div className="incidents-stat-label">
                                Investigating
                            </div>


                            <div className="incidents-stat-value cyan">

                                {investigatingCount}

                            </div>


                            <div className="incidents-stat-bottom">

                                Under investigation

                            </div>

                        </div>


                        <div className="incidents-stat-card">

                            <div className="incidents-stat-label">
                                Critical Incidents
                            </div>


                            <div className="incidents-stat-value red">

                                {criticalCount}

                            </div>


                            <div className="incidents-stat-bottom">

                                Immediate attention

                            </div>

                        </div>


                        <div className="incidents-stat-card">

                            <div className="incidents-stat-label">
                                Resolved
                            </div>


                            <div className="incidents-stat-value green">

                                {resolvedCount}

                            </div>


                            <div className="incidents-stat-bottom">

                                Successfully closed

                            </div>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            style={{
                                padding: "12px 16px",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                background: "rgba(255, 70, 70, 0.08)",
                                border: "1px solid rgba(255, 70, 70, 0.25)",
                                color: "#ff7676",
                            }}
                        >

                            {error}

                        </div>

                    )}


                    {/* FILTER */}

                    <div className="incidents-filter-bar">


                        <div className="incidents-search-container">

                            <Search size={17} />


                            <input
                                type="text"
                                className="incidents-search-input"
                                placeholder="Search incidents, machines, teams..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="incidents-select-container">

                            <select
                                className="incidents-filter-select"
                                value={severityFilter}
                                onChange={(e) =>
                                    setSeverityFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    All Severity
                                </option>

                                <option>
                                    Critical
                                </option>

                                <option>
                                    High
                                </option>

                                <option>
                                    Medium
                                </option>

                                <option>
                                    Low
                                </option>

                            </select>


                            <ChevronDown size={15} />

                        </div>


                        <div className="incidents-select-container">

                            <select
                                className="incidents-filter-select"
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
                                    Open
                                </option>

                                <option>
                                    Investigating
                                </option>

                                <option>
                                    Resolved
                                </option>

                            </select>


                            <ChevronDown size={15} />

                        </div>

                    </div>


                    {/* INCIDENT TABLE */}

                    <div className="incidents-table-card">


                        <div className="incidents-table-header">

                            <div>

                                <h3 className="incidents-table-title">

                                    Active & Recent Incidents

                                </h3>


                                <div className="incidents-table-subtitle">

                                    Factory operational events and safety alerts

                                </div>

                            </div>


                            <div className="incidents-table-count">

                                {loading
                                    ? "Loading..."
                                    : `${filteredIncidents.length} incidents`}

                            </div>

                        </div>


                        <div className="incidents-table-wrapper">


                            <table className="incidents-table">


                                <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>INCIDENT</th>

                                    <th>MACHINE</th>

                                    <th>SEVERITY</th>

                                    <th>STATUS</th>

                                    <th>ASSIGNED TEAM</th>

                                    <th>TIME</th>

                                    <th>ACTION</th>

                                </tr>

                                </thead>


                                <tbody>


                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="incidents-empty-state"
                                        >

                                            Loading incidents...

                                        </td>

                                    </tr>

                                ) : filteredIncidents.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="incidents-empty-state"
                                        >

                                            No incidents found.

                                        </td>

                                    </tr>

                                ) : (

                                    filteredIncidents.map(
                                        (incident) => (

                                            <tr
                                                key={
                                                    incident.databaseId
                                                }
                                            >


                                                <td>

                                                    <span className="incident-id">

                                                        {incident.id}

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="incident-title">

                                                        {incident.title}

                                                    </div>


                                                    <div className="incident-location">

                                                        {incident.location}

                                                    </div>

                                                </td>


                                                <td>

                                                    <span className="incident-machine">

                                                        {incident.machine}

                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`incident-severity ${getSeverityClass(
                                                            incident.severity
                                                        )}`}
                                                    >

                                                        {incident.severity}

                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`incident-status ${getStatusClass(
                                                            incident.status
                                                        )}`}
                                                    >

                                                        {incident.status}

                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="incident-team">

                                                        {incident.team}

                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="incident-time">

                                                        {incident.time}

                                                    </span>

                                                </td>


                                                <td>


                                                    {incident.status !==
                                                    "Resolved" ? (

                                                        <button
                                                            className="incident-resolve-button"
                                                            onClick={() =>
                                                                resolveIncident(
                                                                    incident.id
                                                                )
                                                            }
                                                        >

                                                            <CheckCircle2
                                                                size={14}
                                                            />

                                                            Resolve

                                                        </button>

                                                    ) : (

                                                        <span className="incident-resolved">

                                                            <CheckCircle2
                                                                size={14}
                                                            />

                                                            Closed

                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* AI INSIGHT */}

                    <div className="incidents-ai-insight">


                        <div className="incidents-ai-icon">

                            <BrainCircuit size={22} />

                        </div>


                        <div className="incidents-ai-content">

                            <h4>
                                AI INCIDENT INSIGHT
                            </h4>


                            <p>

                                Two incidents currently require immediate attention.
                                CNC-101 shows a critical overheating event while
                                MILL-204 has triggered an emergency stop. Prioritize
                                safety inspection and maintenance response for these
                                machines.

                            </p>

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================
                NEW INCIDENT MODAL
            ===================================== */}

            {showModal && (

                <div
                    className="incident-modal-overlay"
                    onClick={() =>
                        setShowModal(false)
                    }
                >


                    <div
                        className="incident-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <div className="incident-modal-header">


                            <div>

                                <div className="incident-modal-label">

                                    INCIDENT MANAGEMENT

                                </div>


                                <h2>

                                    Create New Incident

                                </h2>

                            </div>


                            <button
                                className="incident-modal-close"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >

                                <XCircle size={21} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleNewIncident
                            }
                        >


                            <div className="incident-form-group">


                                <label>
                                    Incident Title
                                </label>


                                <input
                                    type="text"
                                    placeholder="e.g. Motor overheating"
                                    value={
                                        newIncident.title
                                    }
                                    onChange={(e) =>
                                        setNewIncident({
                                            ...newIncident,
                                            title:
                                            e.target.value,
                                        })
                                    }
                                />

                            </div>


                            <div className="incident-form-grid">


                                <div className="incident-form-group">


                                    <label>
                                        Machine
                                    </label>


                                    <input
                                        type="text"
                                        placeholder="e.g. CNC-105"
                                        value={
                                            newIncident.machine
                                        }
                                        onChange={(e) =>
                                            setNewIncident({
                                                ...newIncident,
                                                machine:
                                                e.target.value,
                                            })
                                        }
                                    />

                                </div>


                                <div className="incident-form-group">


                                    <label>
                                        Location
                                    </label>


                                    <input
                                        type="text"
                                        placeholder="Production Floor"
                                        value={
                                            newIncident.location
                                        }
                                        onChange={(e) =>
                                            setNewIncident({
                                                ...newIncident,
                                                location:
                                                e.target.value,
                                            })
                                        }
                                    />

                                </div>

                            </div>


                            <div className="incident-form-grid">


                                <div className="incident-form-group">


                                    <label>
                                        Severity
                                    </label>


                                    <select
                                        value={
                                            newIncident.severity
                                        }
                                        onChange={(e) =>
                                            setNewIncident({
                                                ...newIncident,
                                                severity:
                                                e.target.value,
                                            })
                                        }
                                    >

                                        <option>
                                            Critical
                                        </option>

                                        <option>
                                            High
                                        </option>

                                        <option>
                                            Medium
                                        </option>

                                        <option>
                                            Low
                                        </option>

                                    </select>

                                </div>


                                <div className="incident-form-group">


                                    <label>
                                        Assigned Team
                                    </label>


                                    <select
                                        value={
                                            newIncident.team
                                        }
                                        onChange={(e) =>
                                            setNewIncident({
                                                ...newIncident,
                                                team:
                                                e.target.value,
                                            })
                                        }
                                    >

                                        <option>
                                            Maintenance Team
                                        </option>

                                        <option>
                                            Mechanical Team
                                        </option>

                                        <option>
                                            Electrical Team
                                        </option>

                                        <option>
                                            Automation Team
                                        </option>

                                        <option>
                                            Safety Team
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="incident-modal-actions">


                                <button
                                    type="button"
                                    className="incident-cancel-button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="incident-submit-button"
                                >

                                    <Plus size={16} />

                                    Create Incident

                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


export default Incidents;