import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    AlertTriangle,
    Bell,
    Box,
    BrainCircuit,
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
    CheckCircle2,
} from "lucide-react";

import "../inventory.css";

const API_URL = "http://localhost:8081/api/inventory";

function Inventory() {

    const [inventory, setInventory] = useState([]);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("All Status");

    const [category, setCategory] = useState("All Categories");

    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [newItem, setNewItem] = useState({
        itemCode: "",
        itemName: "",
        category: "Machine Parts",
        quantity: "",
        minimumStock: "",
        unit: "Units",
        location: "",
        supplier: "",
    });


    // =========================================================
    // TOKEN
    // =========================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // =========================================================
    // LOAD INVENTORY
    // =========================================================

    const loadInventory = async () => {

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
                    "Failed to load inventory."
                );
            }


            const data = await response.json();


            setInventory(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (err) {

            console.error(
                "Inventory API Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load inventory."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // LOAD PAGE
    // =========================================================

    useEffect(() => {

        loadInventory();

    }, []);


    // =========================================================
    // FILTER
    // =========================================================

    const filteredInventory = useMemo(() => {

        return inventory.filter((item) => {

            const searchText =
                search.toLowerCase();


            const matchesSearch =
                (
                    item.itemName ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText) ||

                (
                    item.itemCode ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText) ||

                (
                    item.category ||
                    ""
                )
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                status === "All Status" ||
                item.status === status;


            const matchesCategory =
                category === "All Categories" ||
                item.category === category;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );

        });

    }, [
        inventory,
        search,
        status,
        category,
    ]);


    // =========================================================
    // STATS
    // =========================================================

    const totalItems =
        inventory.length;


    const inStock =
        inventory.filter(
            (item) =>
                item.status === "In Stock"
        ).length;


    const lowStock =
        inventory.filter(
            (item) =>
                item.status === "Low Stock"
        ).length;


    const outOfStock =
        inventory.filter(
            (item) =>
                item.status === "Out of Stock"
        ).length;


    // =========================================================
    // CATEGORIES
    // =========================================================

    const categories = useMemo(() => {

        const values =
            inventory
                .map(
                    (item) =>
                        item.category
                )
                .filter(Boolean);


        return [
            ...new Set(values),
        ];

    }, [inventory]);


    // =========================================================
    // ADD INVENTORY
    // =========================================================

    const addInventory = async (e) => {

        e.preventDefault();


        if (
            !newItem.itemCode.trim() ||
            !newItem.itemName.trim() ||
            newItem.quantity === "" ||
            newItem.minimumStock === ""
        ) {

            alert(
                "Item Code, Item Name, Quantity and Minimum Stock are required."
            );

            return;
        }


        try {

            const token = getToken();


            const quantity =
                Number(
                    newItem.quantity
                );


            const minimumStock =
                Number(
                    newItem.minimumStock
                );


            let calculatedStatus =
                "In Stock";


            if (quantity === 0) {

                calculatedStatus =
                    "Out of Stock";

            } else if (
                quantity <= minimumStock
            ) {

                calculatedStatus =
                    "Low Stock";
            }


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

                            itemCode:
                                newItem.itemCode
                                    .trim()
                                    .toUpperCase(),

                            itemName:
                                newItem.itemName
                                    .trim(),

                            category:
                            newItem.category,

                            quantity:
                            quantity,

                            minimumStock:
                            minimumStock,

                            unit:
                            newItem.unit,

                            status:
                            calculatedStatus,

                            location:
                                newItem.location
                                    .trim() ||
                                null,

                            supplier:
                                newItem.supplier
                                    .trim() ||
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
                    "Failed to add inventory item."
                );
            }


            const createdItem =
                await response.json();


            setInventory(
                (previous) => [
                    ...previous,
                    createdItem,
                ]
            );


            setNewItem({
                itemCode: "",
                itemName: "",
                category: "Machine Parts",
                quantity: "",
                minimumStock: "",
                unit: "Units",
                location: "",
                supplier: "",
            });


            setShowModal(false);


        } catch (err) {

            console.error(
                "Add inventory error:",
                err
            );

            alert(
                err.message ||
                "Unable to add inventory."
            );
        }
    };


    return (

        <div className="inventory-page">


            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="inventory-sidebar">


                <div className="inventory-logo">

                    <div className="inventory-logo-icon">
                        <Factory size={22} />
                    </div>

                    <div>
                        FACTORY<span>X</span>
                    </div>

                </div>


                <div className="inventory-menu">


                    <p className="inventory-menu-title">
                        MAIN
                    </p>


                    <Link
                        to="/dashboard"
                        className="inventory-menu-item"
                    >
                        <LayoutDashboard size={19} />
                        <span>Dashboard</span>
                    </Link>


                    <Link
                        to="/dashboard"
                        className="inventory-menu-item"
                    >
                        <Factory size={19} />

                        <span>
                            Factory
                        </span>

                        <ChevronDown
                            size={14}
                            className="inventory-arrow"
                        />
                    </Link>


                    <Link
                        to="/machines"
                        className="inventory-menu-item"
                    >
                        <Gauge size={19} />
                        <span>Machines</span>
                    </Link>


                    <Link
                        to="/production"
                        className="inventory-menu-item"
                    >
                        <TrendingUp size={19} />
                        <span>Production</span>
                    </Link>


                    <p className="inventory-menu-title inventory-operation-title">
                        OPERATIONS
                    </p>


                    <Link
                        to="/maintenance"
                        className="inventory-menu-item"
                    >
                        <Wrench size={19} />
                        <span>Maintenance</span>
                    </Link>


                    <Link
                        to="/inventory"
                        className="inventory-menu-item active"
                    >
                        <Package size={19} />
                        <span>Inventory</span>
                    </Link>


                    <Link
                        to="/quality"
                        className="inventory-menu-item"
                    >
                        <ShieldCheck size={19} />
                        <span>Quality</span>
                    </Link>


                    <Link
                        to="/incidents"
                        className="inventory-menu-item"
                    >
                        <AlertTriangle size={19} />
                        <span>Incidents</span>
                    </Link>


                    <p className="inventory-menu-title inventory-operation-title">
                        INTELLIGENCE
                    </p>


                    <Link
                        to="/ai-assistant"
                        className="inventory-menu-item ai-item"
                    >
                        <BrainCircuit size={19} />
                        <span>AI Assistant</span>
                    </Link>


                    <Link
                        to="/documents"
                        className="inventory-menu-item"
                    >
                        <Box size={19} />
                        <span>Documents</span>
                    </Link>


                    <Link
                        to="/reports"
                        className="inventory-menu-item"
                    >
                        <ShieldCheck size={19} />
                        <span>Reports</span>
                    </Link>

                </div>


                {/* USER */}

                <div className="inventory-sidebar-user">

                    <div className="inventory-user-avatar">
                        RK
                    </div>

                    <div className="inventory-user-info">

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

            <main className="inventory-main">


                {/* TOPBAR */}

                <header className="inventory-topbar">

                    <div className="inventory-breadcrumb">

                        <span>
                            Factory
                        </span>

                        <b>
                            /
                        </b>

                        <strong>
                            Inventory
                        </strong>

                    </div>


                    <div className="inventory-top-right">

                        <button
                            className="inventory-notification"
                            type="button"
                        >

                            <Bell size={20} />

                            <span>
                                {outOfStock + lowStock}
                            </span>

                        </button>


                        <div className="inventory-top-user">

                            <div className="inventory-top-avatar">
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

                <div className="inventory-content">


                    {/* HEADER */}

                    <div className="inventory-page-header">

                        <div>

                            <p>
                                INVENTORY MANAGEMENT
                            </p>

                            <h1>
                                Inventory
                            </h1>

                            <span>
                                Monitor materials, machine parts and
                                stock levels in real time.
                            </span>

                        </div>


                        <button
                            className="inventory-add-button"
                            type="button"
                            onClick={() =>
                                setShowModal(true)
                            }
                        >

                            <Plus size={18} />

                            Add Inventory

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

                    <div className="inventory-stats">


                        <div className="inventory-stat-card">

                            <div className="inventory-stat-icon">
                                <Package size={21} />
                            </div>

                            <div>

                                <span>
                                    Total Items
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : totalItems}
                                </strong>

                                <small>
                                    Across all categories
                                </small>

                            </div>

                        </div>


                        <div className="inventory-stat-card">

                            <div className="inventory-stat-icon cyan">
                                <Box size={21} />
                            </div>

                            <div>

                                <span>
                                    In Stock
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : inStock}
                                </strong>

                                <small>
                                    Items available
                                </small>

                            </div>

                            <b>
                                {totalItems > 0
                                    ? `${(
                                        (inStock /
                                            totalItems) *
                                        100
                                    ).toFixed(1)}%`
                                    : "0%"}
                            </b>

                        </div>


                        <div className="inventory-stat-card warning-card">

                            <div className="inventory-stat-icon yellow">
                                <AlertTriangle size={21} />
                            </div>

                            <div>

                                <span>
                                    Low Stock
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : lowStock}
                                </strong>

                                <small>
                                    Need replenishment
                                </small>

                            </div>

                            <b>
                                Attention
                            </b>

                        </div>


                        <div className="inventory-stat-card danger-card">

                            <div className="inventory-stat-icon red">
                                <AlertTriangle size={21} />
                            </div>

                            <div>

                                <span>
                                    Out of Stock
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : String(
                                            outOfStock
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                </strong>

                                <small>
                                    Immediate action required
                                </small>

                            </div>

                            <b>
                                Critical
                            </b>

                        </div>

                    </div>


                    {/* =================================================
                        FILTER
                    ================================================= */}

                    <div className="inventory-filter">


                        <div className="inventory-search">

                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search item, ID or category..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="inventory-select">

                            <span>
                                Status:
                            </span>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    All Status
                                </option>

                                <option>
                                    In Stock
                                </option>

                                <option>
                                    Low Stock
                                </option>

                                <option>
                                    Out of Stock
                                </option>

                            </select>

                            <ChevronDown size={14} />

                        </div>


                        <div className="inventory-select">

                            <span>
                                Category:
                            </span>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option>
                                    All Categories
                                </option>

                                {categories.map(
                                    (itemCategory) => (

                                        <option
                                            key={
                                                itemCategory
                                            }
                                        >
                                            {itemCategory}
                                        </option>

                                    )
                                )}

                            </select>

                            <ChevronDown size={14} />

                        </div>

                    </div>


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <section className="inventory-panel">


                        <div className="inventory-panel-header">

                            <div>

                                <h2>
                                    Inventory Items
                                </h2>

                                <p>
                                    Current stock overview
                                </p>

                            </div>

                            <span>
                                {filteredInventory.length} Items
                            </span>

                        </div>


                        {loading ? (

                            <div
                                style={{
                                    padding:
                                        "40px",

                                    textAlign:
                                        "center",
                                }}
                            >
                                Loading inventory...
                            </div>

                        ) : (

                            <div className="inventory-table-wrapper">

                                <table className="inventory-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            ITEM
                                        </th>

                                        <th>
                                            CATEGORY
                                        </th>

                                        <th>
                                            STOCK LEVEL
                                        </th>

                                        <th>
                                            MINIMUM
                                        </th>

                                        <th>
                                            UNIT
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            ACTION
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {filteredInventory.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                <td>

                                                    <div className="inventory-item-name">

                                                        <div>
                                                            <Package size={17} />
                                                        </div>

                                                        <section>

                                                            <strong>
                                                                {
                                                                    item.itemName
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    item.itemCode
                                                                }
                                                            </span>

                                                        </section>

                                                    </div>

                                                </td>


                                                <td>
                                                    {
                                                        item.category
                                                    }
                                                </td>


                                                <td>

                                                    <div className="stock-level">

                                                        <div className="stock-bar">

                                                            <span
                                                                style={{
                                                                    width:
                                                                        `${Math.min(
                                                                            (
                                                                                Number(
                                                                                    item.quantity ||
                                                                                    0
                                                                                ) /
                                                                                Math.max(
                                                                                    Number(
                                                                                        item.minimumStock ||
                                                                                        0
                                                                                    ) *
                                                                                    2,
                                                                                    Number(
                                                                                        item.quantity ||
                                                                                        0
                                                                                    )
                                                                                )
                                                                            ) *
                                                                            100,
                                                                            100
                                                                        )}%`,
                                                                }}
                                                            />

                                                        </div>

                                                        <strong>
                                                            {
                                                                item.quantity
                                                            }
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>
                                                    {
                                                        item.minimumStock
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        item.unit
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={`inventory-status ${
                                                            item.status ===
                                                            "In Stock"
                                                                ? "stock-ok"
                                                                : item.status ===
                                                                "Low Stock"
                                                                    ? "stock-low"
                                                                    : "stock-out"
                                                        }`}
                                                    >
                                                        {
                                                            item.status
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <button
                                                        className="inventory-action"
                                                        type="button"
                                                    >
                                                        •••
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        )}


                        {!loading &&
                            filteredInventory.length === 0 && (

                                <div
                                    style={{
                                        padding:
                                            "40px",

                                        textAlign:
                                            "center",
                                    }}
                                >

                                    <Search size={38} />

                                    <h3>
                                        No inventory items found
                                    </h3>

                                    <p>
                                        Try changing your
                                        search or filters.
                                    </p>

                                </div>

                            )}

                    </section>


                    {/* =================================================
                        AI INSIGHT
                    ================================================= */}

                    <section className="inventory-ai">

                        <div className="inventory-ai-icon">
                            <BrainCircuit size={23} />
                        </div>

                        <div>

                            <span>
                                FACTORYX AI INSIGHT
                            </span>

                            <h3>

                                {lowStock +
                                outOfStock >
                                0
                                    ? "Inventory replenishment required."
                                    : "Inventory levels are currently healthy."}

                            </h3>

                            <p>

                                {lowStock +
                                outOfStock >
                                0
                                    ? `${lowStock} low-stock and ${outOfStock} out-of-stock items require attention to avoid production interruptions.`
                                    : "No inventory items are currently below their stock thresholds."}

                            </p>

                        </div>


                        <Link
                            to="/ai-assistant"
                            className="inventory-ai-button"
                        >

                            Ask AI

                            <BrainCircuit size={16} />

                        </Link>

                    </section>

                </div>

            </main>


            {/* =====================================================
                ADD INVENTORY MODAL
            ===================================================== */}

            {showModal && (

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 99999,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        padding: "24px",

                        background:
                            "rgba(0, 10, 12, 0.80)",

                        backdropFilter:
                            "blur(6px)",

                        WebkitBackdropFilter:
                            "blur(6px)",
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
                                "1px solid rgba(91,136,142,.25)",

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
                                padding:
                                    "21px 23px",

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

                                        marginBottom:
                                            "5px",

                                        color:
                                            "#607b80",

                                        fontSize:
                                            "9px",

                                        fontWeight:
                                            800,

                                        letterSpacing:
                                            "1.6px",
                                    }}
                                >
                                    FACTORY STOCK
                                </span>


                                <h2
                                    style={{
                                        margin: 0,

                                        color:
                                            "#ffffff",

                                        fontSize:
                                            "22px",

                                        fontWeight:
                                            800,
                                    }}
                                >
                                    Add Inventory
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

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    border:
                                        "1px solid rgba(91,136,142,.18)",

                                    borderRadius:
                                        "8px",

                                    background:
                                        "rgba(255,255,255,.035)",

                                    color:
                                        "#789398",

                                    cursor:
                                        "pointer",
                                }}
                            >
                                <X size={21} />
                            </button>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={addInventory}

                            style={{
                                padding:
                                    "21px 23px 23px",
                            }}
                        >


                            {/* ITEM CODE */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "7px",

                                        color:
                                            "#789398",

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            800,
                                    }}
                                >
                                    Item Code
                                </label>


                                <input
                                    type="text"

                                    placeholder=
                                        "Example: INV-007"

                                    value={
                                        newItem.itemCode
                                    }

                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            itemCode:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width:
                                            "100%",

                                        height:
                                            "43px",

                                        padding:
                                            "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius:
                                            "8px",

                                        outline:
                                            "none",

                                        background:
                                            "#031a1d",

                                        color:
                                            "#eafcff",

                                        fontSize:
                                            "12px",
                                    }}
                                />

                            </div>


                            {/* ITEM NAME */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "7px",

                                        color:
                                            "#789398",

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            800,
                                    }}
                                >
                                    Item Name
                                </label>


                                <input
                                    type="text"

                                    placeholder=
                                        "Example: Cooling Fan"

                                    value={
                                        newItem.itemName
                                    }

                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            itemName:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width:
                                            "100%",

                                        height:
                                            "43px",

                                        padding:
                                            "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius:
                                            "8px",

                                        outline:
                                            "none",

                                        background:
                                            "#031a1d",

                                        color:
                                            "#eafcff",

                                        fontSize:
                                            "12px",
                                    }}
                                />

                            </div>


                            {/* CATEGORY */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "7px",

                                        color:
                                            "#789398",

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            800,
                                    }}
                                >
                                    Category
                                </label>


                                <select
                                    value={
                                        newItem.category
                                    }

                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            category:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width:
                                            "100%",

                                        height:
                                            "43px",

                                        padding:
                                            "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius:
                                            "8px",

                                        outline:
                                            "none",

                                        background:
                                            "#031a1d",

                                        color:
                                            "#eafcff",

                                        fontSize:
                                            "12px",

                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    <option>
                                        Machine Parts
                                    </option>

                                    <option>
                                        Raw Material
                                    </option>

                                    <option>
                                        Consumables
                                    </option>

                                    <option>
                                        Tools
                                    </option>

                                </select>

                            </div>


                            {/* QUANTITY + MINIMUM */}

                            <div
                                style={{
                                    display:
                                        "grid",

                                    gridTemplateColumns:
                                        "1fr 1fr",

                                    gap:
                                        "14px",
                                }}
                            >

                                {/* QUANTITY */}

                                <div
                                    style={{
                                        marginBottom:
                                            "15px",
                                    }}
                                >

                                    <label
                                        style={{
                                            display:
                                                "block",

                                            marginBottom:
                                                "7px",

                                            color:
                                                "#789398",

                                            fontSize:
                                                "10px",

                                            fontWeight:
                                                800,
                                        }}
                                    >
                                        Quantity
                                    </label>


                                    <input
                                        type="number"

                                        min="0"

                                        placeholder="Example: 50"

                                        value={
                                            newItem.quantity
                                        }

                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                quantity:
                                                e.target.value,
                                            })
                                        }

                                        style={{
                                            width:
                                                "100%",

                                            height:
                                                "43px",

                                            padding:
                                                "0 12px",

                                            boxSizing:
                                                "border-box",

                                            border:
                                                "1px solid rgba(91,136,142,.16)",

                                            borderRadius:
                                                "8px",

                                            outline:
                                                "none",

                                            background:
                                                "#031a1d",

                                            color:
                                                "#eafcff",

                                            fontSize:
                                                "12px",
                                        }}
                                    />

                                </div>


                                {/* MINIMUM STOCK */}

                                <div
                                    style={{
                                        marginBottom:
                                            "15px",
                                    }}
                                >

                                    <label
                                        style={{
                                            display:
                                                "block",

                                            marginBottom:
                                                "7px",

                                            color:
                                                "#789398",

                                            fontSize:
                                                "10px",

                                            fontWeight:
                                                800,
                                        }}
                                    >
                                        Minimum Stock
                                    </label>


                                    <input
                                        type="number"

                                        min="0"

                                        placeholder="Example: 20"

                                        value={
                                            newItem.minimumStock
                                        }

                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                minimumStock:
                                                e.target.value,
                                            })
                                        }

                                        style={{
                                            width:
                                                "100%",

                                            height:
                                                "43px",

                                            padding:
                                                "0 12px",

                                            boxSizing:
                                                "border-box",

                                            border:
                                                "1px solid rgba(91,136,142,.16)",

                                            borderRadius:
                                                "8px",

                                            outline:
                                                "none",

                                            background:
                                                "#031a1d",

                                            color:
                                                "#eafcff",

                                            fontSize:
                                                "12px",
                                        }}
                                    />

                                </div>

                            </div>


                            {/* UNIT */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "7px",

                                        color:
                                            "#789398",

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            800,
                                    }}
                                >
                                    Unit
                                </label>


                                <select
                                    value={
                                        newItem.unit
                                    }

                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            unit:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width:
                                            "100%",

                                        height:
                                            "43px",

                                        padding:
                                            "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius:
                                            "8px",

                                        outline:
                                            "none",

                                        background:
                                            "#031a1d",

                                        color:
                                            "#eafcff",

                                        fontSize:
                                            "12px",

                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    <option>
                                        Units
                                    </option>

                                    <option>
                                        Kg
                                    </option>

                                    <option>
                                        Litres
                                    </option>

                                    <option>
                                        Metres
                                    </option>

                                </select>

                            </div>


                            {/* LOCATION */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "7px",

                                        color:
                                            "#789398",

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            800,
                                    }}
                                >
                                    Location
                                </label>


                                <input
                                    type="text"

                                    placeholder=
                                        "Example: Warehouse A"

                                    value={
                                        newItem.location
                                    }

                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            location:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width:
                                            "100%",

                                        height:
                                            "43px",

                                        padding:
                                            "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius:
                                            "8px",

                                        outline:
                                            "none",

                                        background:
                                            "#031a1d",

                                        color:
                                            "#eafcff",

                                        fontSize:
                                            "12px",
                                    }}
                                />

                            </div>


                            {/* SUPPLIER */}

                            <div
                                style={{
                                    marginBottom:
                                        "15px",
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "7px",

                                        color:
                                            "#789398",

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            800,
                                    }}
                                >
                                    Supplier
                                </label>


                                <input
                                    type="text"

                                    placeholder=
                                        "Example: ABC Suppliers"

                                    value={
                                        newItem.supplier
                                    }

                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            supplier:
                                            e.target.value,
                                        })
                                    }

                                    style={{
                                        width:
                                            "100%",

                                        height:
                                            "43px",

                                        padding:
                                            "0 12px",

                                        boxSizing:
                                            "border-box",

                                        border:
                                            "1px solid rgba(91,136,142,.16)",

                                        borderRadius:
                                            "8px",

                                        outline:
                                            "none",

                                        background:
                                            "#031a1d",

                                        color:
                                            "#eafcff",

                                        fontSize:
                                            "12px",
                                    }}
                                />

                            </div>


                            {/* BUTTONS */}

                            <div
                                style={{
                                    marginTop:
                                        "20px",

                                    paddingTop:
                                        "17px",

                                    display:
                                        "flex",

                                    justifyContent:
                                        "flex-end",

                                    gap:
                                        "10px",

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
                                        minHeight:
                                            "41px",

                                        padding:
                                            "0 16px",

                                        border:
                                            "1px solid rgba(91,136,142,.18)",

                                        borderRadius:
                                            "8px",

                                        background:
                                            "rgba(255,255,255,.035)",

                                        color:
                                            "#789398",

                                        fontSize:
                                            "11px",

                                        fontWeight:
                                            800,

                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"

                                    style={{
                                        minHeight:
                                            "41px",

                                        padding:
                                            "0 16px",

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        gap:
                                            "7px",

                                        border:
                                            "none",

                                        borderRadius:
                                            "8px",

                                        background:
                                            "#ffd54f",

                                        color:
                                            "#071719",

                                        fontSize:
                                            "11px",

                                        fontWeight:
                                            800,

                                        cursor:
                                            "pointer",

                                        boxShadow:
                                            "0 7px 20px rgba(255,213,79,.12)",
                                    }}
                                >

                                    <CheckCircle2
                                        size={18}
                                    />

                                    Add Inventory

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Inventory;