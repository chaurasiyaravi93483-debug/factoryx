import React, { useEffect, useState } from "react";
import {
    Link,
    useSearchParams,
} from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import "../ai-assistant.css";

import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    Factory,
    Gauge,
    LayoutDashboard,
    MessageSquare,
    Package,
    Send,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Wrench,
    FileText,
    X,
} from "lucide-react";


function AIAssistant() {

    /* =====================================================
       URL PARAMS
    ===================================================== */

    const [searchParams] =
        useSearchParams();

    const documentId =
        searchParams.get("documentId");


    /* =====================================================
       STATE
    ===================================================== */

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [documentName, setDocumentName] =
        useState("");

    const [messages, setMessages] =
        useState([
            {
                type: "ai",

                text: documentId
                    ? "Hello Ravi! I'm FactoryX AI. I can answer questions using the selected factory document and its knowledge base."
                    : "Hello Ravi! I'm FactoryX AI. I can analyze your factory operations, machines, production, quality and maintenance data. How can I help you today?",

                time: "Just now",
            },
        ]);


    /* =====================================================
       QUICK PROMPTS
    ===================================================== */

    const quickPrompts = documentId
        ? [
            "Summarize this document",
            "What are the key points?",
            "What maintenance information is mentioned?",
            "What safety instructions are given?",
        ]
        : [
            "Why is OEE dropping?",
            "Which machine needs maintenance?",
            "Analyze today's production",
            "Show quality issues",
        ];


    /* =====================================================
       LOAD DOCUMENT NAME
    ===================================================== */

    useEffect(() => {

        if (!documentId) {
            return;
        }

        const loadDocument =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const response =
                        await fetch(
                            `http://localhost:8081/api/documents/${documentId}`,
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

                        localStorage.removeItem(
                            "token"
                        );

                        window.location.href =
                            "/login";

                        return;
                    }


                    if (!response.ok) {
                        return;
                    }


                    const data =
                        await response.json();


                    setDocumentName(
                        data.documentName ||
                        data.fileName ||
                        "Selected Document"
                    );

                } catch (error) {

                    console.error(
                        "Document loading error:",
                        error
                    );

                }

            };


        loadDocument();

    }, [documentId]);


    /* =====================================================
       SEND MESSAGE TO SPRING AI + RAG
    ===================================================== */

    const sendMessage =
        async (text = message) => {

            const trimmedMessage =
                text.trim();


            if (
                !trimmedMessage ||
                loading
            ) {
                return;
            }


            /* =================================================
               USER MESSAGE
            ================================================= */

            const userMessage = {

                type: "user",

                text: trimmedMessage,

                time: "Just now",

            };


            setMessages(
                (current) => [
                    ...current,
                    userMessage,
                ]
            );


            setMessage("");

            setLoading(true);


            try {

                /* =================================================
                   JWT TOKEN
                ================================================= */

                const token =
                    localStorage.getItem(
                        "token"
                    );


                /* =================================================
                   REQUEST BODY
                ================================================= */

                const requestBody = {

                    message:
                    trimmedMessage,

                    ...(documentId
                        ? {
                            documentId:
                                Number(
                                    documentId
                                ),
                        }
                        : {}),

                };


                console.log(
                    "FactoryX AI Request:",
                    requestBody
                );


                /* =================================================
                   API REQUEST
                ================================================= */

                const response =
                    await fetch(
                        "http://localhost:8081/api/ai/chat",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body:
                                JSON.stringify(
                                    requestBody
                                ),
                        }
                    );


                /* =================================================
                   JWT EXPIRED
                ================================================= */

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    window.location.href =
                        "/login";

                    return;
                }


                /* =================================================
                   API ERROR
                ================================================= */

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "AI API Error:",
                        errorText
                    );

                    throw new Error(
                        `AI request failed: ${response.status}`
                    );

                }


                /* =================================================
                   READ RESPONSE
                ================================================= */

                const data =
                    await response.json();


                /* =================================================
                   AI RESPONSE
                ================================================= */

                const aiResponse =
                    data.response ||
                    "FactoryX AI could not generate a response.";


                /* =================================================
                   ADD AI MESSAGE
                ================================================= */

                setMessages(
                    (current) => [
                        ...current,
                        {
                            type: "ai",

                            text:
                            aiResponse,

                            time:
                                "Just now",
                        },
                    ]
                );


            } catch (error) {

                console.error(
                    "FactoryX AI Error:",
                    error
                );


                setMessages(
                    (current) => [
                        ...current,
                        {
                            type: "ai",

                            text:
                                "FactoryX AI is temporarily unavailable. Please check that the backend and AI service are running.",

                            time:
                                "Just now",
                        },
                    ]
                );


            } finally {

                setLoading(false);

            }

        };


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    const handleSubmit =
        (e) => {

            e.preventDefault();

            sendMessage();

        };


    /* =====================================================
       CLEAR DOCUMENT CONTEXT
    ===================================================== */

    const clearDocumentContext =
        () => {

            window.location.href =
                "/ai-assistant";

        };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="ai-assistant-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="ai-sidebar">


                <div className="ai-logo">

                    <div className="ai-logo-icon">

                        <Factory size={22} />

                    </div>


                    <div className="ai-logo-text">

                        FACTORY<span>X</span>

                    </div>

                </div>


                <div className="ai-menu">


                    <p className="ai-menu-title">
                        MAIN
                    </p>


                    <Link
                        to="/dashboard"
                        className="ai-menu-item"
                    >

                        <LayoutDashboard
                            size={19}
                        />

                        <span>
                            Dashboard
                        </span>

                    </Link>


                    <Link
                        to="/dashboard"
                        className="ai-menu-item"
                    >

                        <Factory
                            size={19}
                        />

                        <span>
                            Factory
                        </span>

                        <ChevronDown
                            size={14}
                            className="ai-arrow"
                        />

                    </Link>


                    <Link
                        to="/machines"
                        className="ai-menu-item"
                    >

                        <Gauge
                            size={19}
                        />

                        <span>
                            Machines
                        </span>

                    </Link>


                    <Link
                        to="/production"
                        className="ai-menu-item"
                    >

                        <TrendingUp
                            size={19}
                        />

                        <span>
                            Production
                        </span>

                    </Link>


                    <p className="ai-menu-title ai-operation">
                        OPERATIONS
                    </p>


                    <Link
                        to="/maintenance"
                        className="ai-menu-item"
                    >

                        <Wrench
                            size={19}
                        />

                        <span>
                            Maintenance
                        </span>

                    </Link>


                    <Link
                        to="/inventory"
                        className="ai-menu-item"
                    >

                        <Package
                            size={19}
                        />

                        <span>
                            Inventory
                        </span>

                    </Link>


                    <Link
                        to="/quality"
                        className="ai-menu-item"
                    >

                        <CheckCircle2
                            size={19}
                        />

                        <span>
                            Quality
                        </span>

                    </Link>


                    <Link
                        to="/incidents"
                        className="ai-menu-item"
                    >

                        <AlertTriangle
                            size={19}
                        />

                        <span>
                            Incidents
                        </span>

                    </Link>


                    <p className="ai-menu-title ai-operation">
                        INTELLIGENCE
                    </p>


                    <Link
                        to="/ai-assistant"
                        className="ai-menu-item active"
                    >

                        <BrainCircuit
                            size={19}
                        />

                        <span>
                            AI Assistant
                        </span>

                    </Link>


                    <Link
                        to="/documents"
                        className="ai-menu-item"
                    >

                        <ShieldCheck
                            size={19}
                        />

                        <span>
                            Documents
                        </span>

                    </Link>


                    <Link
                        to="/reports"
                        className="ai-menu-item"
                    >

                        <Activity
                            size={19}
                        />

                        <span>
                            Reports
                        </span>

                    </Link>

                </div>


                <div className="ai-sidebar-user">

                    <div className="ai-avatar">
                        RK
                    </div>


                    <div className="ai-user-info">

                        <strong>
                            Ravi Kumar
                        </strong>

                        <span>
                            Manager
                        </span>

                    </div>


                    <ChevronDown
                        size={15}
                    />

                </div>

            </aside>


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="ai-main">


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="ai-topbar">

                    <div className="ai-breadcrumb">

                        <span>
                            Intelligence
                        </span>

                        <b>
                            /
                        </b>

                        <strong>
                            AI Assistant
                        </strong>

                    </div>


                    <div className="ai-top-right">

                        <div className="ai-system-status">

                            <span></span>

                            AI ONLINE

                        </div>


                        <div className="ai-top-user">

                            <div className="ai-top-avatar">
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


                            <ChevronDown
                                size={15}
                            />

                        </div>

                    </div>

                </header>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="ai-content">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="ai-page-header">

                        <div>

                            <p>
                                FACTORYX INTELLIGENCE
                            </p>

                            <h1>
                                AI Assistant
                            </h1>

                            <span>
                                Your intelligent factory operations copilot.
                            </span>

                        </div>


                        <div className="ai-model-badge">

                            <Sparkles
                                size={15}
                            />

                            FactoryX AI

                        </div>

                    </div>


                    {/* =================================================
                        DOCUMENT CONTEXT
                    ================================================= */}

                    {documentId && (

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "12px",
                                padding: "12px 16px",
                                marginBottom: "16px",
                                border: "1px solid rgba(66, 214, 211, 0.25)",
                                borderRadius: "10px",
                                background:
                                    "rgba(4, 45, 48, 0.75)",
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >

                                <FileText
                                    size={18}
                                />

                                <div>

                                    <div
                                        style={{
                                            fontSize: "11px",
                                            color: "#7edbd8",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        RAG DOCUMENT CONTEXT
                                    </div>

                                    <strong
                                        style={{
                                            color: "#d8eeee",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {documentName ||
                                            `Document #${documentId}`}
                                    </strong>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    clearDocumentContext
                                }
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    background: "transparent",
                                    color: "#9abbbb",
                                    borderRadius: "7px",
                                    padding: "7px 10px",
                                    cursor: "pointer",
                                }}
                            >

                                <X
                                    size={14}
                                />

                                Clear

                            </button>

                        </div>

                    )}


                    {/* =================================================
                        WORKSPACE
                    ================================================= */}

                    <div className="ai-workspace">


                        {/* =================================================
                            CHAT PANEL
                        ================================================= */}

                        <section className="ai-chat-panel">


                            <div className="ai-chat-header">

                                <div className="ai-chat-title">

                                    <div className="ai-chat-icon">

                                        <BrainCircuit
                                            size={20}
                                        />

                                    </div>


                                    <div>

                                        <h2>
                                            FactoryX Copilot
                                        </h2>

                                        <span>
                                            {documentId
                                                ? "Document-aware AI intelligence"
                                                : "AI operational intelligence"}
                                        </span>

                                    </div>

                                </div>


                                <div className="ai-online-badge">

                                    <span></span>

                                    Online

                                </div>

                            </div>


                            {/* =================================================
                                MESSAGES
                            ================================================= */}

                            <div className="ai-messages">

                                {messages.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                index
                                            }
                                            className={`ai-message-row ${
                                                item.type ===
                                                "user"
                                                    ? "user-message"
                                                    : "assistant-message"
                                            }`}
                                        >


                                            {item.type ===
                                                "ai" && (

                                                    <div className="ai-message-avatar">

                                                        <BrainCircuit
                                                            size={17}
                                                        />

                                                    </div>

                                                )}


                                            <div className="ai-message-content">

                                                <div className="ai-message-name">

                                                    {item.type ===
                                                    "ai"
                                                        ? "FactoryX AI"
                                                        : "You"}

                                                </div>


                                                <div className="ai-message-bubble">

                                                    {item.type ===
                                                    "ai" ? (

                                                        <ReactMarkdown
                                                            remarkPlugins={[
                                                                remarkGfm,
                                                            ]}
                                                            rehypePlugins={[
                                                                rehypeRaw,
                                                            ]}
                                                        >
                                                            {
                                                                item.text
                                                            }
                                                        </ReactMarkdown>

                                                    ) : (

                                                        item.text

                                                    )}

                                                </div>


                                                <div className="ai-message-time">

                                                    {
                                                        item.time
                                                    }

                                                </div>

                                            </div>


                                            {item.type ===
                                                "user" && (

                                                    <div className="ai-user-message-avatar">

                                                        RK

                                                    </div>

                                                )}

                                        </div>

                                    )
                                )}


                                {/* =================================================
                                    LOADING
                                ================================================= */}

                                {loading && (

                                    <div className="ai-message-row assistant-message">

                                        <div className="ai-message-avatar">

                                            <BrainCircuit
                                                size={17}
                                            />

                                        </div>


                                        <div className="ai-message-content">

                                            <div className="ai-message-name">

                                                FactoryX AI

                                            </div>


                                            <div className="ai-message-bubble ai-thinking">

                                                <span></span>
                                                <span></span>
                                                <span></span>

                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                QUICK PROMPTS
                            ================================================= */}

                            <div className="ai-quick-area">

                                <div className="ai-quick-title">

                                    <Sparkles
                                        size={13}
                                    />

                                    {documentId
                                        ? "Document questions"
                                        : "Suggested questions"}

                                </div>


                                <div className="ai-quick-prompts">

                                    {quickPrompts.map(
                                        (
                                            prompt
                                        ) => (

                                            <button
                                                key={
                                                    prompt
                                                }
                                                onClick={() =>
                                                    sendMessage(
                                                        prompt
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                            >

                                                {
                                                    prompt
                                                }

                                                <ArrowUpRight
                                                    size={
                                                        13
                                                    }
                                                />

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>


                            {/* =================================================
                                INPUT
                            ================================================= */}

                            <form
                                className="ai-input-area"
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="ai-input-wrapper">

                                    <MessageSquare
                                        size={17}
                                    />


                                    <input
                                        type="text"
                                        placeholder={
                                            documentId
                                                ? "Ask about this document..."
                                                : "Ask FactoryX AI about your factory..."
                                        }
                                        value={
                                            message
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setMessage(
                                                e.target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="ai-send-button"
                                    disabled={
                                        loading ||
                                        !message.trim()
                                    }
                                >

                                    {loading ? (

                                        <span className="ai-send-loading">
                                            ...
                                        </span>

                                    ) : (

                                        <Send
                                            size={
                                                17
                                            }
                                        />

                                    )}

                                </button>

                            </form>

                        </section>


                        {/* =================================================
                            RIGHT CONTEXT PANEL
                        ================================================= */}

                        <aside className="ai-context-panel">


                            {/* =================================================
                                FACTORY STATUS
                            ================================================= */}

                            <div className="ai-context-card">

                                <div className="ai-context-header">

                                    <div>

                                        <span>
                                            FACTORY STATUS
                                        </span>

                                        <h3>
                                            Operational Overview
                                        </h3>

                                    </div>


                                    <Activity
                                        size={18}
                                    />

                                </div>


                                <div className="ai-status-main">

                                    <div className="ai-status-circle">

                                        <span>
                                            86.4%
                                        </span>

                                        <small>
                                            OEE
                                        </small>

                                    </div>


                                    <div className="ai-status-info">

                                        <div>

                                            <span>
                                                Machines
                                            </span>

                                            <strong>
                                                42
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Production
                                            </span>

                                            <strong>
                                                8,420
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Alerts
                                            </span>

                                            <strong className="danger">
                                                07
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                AI INSIGHTS
                            ================================================= */}

                            <div className="ai-context-card">

                                <div className="ai-context-header">

                                    <div>

                                        <span>
                                            AI INSIGHTS
                                        </span>

                                        <h3>
                                            Current Analysis
                                        </h3>

                                    </div>


                                    <BrainCircuit
                                        size={18}
                                    />

                                </div>


                                <div className="ai-insight-list">

                                    <div className="ai-insight-item">

                                        <div className="insight-icon warning">

                                            <AlertTriangle
                                                size={15}
                                            />

                                        </div>


                                        <div>

                                            <strong>
                                                CNC-101
                                            </strong>

                                            <span>
                                                Overheating risk detected
                                            </span>

                                        </div>

                                    </div>


                                    <div className="ai-insight-item">

                                        <div className="insight-icon success">

                                            <CheckCircle2
                                                size={15}
                                            />

                                        </div>


                                        <div>

                                            <strong>
                                                Quality
                                            </strong>

                                            <span>
                                                96.8% quality rate
                                            </span>

                                        </div>

                                    </div>


                                    <div className="ai-insight-item">

                                        <div className="insight-icon cyan">

                                            <TrendingUp
                                                size={15}
                                            />

                                        </div>


                                        <div>

                                            <strong>
                                                Production
                                            </strong>

                                            <span>
                                                Efficiency remains stable
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                RAG STATUS
                            ================================================= */}

                            <div className="ai-rag-card">

                                <div className="ai-rag-icon">

                                    <Sparkles
                                        size={19}
                                    />

                                </div>


                                <div>

                                    <span>
                                        KNOWLEDGE BASE
                                    </span>

                                    <h3>
                                        {documentId
                                            ? "RAG Document Active"
                                            : "RAG Ready"}
                                    </h3>

                                    <p>
                                        {documentId
                                            ? "Questions are being answered using the selected factory document."
                                            : "Factory documents and operational knowledge can be connected here."}
                                    </p>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>

        </div>

    );
}


export default AIAssistant;