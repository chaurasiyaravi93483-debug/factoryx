import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    AlertTriangle,
    Bell,
    Box,
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    Factory,
    Gauge,
    LayoutDashboard,
    Package,
    Plus,
    Search,
    ShieldCheck,
    TrendingUp,
    Wrench,
    X,
} from "lucide-react";

import "../quality.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/machines`;

function Quality() {

    const [inspections, setInspections] = useState([]);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("All Results");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [newInspection, setNewInspection] = useState({
        qualityId: "",
        product: "",
        machine: "",
        team: "Quality Team A",
        qualityScore: "",
        defects: "",
        status: "Passed",
    });


    // =========================================================
    // TOKEN
    // =========================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // =========================================================
    // LOAD QUALITY
    // =========================================================

    const loadQuality = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            const response = await fetch(
                API_URL,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                    "Failed to load quality records."
                );
            }


            const data = await response.json();


            setInspections(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (err) {

            console.error(
                "Quality API Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load quality records."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadQuality();

    }, []);


    // =========================================================
    // FILTER
    // =========================================================

    const filteredInspections = useMemo(() => {

        return inspections.filter((item) => {

            const query = search.toLowerCase();


            const matchesSearch =
                (
                    item.qualityId ||
                    ""
                )
                    .toLowerCase()
                    .includes(query) ||

                (
                    item.product ||
                    ""
                )
                    .toLowerCase()
                    .includes(query) ||

                (
                    item.machine ||
                    ""
                )
                    .toLowerCase()
                    .includes(query) ||

                (
                    item.team ||
                    ""
                )
                    .toLowerCase()
                    .includes(query);


            const matchesFilter =
                filter === "All Results" ||
                item.status === filter;


            return (
                matchesSearch &&
                matchesFilter
            );

        });

    }, [
        inspections,
        search,
        filter,
    ]);


    // =========================================================
    // STATS
    // =========================================================

    const totalInspections =
        inspections.length;


    const totalDefects =
        inspections.reduce(
            (total, item) =>
                total +
                Number(item.defects || 0),
            0
        );


    const passedInspections =
        inspections.filter(
            (item) =>
                item.status === "Passed"
        ).length;


    const failedInspections =
        inspections.filter(
            (item) =>
                item.status === "Failed"
        ).length;


    const qualityRate =
        totalInspections > 0
            ? (
                inspections.reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.qualityScore || 0
                        ),
                    0
                ) /
                totalInspections
            ).toFixed(1)
            : "0.0";


    // =========================================================
    // ADD QUALITY
    // =========================================================

    const addInspection = async (e) => {

        e.preventDefault();


        if (
            !newInspection.qualityId.trim() ||
            !newInspection.product.trim() ||
            !newInspection.machine.trim() ||
            !newInspection.qualityScore ||
            newInspection.defects === ""
        ) {

            alert(
                "Please fill all required fields."
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

                        qualityId:
                            newInspection.qualityId
                                .trim()
                                .toUpperCase(),

                        product:
                            newInspection.product
                                .trim(),

                        machine:
                            newInspection.machine
                                .trim()
                                .toUpperCase(),

                        team:
                        newInspection.team,

                        qualityScore:
                            Number(
                                newInspection.qualityScore
                            ),

                        defects:
                            Number(
                                newInspection.defects
                            ),

                        status:
                        newInspection.status,
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
                    "Failed to create quality inspection."
                );
            }


            const createdInspection =
                await response.json();


            setInspections((previous) => [
                ...previous,
                createdInspection,
            ]);


            setNewInspection({
                qualityId: "",
                product: "",
                machine: "",
                team: "Quality Team A",
                qualityScore: "",
                defects: "",
                status: "Passed",
            });


            setShowModal(false);


        } catch (err) {

            console.error(
                "Add Quality Error:",
                err
            );

            alert(
                err.message ||
                "Unable to create quality inspection."
            );
        }
    };


    return (

        <div className="quality-page">


            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="quality-sidebar">


                <div className="quality-logo">

                    <div className="quality-logo-icon">
                        <Factory size={22} />
                    </div>

                    <div className="quality-logo-text">
                        FACTORY<span>X</span>
                    </div>

                </div>


                <div className="quality-menu">


                    <p className="quality-menu-title">
                        MAIN
                    </p>


                    <Link
                        to="/dashboard"
                        className="quality-menu-item"
                    >
                        <LayoutDashboard size={19} />
                        <span>Dashboard</span>
                    </Link>


                    <Link
                        to="/dashboard"
                        className="quality-menu-item"
                    >
                        <Factory size={19} />
                        <span>Factory</span>

                        <ChevronDown
                            size={14}
                            className="quality-arrow"
                        />
                    </Link>


                    <Link
                        to="/machines"
                        className="quality-menu-item"
                    >
                        <Gauge size={19} />
                        <span>Machines</span>
                    </Link>


                    <Link
                        to="/production"
                        className="quality-menu-item"
                    >
                        <TrendingUp size={19} />
                        <span>Production</span>
                    </Link>


                    <p className="quality-menu-title quality-operation">
                        OPERATIONS
                    </p>


                    <Link
                        to="/maintenance"
                        className="quality-menu-item"
                    >
                        <Wrench size={19} />
                        <span>Maintenance</span>
                    </Link>


                    <Link
                        to="/inventory"
                        className="quality-menu-item"
                    >
                        <Package size={19} />
                        <span>Inventory</span>
                    </Link>


                    <Link
                        to="/quality"
                        className="quality-menu-item active"
                    >
                        <CheckCircle2 size={19} />
                        <span>Quality</span>
                    </Link>


                    <Link
                        to="/incidents"
                        className="quality-menu-item"
                    >
                        <AlertTriangle size={19} />
                        <span>Incidents</span>
                    </Link>


                    <p className="quality-menu-title quality-operation">
                        INTELLIGENCE
                    </p>


                    <Link
                        to="/ai-assistant"
                        className="quality-menu-item ai-item"
                    >
                        <BrainCircuit size={19} />
                        <span>AI Assistant</span>
                    </Link>


                    <Link
                        to="/documents"
                        className="quality-menu-item"
                    >
                        <Box size={19} />
                        <span>Documents</span>
                    </Link>


                    <Link
                        to="/reports"
                        className="quality-menu-item"
                    >
                        <ShieldCheck size={19} />
                        <span>Reports</span>
                    </Link>

                </div>


                {/* USER */}

                <div className="quality-sidebar-user">

                    <div className="quality-avatar">
                        RK
                    </div>

                    <div className="quality-user-info">

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

            <main className="quality-main">


                {/* TOPBAR */}

                <header className="quality-topbar">


                    <div className="quality-breadcrumb">

                        <span>
                            Factory
                        </span>

                        <b>
                            /
                        </b>

                        <strong>
                            Quality
                        </strong>

                    </div>


                    <div className="quality-top-right">

                        <button
                            className="quality-notification"
                            type="button"
                        >

                            <Bell size={20} />

                            <span>
                                {failedInspections}
                            </span>

                        </button>


                        <div className="quality-top-user">

                            <div className="quality-top-avatar">
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

                            <ChevronDown size={15} />

                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <div className="quality-content">


                    {/* HEADER */}

                    <div className="quality-page-header">

                        <div>

                            <p>
                                QUALITY CONTROL
                            </p>

                            <h1>
                                Quality
                            </h1>

                            <span>
                                Monitor product quality, inspections
                                and defect performance.
                            </span>

                        </div>


                        <button
                            className="quality-add-button"
                            type="button"
                            onClick={() =>
                                setShowModal(true)
                            }
                        >

                            <Plus size={18} />

                            New Inspection

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
                                    "rgba(255,70,70,0.08)",
                                border:
                                    "1px solid rgba(255,70,70,0.25)",
                                color: "#ff7676",
                            }}
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div className="quality-stats">


                        <div className="quality-stat-card">

                            <div className="quality-stat-icon">
                                <CheckCircle2 size={22} />
                            </div>

                            <div>

                                <span>
                                    Quality Rate
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : `${qualityRate}%`}
                                </strong>

                                <small>
                                    Current average score
                                </small>

                            </div>

                        </div>


                        <div className="quality-stat-card">

                            <div className="quality-stat-icon cyan">
                                <CheckCircle2 size={22} />
                            </div>

                            <div>

                                <span>
                                    Inspections
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : totalInspections}
                                </strong>

                                <small>
                                    Records in system
                                </small>

                            </div>

                        </div>


                        <div className="quality-stat-card">

                            <div className="quality-stat-icon yellow">
                                <AlertTriangle size={22} />
                            </div>

                            <div>

                                <span>
                                    Defects
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : totalDefects}
                                </strong>

                                <small>
                                    Total recorded defects
                                </small>

                            </div>

                        </div>


                        <div className="quality-stat-card">

                            <div className="quality-stat-icon red">
                                <AlertTriangle size={22} />
                            </div>

                            <div>

                                <span>
                                    Failed Inspections
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : String(
                                            failedInspections
                                        ).padStart(2, "0")}
                                </strong>

                                <small>
                                    Requires review
                                </small>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SEARCH / FILTER
                    ================================================= */}

                    <div className="quality-filter">


                        <div className="quality-search">

                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search inspection, product or machine..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="quality-select">

                            <span>
                                Result:
                            </span>

                            <select
                                value={filter}
                                onChange={(e) =>
                                    setFilter(
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    All Results
                                </option>

                                <option>
                                    Passed
                                </option>

                                <option>
                                    Warning
                                </option>

                                <option>
                                    Failed
                                </option>

                            </select>

                            <ChevronDown size={14} />

                        </div>

                    </div>


                    {/* =================================================
                        QUALITY TABLE
                    ================================================= */}

                    <section className="quality-panel">


                        <div className="quality-panel-header">

                            <div>

                                <h2>
                                    Quality Inspections
                                </h2>

                                <p>
                                    Latest production quality results
                                </p>

                            </div>


                            <span>
                                {filteredInspections.length} Results
                            </span>

                        </div>


                        {loading ? (

                            <div
                                style={{
                                    padding: "40px",
                                    textAlign: "center",
                                }}
                            >
                                Loading quality records...
                            </div>

                        ) : (

                            <div className="quality-table-wrapper">

                                <table className="quality-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            INSPECTION
                                        </th>

                                        <th>
                                            PRODUCT
                                        </th>

                                        <th>
                                            MACHINE
                                        </th>

                                        <th>
                                            QUALITY SCORE
                                        </th>

                                        <th>
                                            DEFECTS
                                        </th>

                                        <th>
                                            INSPECTOR
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {filteredInspections.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                <td>

                                                    <div className="quality-inspection">

                                                        <div>
                                                            <ShieldCheck
                                                                size={17}
                                                            />
                                                        </div>

                                                        <section>

                                                            <strong>
                                                                {
                                                                    item.qualityId
                                                                }
                                                            </strong>

                                                            <span>
                                                                Backend Record
                                                            </span>

                                                        </section>

                                                    </div>

                                                </td>


                                                <td>

                                                    <div className="quality-product">

                                                        <strong>
                                                            {
                                                                item.product
                                                            }
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>
                                                    {
                                                        item.machine
                                                    }
                                                </td>


                                                <td>

                                                    <div className="quality-score">

                                                        <strong>
                                                            {
                                                                Number(
                                                                    item.qualityScore ||
                                                                    0
                                                                ).toFixed(1)
                                                            }%
                                                        </strong>

                                                        <div>

                                                            <span
                                                                style={{
                                                                    width:
                                                                        `${Math.min(
                                                                            Math.max(
                                                                                Number(
                                                                                    item.qualityScore ||
                                                                                    0
                                                                                ),
                                                                                0
                                                                            ),
                                                                            100
                                                                        )}%`,
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            Number(
                                                                item.defects ||
                                                                0
                                                            ) > 2
                                                                ? "defects high"
                                                                : Number(
                                                                    item.defects ||
                                                                    0
                                                                ) > 0
                                                                    ? "defects medium"
                                                                    : "defects zero"
                                                        }
                                                    >
                                                        {
                                                            item.defects
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {
                                                        item.team
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={`quality-status ${
                                                            item.status === "Passed"
                                                                ? "passed"
                                                                : item.status === "Warning"
                                                                    ? "warning"
                                                                    : "failed"
                                                        }`}
                                                    >
                                                        {
                                                            item.status
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        )}


                        {!loading &&
                            filteredInspections.length === 0 && (

                                <div
                                    style={{
                                        padding: "40px",
                                        textAlign: "center",
                                    }}
                                >

                                    <Search size={38} />

                                    <h3>
                                        No quality inspections found
                                    </h3>

                                    <p>
                                        Try changing your search
                                        or result filter.
                                    </p>

                                </div>

                            )}

                    </section>


                    {/* =================================================
                        AI INSIGHT
                    ================================================= */}

                    <section className="quality-ai">

                        <div className="quality-ai-icon">

                            <BrainCircuit size={24} />

                        </div>


                        <div>

                            <span>
                                FACTORYX AI INSIGHT
                            </span>

                            <h3>

                                {failedInspections > 0
                                    ? "Quality issues require review."
                                    : "Quality performance is stable."}

                            </h3>

                            <p>

                                {failedInspections > 0
                                    ? `${failedInspections} failed inspection(s) are currently recorded. Review these results before the next production cycle.`
                                    : "No failed inspections are currently recorded in the system."}

                            </p>

                        </div>


                        <Link
                            to="/ai-assistant"
                            className="quality-ai-button"
                        >

                            Analyze Quality

                            <BrainCircuit size={16} />

                        </Link>

                    </section>

                </div>

            </main>


            {/* =====================================================
                NEW INSPECTION MODAL
            ===================================================== */}

            {showModal && (

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 99999,

                        background:
                            "rgba(0, 10, 12, 0.80)",

                        backdropFilter:
                            "blur(6px)",

                        WebkitBackdropFilter:
                            "blur(6px)",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        padding: "24px",
                    }}

                    onClick={() =>
                        setShowModal(false)
                    }
                >

                    <div
                        style={{
                            width: "560px",
                            maxWidth: "100%",

                            maxHeight:
                                "calc(100vh - 48px)",

                            overflowY: "auto",

                            background:
                                "linear-gradient(145deg, #073235, #042528)",

                            border:
                                "1px solid rgba(91, 136, 142, 0.25)",

                            borderRadius: "16px",

                            color: "#eafcff",

                            boxShadow:
                                "0 25px 70px rgba(0,0,0,.6)",
                        }}

                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* =================================================
                            MODAL HEADER
                        ================================================= */}

                        <div
                            style={{
                                padding: "21px 23px",

                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",

                                borderBottom:
                                    "1px solid rgba(91,136,142,.12)",
                            }}
                        >

                            <div>

                                <span
                                    style={{
                                        display: "block",

                                        marginBottom: "5px",

                                        color: "#607b80",

                                        fontSize: "9px",

                                        fontWeight: 800,

                                        letterSpacing: "1.6px",
                                    }}
                                >
                                    QUALITY CONTROL
                                </span>


                                <h2
                                    style={{
                                        margin: 0,

                                        color: "#ffffff",

                                        fontSize: "22px",

                                        fontWeight: 800,
                                    }}
                                >
                                    New Inspection
                                </h2>

                            </div>


                            <button
                                type="button"

                                onClick={() =>
                                    setShowModal(false)
                                }

                                style={{
                                    width: "36px",
                                    height: "36px",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    border:
                                        "1px solid rgba(91,136,142,.18)",

                                    borderRadius: "8px",

                                    background:
                                        "rgba(255,255,255,.035)",

                                    color: "#789398",

                                    cursor: "pointer",
                                }}
                            >
                                <X size={21} />
                            </button>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={addInspection}

                            style={{
                                padding:
                                    "21px 23px 23px",
                            }}
                        >


                            {/* QUALITY ID */}

                            <div
                                style={{
                                    marginBottom: "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display: "block",

                                        marginBottom: "7px",

                                        color: "#789398",

                                        fontSize: "10px",

                                        fontWeight: 800,
                                    }}
                                >
                                    Quality ID
                                </label>


                                <input
                                    type="text"

                                    placeholder="Example: QC-1006"

                                    value={
                                        newInspection.qualityId
                                    }

                                    onChange={(e) =>
                                        setNewInspection({
                                            ...newInspection,
                                            qualityId:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width: "100%",
                                        height: "43px",

                                        padding: "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius: "8px",

                                        outline: "none",

                                        background:
                                            "#031a1d",

                                        color: "#eafcff",

                                        fontSize: "12px",
                                    }}
                                />

                            </div>


                            {/* PRODUCT */}

                            <div
                                style={{
                                    marginBottom: "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display: "block",

                                        marginBottom: "7px",

                                        color: "#789398",

                                        fontSize: "10px",

                                        fontWeight: 800,
                                    }}
                                >
                                    Product
                                </label>


                                <input
                                    type="text"

                                    placeholder="Example: Motor Housing"

                                    value={
                                        newInspection.product
                                    }

                                    onChange={(e) =>
                                        setNewInspection({
                                            ...newInspection,
                                            product:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width: "100%",
                                        height: "43px",

                                        padding: "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius: "8px",

                                        outline: "none",

                                        background:
                                            "#031a1d",

                                        color: "#eafcff",

                                        fontSize: "12px",
                                    }}
                                />

                            </div>


                            {/* MACHINE */}

                            <div
                                style={{
                                    marginBottom: "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display: "block",

                                        marginBottom: "7px",

                                        color: "#789398",

                                        fontSize: "10px",

                                        fontWeight: 800,
                                    }}
                                >
                                    Machine
                                </label>


                                <input
                                    type="text"

                                    placeholder="Example: CNC-103"

                                    value={
                                        newInspection.machine
                                    }

                                    onChange={(e) =>
                                        setNewInspection({
                                            ...newInspection,
                                            machine:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width: "100%",
                                        height: "43px",

                                        padding: "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius: "8px",

                                        outline: "none",

                                        background:
                                            "#031a1d",

                                        color: "#eafcff",

                                        fontSize: "12px",
                                    }}
                                />

                            </div>


                            {/* QUALITY TEAM */}

                            <div
                                style={{
                                    marginBottom: "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display: "block",

                                        marginBottom: "7px",

                                        color: "#789398",

                                        fontSize: "10px",

                                        fontWeight: 800,
                                    }}
                                >
                                    Quality Team
                                </label>


                                <select
                                    value={
                                        newInspection.team
                                    }

                                    onChange={(e) =>
                                        setNewInspection({
                                            ...newInspection,
                                            team:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width: "100%",
                                        height: "43px",

                                        padding: "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius: "8px",

                                        outline: "none",

                                        background:
                                            "#031a1d",

                                        color: "#eafcff",

                                        fontSize: "12px",

                                        cursor: "pointer",
                                    }}
                                >

                                    <option>
                                        Quality Team A
                                    </option>

                                    <option>
                                        Quality Team B
                                    </option>

                                    <option>
                                        Quality Team C
                                    </option>

                                </select>

                            </div>


                            {/* SCORE + DEFECTS */}

                            <div
                                style={{
                                    display: "grid",

                                    gridTemplateColumns:
                                        "1fr 1fr",

                                    gap: "14px",
                                }}
                            >


                                {/* SCORE */}

                                <div
                                    style={{
                                        marginBottom: "15px",
                                    }}
                                >

                                    <label
                                        style={{
                                            display: "block",

                                            marginBottom: "7px",

                                            color: "#789398",

                                            fontSize: "10px",

                                            fontWeight: 800,
                                        }}
                                    >
                                        Quality Score
                                    </label>


                                    <input
                                        type="number"

                                        min="0"

                                        max="100"

                                        step="0.1"

                                        placeholder="Example: 96.5"

                                        value={
                                            newInspection.qualityScore
                                        }

                                        onChange={(e) =>
                                            setNewInspection({
                                                ...newInspection,
                                                qualityScore:
                                                e.target.value,
                                            })
                                        }

                                        style={{
                                            width: "100%",
                                            height: "43px",

                                            padding:
                                                "0 12px",

                                            boxSizing:
                                                "border-box",

                                            border:
                                                "1px solid rgba(91,136,142,.16)",

                                            borderRadius:
                                                "8px",

                                            outline: "none",

                                            background:
                                                "#031a1d",

                                            color: "#eafcff",

                                            fontSize: "12px",
                                        }}
                                    />

                                </div>


                                {/* DEFECTS */}

                                <div
                                    style={{
                                        marginBottom: "15px",
                                    }}
                                >

                                    <label
                                        style={{
                                            display: "block",

                                            marginBottom: "7px",

                                            color: "#789398",

                                            fontSize: "10px",

                                            fontWeight: 800,
                                        }}
                                    >
                                        Defects
                                    </label>


                                    <input
                                        type="number"

                                        min="0"

                                        placeholder="Example: 1"

                                        value={
                                            newInspection.defects
                                        }

                                        onChange={(e) =>
                                            setNewInspection({
                                                ...newInspection,
                                                defects:
                                                e.target.value,
                                            })
                                        }

                                        style={{
                                            width: "100%",
                                            height: "43px",

                                            padding:
                                                "0 12px",

                                            boxSizing:
                                                "border-box",

                                            border:
                                                "1px solid rgba(91,136,142,.16)",

                                            borderRadius:
                                                "8px",

                                            outline: "none",

                                            background:
                                                "#031a1d",

                                            color: "#eafcff",

                                            fontSize: "12px",
                                        }}
                                    />

                                </div>

                            </div>


                            {/* RESULT */}

                            <div
                                style={{
                                    marginBottom: "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display: "block",

                                        marginBottom: "7px",

                                        color: "#789398",

                                        fontSize: "10px",

                                        fontWeight: 800,
                                    }}
                                >
                                    Result
                                </label>


                                <select
                                    value={
                                        newInspection.status
                                    }

                                    onChange={(e) =>
                                        setNewInspection({
                                            ...newInspection,
                                            status:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width: "100%",
                                        height: "43px",

                                        padding: "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius: "8px",

                                        outline: "none",

                                        background:
                                            "#031a1d",

                                        color: "#eafcff",

                                        fontSize: "12px",

                                        cursor: "pointer",
                                    }}
                                >

                                    <option>
                                        Passed
                                    </option>

                                    <option>
                                        Warning
                                    </option>

                                    <option>
                                        Failed
                                    </option>

                                </select>

                            </div>


                            {/* BUTTONS */}

                            <div
                                style={{
                                    marginTop: "20px",

                                    paddingTop: "17px",

                                    display: "flex",

                                    justifyContent:
                                        "flex-end",

                                    gap: "10px",

                                    borderTop:
                                        "1px solid rgba(91,136,142,.1)",
                                }}
                            >

                                <button
                                    type="button"

                                    onClick={() =>
                                        setShowModal(false)
                                    }

                                    style={{
                                        minHeight: "41px",

                                        padding:
                                            "0 16px",

                                        border:
                                            "1px solid rgba(91,136,142,.18)",

                                        borderRadius: "8px",

                                        background:
                                            "rgba(255,255,255,.035)",

                                        color: "#789398",

                                        fontSize: "11px",

                                        fontWeight: 800,

                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"

                                    style={{
                                        minHeight: "41px",

                                        padding:
                                            "0 16px",

                                        display: "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        gap: "7px",

                                        border: "none",

                                        borderRadius: "8px",

                                        background:
                                            "#ffd54f",

                                        color: "#071719",

                                        fontSize: "11px",

                                        fontWeight: 800,

                                        cursor: "pointer",

                                        boxShadow:
                                            "0 7px 20px rgba(255,213,79,.12)",
                                    }}
                                >

                                    <CheckCircle2
                                        size={18}
                                    />

                                    Save Inspection

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Quality;