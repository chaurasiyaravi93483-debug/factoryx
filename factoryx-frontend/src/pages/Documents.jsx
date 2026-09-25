import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { Link } from "react-router-dom";

import "../documents.css";

import {
    Factory,
    Wrench,
    Package,
    CheckCircle2,
    AlertTriangle,
    BrainCircuit,
    FileText,
    BarChart3,
    Search,
    Bell,
    Upload,
    File,
    FileCheck2,
    Database,
    Trash2,
    Eye,
    X,
    ShieldCheck,
    BookOpen,
    Download,
} from "lucide-react";


function Documents() {

    /* =====================================================
       API
    ===================================================== */

    const API_URL =
        "http://localhost:8081/api/documents";


    /* =====================================================
       STATE
    ===================================================== */

    const [documents, setDocuments] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("All Categories");

    const [showUpload, setShowUpload] =
        useState(false);

    const [selectedDocument, setSelectedDocument] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);

    const [downloading, setDownloading] =
        useState(false);


    /* =====================================================
       FILE INPUT
    ===================================================== */

    const fileInputRef =
        useRef(null);


    /* =====================================================
       TOKEN
    ===================================================== */

    const getToken = () => {

        return localStorage.getItem("token");

    };


    /* =====================================================
       HANDLE AUTH ERROR
    ===================================================== */

    const handleUnauthorized = () => {

        localStorage.removeItem("token");

        window.location.href = "/login";

    };


    /* =====================================================
       LOAD DOCUMENTS
    ===================================================== */

    const fetchDocuments = async () => {

        try {

            setLoading(true);

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


            /* JWT EXPIRED */

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                handleUnauthorized();

                return;

            }


            if (!response.ok) {

                throw new Error(
                    "Failed to load documents"
                );

            }


            const data =
                await response.json();


            /* =================================================
               FORMAT BACKEND DATA FOR UI
            ================================================= */

            const formattedDocuments =
                data.map((doc) => {

                    const sizeInMB =
                        doc.fileSize
                            ? (
                                doc.fileSize /
                                (1024 * 1024)
                            ).toFixed(1)
                            : "0.0";


                    const uploadedDate =
                        doc.uploadedAt
                            ? new Date(
                                doc.uploadedAt
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            )
                            : "-";


                    return {

                        id: doc.id,

                        name:
                        doc.documentName,

                        category:
                            "Other",

                        size:
                            `${sizeInMB} MB`,

                        updated:
                        uploadedDate,

                        status:
                            doc.status || "Ready",

                        pages:
                            "--",

                        documentType:
                        doc.documentType,

                        fileName:
                        doc.fileName,

                        fileSize:
                        doc.fileSize,

                        uploadedBy:
                        doc.uploadedBy,

                        uploadedAt:
                        doc.uploadedAt,

                    };

                });


            setDocuments(
                formattedDocuments
            );


        } catch (error) {

            console.error(
                "Documents API Error:",
                error
            );


            alert(
                "Documents load nahi ho paaye."
            );


        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD DOCUMENTS WHEN PAGE OPENS
    ===================================================== */

    useEffect(() => {

        fetchDocuments();

    }, []);


    /* =====================================================
       FILTER DOCUMENTS
    ===================================================== */

    const filteredDocuments =
        useMemo(() => {

            return documents.filter(
                (doc) => {

                    const matchesSearch =
                        doc.name
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );


                    const matchesCategory =
                        category ===
                        "All Categories" ||
                        doc.category ===
                        category;


                    return (
                        matchesSearch &&
                        matchesCategory
                    );

                }
            );

        }, [
            documents,
            search,
            category,
        ]);


    /* =====================================================
       DOCUMENT COUNTS
    ===================================================== */

    const readyCount =
        documents.filter(
            (doc) =>
                doc.status === "Ready"
        ).length;


    const indexedCount =
        documents.filter(
            (doc) =>
                doc.status === "Indexed"
        ).length;


    const processingCount =
        documents.filter(
            (doc) =>
                doc.status === "Processing"
        ).length;


    /* =====================================================
       TOTAL STORAGE
    ===================================================== */

    const totalSize =
        documents.reduce(
            (total, doc) => {

                const size =
                    doc.fileSize
                        ? doc.fileSize /
                        (1024 * 1024)
                        : 0;

                return total + size;

            },
            0
        );


    /* =====================================================
       UPLOAD DOCUMENT
    ===================================================== */

    const handleFileUpload =
        async (event) => {

            const file =
                event.target.files[0];


            if (!file) {

                return;

            }


            /* =================================================
               FILE EXTENSION
            ================================================= */

            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            /* =================================================
               VALIDATE FILE
            ================================================= */

            if (
                ![
                    "pdf",
                    "docx",
                    "txt",
                ].includes(extension)
            ) {

                alert(
                    "Please upload PDF, DOCX or TXT files."
                );


                event.target.value =
                    "";

                return;

            }


            /* =================================================
               FILE SIZE
            ================================================= */

            const maxSize =
                20 *
                1024 *
                1024;


            if (file.size > maxSize) {

                alert(
                    "File size must be less than 20 MB."
                );


                event.target.value =
                    "";

                return;

            }


            try {

                setUploading(true);


                /* =================================================
                   FORM DATA
                ================================================= */

                const formData =
                    new FormData();


                formData.append(
                    "file",
                    file
                );


                /* =================================================
                   TOKEN
                ================================================= */

                const token =
                    getToken();


                /* =================================================
                   API REQUEST
                ================================================= */

                const response =
                    await fetch(
                        `${API_URL}/upload`,
                        {
                            method: "POST",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body:
                            formData,
                        }
                    );


                /* =================================================
                   AUTH ERROR
                ================================================= */

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleUnauthorized();

                    return;

                }


                /* =================================================
                   OTHER ERROR
                ================================================= */

                if (!response.ok) {

                    const errorText =
                        await response.text();


                    throw new Error(
                        errorText ||
                        "Document upload failed."
                    );

                }


                /* =================================================
                   RESPONSE
                ================================================= */

                const uploadedDocument =
                    await response.json();


                console.log(
                    "Document uploaded:",
                    uploadedDocument
                );


                /* =================================================
                   AUTOMATIC RAG INDEXING
                   PDF -> TEXT -> CHUNKS -> OLLAMA EMBEDDINGS
                ================================================= */

                if (
                    uploadedDocument.documentType &&
                    uploadedDocument.documentType.toLowerCase() === "pdf"
                ) {

                    try {

                        const chunkResponse =
                            await fetch(
                                `${API_URL}/${uploadedDocument.id}/chunks`,
                                {
                                    method: "GET",

                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,
                                    },
                                }
                            );


                        if (
                            chunkResponse.status === 401 ||
                            chunkResponse.status === 403
                        ) {

                            handleUnauthorized();

                            return;
                        }


                        if (!chunkResponse.ok) {

                            const chunkError =
                                await chunkResponse.text();

                            console.error(
                                "RAG indexing failed:",
                                chunkError
                            );

                            alert(
                                "Document uploaded, but RAG indexing failed."
                            );

                        } else {

                            const chunks =
                                await chunkResponse.json();

                            console.log(
                                "RAG chunks created:",
                                chunks
                            );
                        }

                    } catch (ragError) {

                        console.error(
                            "RAG indexing error:",
                            ragError
                        );

                        alert(
                            "Document uploaded, but RAG indexing failed."
                        );
                    }
                }


                /* =================================================
                   CLOSE MODAL
                ================================================= */

                setShowUpload(false);


                /* =================================================
                   REFRESH DOCUMENT LIST
                ================================================= */

                await fetchDocuments();


                /* =================================================
                   SUCCESS
                ================================================= */

                alert(
                    "Document uploaded and RAG processing completed!"
                );


            } catch (error) {

                console.error(
                    "Upload Error:",
                    error
                );


                alert(
                    error.message ||
                    "Document upload failed."
                );


            } finally {

                setUploading(false);


                event.target.value =
                    "";

            }

        };


    /* =====================================================
       DELETE DOCUMENT
    ===================================================== */

    const handleDelete =
        async (id) => {

            const confirmDelete =
                window.confirm(
                    "Are you sure you want to delete this document?"
                );


            if (!confirmDelete) {

                return;

            }


            try {

                const token =
                    getToken();


                const response =
                    await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );


                /* =================================================
                   AUTH ERROR
                ================================================= */

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleUnauthorized();

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        "Document deletion failed."
                    );

                }


                /* =================================================
                   REMOVE FROM UI
                ================================================= */

                setDocuments(
                    (prev) =>
                        prev.filter(
                            (doc) =>
                                doc.id !== id
                        )
                );


                /* =================================================
                   CLOSE VIEW MODAL
                ================================================= */

                if (
                    selectedDocument?.id === id
                ) {

                    setSelectedDocument(
                        null
                    );

                }


                alert(
                    "Document deleted successfully."
                );


            } catch (error) {

                console.error(
                    "Delete Error:",
                    error
                );


                alert(
                    "Document delete nahi ho paaya."
                );

            }

        };


    /* =====================================================
       DOWNLOAD DOCUMENT
    ===================================================== */

    const handleDownload =
        async (document) => {

            try {

                setDownloading(true);


                const token =
                    getToken();


                const response =
                    await fetch(
                        `${API_URL}/${document.id}/download`,
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );


                /* =================================================
                   AUTH ERROR
                ================================================= */

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    handleUnauthorized();

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        "Download failed."
                    );

                }


                /* =================================================
                   GET FILE BLOB
                ================================================= */

                const blob =
                    await response.blob();


                /* =================================================
                   CREATE DOWNLOAD URL
                ================================================= */

                const url =
                    window.URL.createObjectURL(
                        blob
                    );


                const anchor =
                    window.document.createElement(
                        "a"
                    );


                anchor.href = url;


                anchor.download =
                    document.name ||
                    "document";


                window.document.body.appendChild(
                    anchor
                );


                anchor.click();


                anchor.remove();


                window.URL.revokeObjectURL(
                    url
                );


            } catch (error) {

                console.error(
                    "Download Error:",
                    error
                );


                alert(
                    "Document download nahi ho paaya."
                );


            } finally {

                setDownloading(false);

            }

        };


    // =====================================================
    // ASK AI ABOUT DOCUMENT
    // =====================================================

    const handleAskAI = (document) => {

        if (!document?.id) {
            return;
        }

        window.location.href =
            `/ai-assistant?documentId=${document.id}`;
    };


    /* =====================================================
       RETURN
    ===================================================== */

    return (

        <div className="documents-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="documents-sidebar">


                {/* LOGO */}

                <div className="documents-logo">

                    <div className="documents-logo-icon">

                        <Factory
                            size={25}
                        />

                    </div>


                    <div className="documents-logo-text">

                        <strong>
                            FACTORYX
                        </strong>

                        <span>
                            SMART FACTORY
                        </span>

                    </div>

                </div>


                {/* MENU */}

                <div className="documents-menu">


                    {/* OPERATIONS */}

                    <div className="documents-menu-title">
                        OPERATIONS
                    </div>


                    <Link
                        to="/maintenance"
                        className="documents-menu-item"
                    >

                        <Wrench
                            size={18}
                        />

                        <span>
                            Maintenance
                        </span>

                    </Link>


                    <Link
                        to="/inventory"
                        className="documents-menu-item"
                    >

                        <Package
                            size={18}
                        />

                        <span>
                            Inventory
                        </span>

                    </Link>


                    <Link
                        to="/quality"
                        className="documents-menu-item"
                    >

                        <CheckCircle2
                            size={18}
                        />

                        <span>
                            Quality
                        </span>

                    </Link>


                    <Link
                        to="/incidents"
                        className="documents-menu-item"
                    >

                        <AlertTriangle
                            size={18}
                        />

                        <span>
                            Incidents
                        </span>

                    </Link>


                    {/* INTELLIGENCE */}

                    <div className="documents-menu-title intelligence-title">
                        INTELLIGENCE
                    </div>


                    <Link
                        to="/ai-assistant"
                        className="documents-menu-item"
                    >

                        <BrainCircuit
                            size={18}
                        />

                        <span>
                            AI Assistant
                        </span>

                    </Link>


                    <Link
                        to="/documents"
                        className="documents-menu-item active"
                    >

                        <FileText
                            size={18}
                        />

                        <span>
                            Documents
                        </span>

                    </Link>


                    <Link
                        to="/reports"
                        className="documents-menu-item"
                    >

                        <BarChart3
                            size={18}
                        />

                        <span>
                            Reports
                        </span>

                    </Link>

                </div>


                {/* USER */}

                <div className="documents-sidebar-user">

                    <div className="documents-avatar">
                        RK
                    </div>


                    <div className="documents-user-info">

                        <strong>
                            Ravi Kumar
                        </strong>

                        <span>
                            Manager
                        </span>

                    </div>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="documents-main">


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="documents-topbar">


                    <div className="documents-breadcrumb">

                        <span>
                            FactoryX
                        </span>

                        <b>
                            /
                        </b>

                        <strong>
                            Documents
                        </strong>

                    </div>


                    <div className="documents-top-right">


                        {/* ONLINE */}

                        <div className="documents-online">

                            <span></span>

                            AI Online

                        </div>


                        {/* NOTIFICATION */}

                        <div className="documents-notification">

                            <Bell
                                size={19}
                            />

                            <i>
                                7
                            </i>

                        </div>


                        {/* USER */}

                        <div className="documents-top-user">

                            <div>
                                RK
                            </div>

                            <span>
                                Ravi Kumar
                            </span>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="documents-content">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="documents-page-header">

                        <div>

                            <span className="documents-eyebrow">
                                KNOWLEDGE MANAGEMENT
                            </span>


                            <h1>
                                Documents
                            </h1>


                            <p>
                                Manage factory documents and build your AI knowledge base.
                            </p>

                        </div>


                        <button
                            className="documents-upload-button"
                            onClick={() =>
                                setShowUpload(true)
                            }
                            disabled={uploading}
                        >

                            <Upload
                                size={18}
                            />

                            Upload Document

                        </button>

                    </div>


                    {/* =================================================
                        STATS
                    ================================================= */}

                    <div className="documents-stats">


                        {/* TOTAL */}

                        <div className="documents-stat-card">

                            <div className="documents-stat-icon cyan">

                                <FileText
                                    size={21}
                                />

                            </div>


                            <div>

                                <span>
                                    Total Documents
                                </span>

                                <strong>
                                    {documents.length}
                                </strong>

                            </div>

                        </div>


                        {/* READY */}

                        <div className="documents-stat-card">

                            <div className="documents-stat-icon green">

                                <FileCheck2
                                    size={21}
                                />

                            </div>


                            <div>

                                <span>
                                    Ready
                                </span>

                                <strong>
                                    {readyCount}
                                </strong>

                            </div>

                        </div>


                        {/* RAG */}

                        <div className="documents-stat-card">

                            <div className="documents-stat-icon yellow">

                                <Database
                                    size={21}
                                />

                            </div>


                            <div>

                                <span>
                                    RAG Documents
                                </span>

                                <strong>
                                    {indexedCount}
                                </strong>

                            </div>

                        </div>


                        {/* STORAGE */}

                        <div className="documents-stat-card">

                            <div className="documents-stat-icon purple">

                                <BookOpen
                                    size={21}
                                />

                            </div>


                            <div>

                                <span>
                                    Storage Used
                                </span>

                                <strong>
                                    {totalSize.toFixed(1)} MB
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FILTER
                    ================================================= */}

                    <div className="documents-filter">


                        {/* SEARCH */}

                        <div className="documents-search">

                            <Search
                                size={18}
                            />


                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CATEGORY */}

                        <select
                            className="documents-select"
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

                            <option>
                                Safety
                            </option>

                            <option>
                                Machine Manual
                            </option>

                            <option>
                                Maintenance
                            </option>

                            <option>
                                Quality
                            </option>

                            <option>
                                Production
                            </option>

                            <option>
                                Other
                            </option>

                        </select>

                    </div>


                    {/* =================================================
                        DOCUMENT PANEL
                    ================================================= */}

                    <div className="documents-panel">


                        {/* PANEL HEADER */}

                        <div className="documents-panel-header">

                            <div>

                                <h2>
                                    Factory Knowledge Base
                                </h2>

                                <span>
                                    {filteredDocuments.length} documents available
                                </span>

                            </div>


                            <div className="rag-status">

                                <span></span>

                                RAG System Ready

                            </div>

                        </div>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="documents-table-wrapper">


                            {loading ? (

                                <div className="documents-empty">

                                    <FileText
                                        size={40}
                                    />

                                    <h3>
                                        Loading documents...
                                    </h3>

                                    <p>
                                        Fetching documents from FactoryX backend.
                                    </p>

                                </div>

                            ) : (

                                <table className="documents-table">


                                    <thead>

                                    <tr>

                                        <th>
                                            DOCUMENT
                                        </th>

                                        <th>
                                            CATEGORY
                                        </th>

                                        <th>
                                            SIZE
                                        </th>

                                        <th>
                                            UPDATED
                                        </th>

                                        <th>
                                            RAG STATUS
                                        </th>

                                        <th>
                                            ACTIONS
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {filteredDocuments.map(
                                        (doc) => (

                                            <tr
                                                key={
                                                    doc.id
                                                }
                                            >


                                                {/* DOCUMENT */}

                                                <td>

                                                    <div className="document-name">


                                                        <div className="document-file-icon">

                                                            <FileText
                                                                size={19}
                                                            />

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {
                                                                    doc.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                    {
                                                                        doc.pages
                                                                    }{" "}
                                                                pages
                                                                </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* CATEGORY */}

                                                <td>

                                                        <span className="document-category">

                                                            {
                                                                doc.category
                                                            }

                                                        </span>

                                                </td>


                                                {/* SIZE */}

                                                <td>

                                                    {
                                                        doc.size
                                                    }

                                                </td>


                                                {/* UPDATED */}

                                                <td>

                                                    {
                                                        doc.updated
                                                    }

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                        <span
                                                            className={`document-status ${
                                                                doc.status ===
                                                                "Processing"
                                                                    ? "processing"
                                                                    : "indexed"
                                                            }`}
                                                        >

                                                            <span></span>

                                                            {
                                                                doc.status
                                                            }

                                                        </span>

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="document-actions">


                                                        {/* VIEW */}

                                                        <button
                                                            title="View"
                                                            onClick={() =>
                                                                setSelectedDocument(
                                                                    doc
                                                                )
                                                            }
                                                        >

                                                            <Eye
                                                                size={17}
                                                            />

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            title="Delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    doc.id
                                                                )
                                                            }
                                                        >

                                                            <Trash2
                                                                size={17}
                                                            />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            )}


                            {/* =================================================
                                EMPTY
                            ================================================= */}

                            {!loading &&
                                filteredDocuments.length ===
                                0 && (

                                    <div className="documents-empty">

                                        <FileText
                                            size={40}
                                        />

                                        <h3>
                                            No documents found
                                        </h3>

                                        <p>
                                            Try another search or upload a new document.
                                        </p>

                                    </div>

                                )}

                        </div>

                    </div>


                    {/* =================================================
                        RAG INFO
                    ================================================= */}

                    <div className="documents-rag-card">


                        <div className="documents-rag-icon">

                            <BrainCircuit
                                size={25}
                            />

                        </div>


                        <div className="documents-rag-content">

                            <span>
                                AI KNOWLEDGE BASE
                            </span>


                            <h3>
                                RAG Knowledge Base
                            </h3>


                            <p>
                                Indexed factory documents can be used by FactoryX AI
                                to answer operational questions using your internal
                                factory knowledge.
                            </p>


                            <div className="rag-points">


                                <div>

                                    <ShieldCheck
                                        size={16}
                                    />

                                    Secure document processing

                                </div>


                                <div>

                                    <Database
                                        size={16}
                                    />

                                    Vector knowledge storage

                                </div>


                                <div>

                                    <BrainCircuit
                                        size={16}
                                    />

                                    AI-powered retrieval

                                </div>

                            </div>

                        </div>


                        <div className="rag-count">

                            <strong>
                                {indexedCount}
                            </strong>

                            <span>
                                Indexed
                            </span>

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================================
                UPLOAD MODAL
            ===================================================== */}

            {showUpload && (

                <div
                    className="documents-modal-overlay"
                    onClick={() =>
                        !uploading &&
                        setShowUpload(false)
                    }
                >


                    <div
                        className="documents-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* CLOSE */}

                        <button
                            className="documents-modal-close"
                            onClick={() =>
                                !uploading &&
                                setShowUpload(false)
                            }
                            disabled={uploading}
                        >

                            <X
                                size={20}
                            />

                        </button>


                        {/* ICON */}

                        <div className="documents-modal-icon">

                            <Upload
                                size={25}
                            />

                        </div>


                        <h2>
                            Upload Document
                        </h2>


                        <p>
                            Add a factory document to the FactoryX knowledge base.
                        </p>


                        {/* DROPZONE */}

                        <div
                            className="upload-dropzone"
                            onClick={() => {

                                if (!uploading) {

                                    fileInputRef.current.click();

                                }

                            }}
                        >

                            {uploading ? (

                                <>

                                    <Upload
                                        size={34}
                                    />

                                    <strong>
                                        Uploading document...
                                    </strong>

                                    <span>
                                        Please wait
                                    </span>

                                </>

                            ) : (

                                <>

                                    <File
                                        size={34}
                                    />

                                    <strong>
                                        Click to select a document
                                    </strong>

                                    <span>
                                        PDF, DOCX or TXT
                                    </span>

                                </>

                            )}

                        </div>


                        {/* FILE INPUT */}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.txt"
                            hidden
                            onChange={
                                handleFileUpload
                            }
                            disabled={
                                uploading
                            }
                        />

                    </div>

                </div>

            )}


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            {selectedDocument && (

                <div
                    className="documents-modal-overlay"
                    onClick={() =>
                        setSelectedDocument(
                            null
                        )
                    }
                >


                    <div
                        className="documents-modal document-view-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* CLOSE */}

                        <button
                            className="documents-modal-close"
                            onClick={() =>
                                setSelectedDocument(
                                    null
                                )
                            }
                        >

                            <X
                                size={20}
                            />

                        </button>


                        {/* ICON */}

                        <div className="documents-modal-icon">

                            <FileText
                                size={25}
                            />

                        </div>


                        {/* NAME */}

                        <h2>
                            {
                                selectedDocument.name
                            }
                        </h2>


                        {/* DETAILS */}

                        <div className="document-details">


                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {
                                        selectedDocument.category
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    File Size
                                </span>

                                <strong>
                                    {
                                        selectedDocument.size
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Pages
                                </span>

                                <strong>
                                    {
                                        selectedDocument.pages
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {
                                        selectedDocument.status
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* AI STATUS */}

                        <div className="document-ai-ready">

                            <BrainCircuit
                                size={18}
                            />

                            This document is available for future AI retrieval.

                        </div>


                        {/* ASK AI */}

                        <button
                            className="documents-upload-button"
                            onClick={() =>
                                handleAskAI(
                                    selectedDocument
                                )
                            }
                            style={{
                                marginBottom: "10px"
                            }}
                        >

                            <BrainCircuit
                                size={18}
                            />

                            Ask FactoryX AI

                        </button>


                        {/* DOWNLOAD */}

                        <button
                            className="documents-upload-button"
                            onClick={() =>
                                handleDownload(
                                    selectedDocument
                                )
                            }
                            disabled={
                                downloading
                            }
                        >

                            <Download
                                size={18}
                            />

                            {downloading
                                ? "Downloading..."
                                : "Download Document"}

                        </button>

                    </div>

                </div>

            )}

        </div>

    );
}


export default Documents;
