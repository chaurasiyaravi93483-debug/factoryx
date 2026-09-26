import { Link, useNavigate } from "react-router-dom";
import {
    Factory,
    Lock,
    Mail,
    ArrowLeft,
    Eye,
    EyeOff
} from "lucide-react";

import { useState } from "react";
import "../auth.css";

function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] =
        useState(false);

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================
    // BACKEND API URL
    // =========================================

    const API_BASE_URL =
        (
            import.meta.env.VITE_API_URL ||
            "https://factoryx-1.onrender.com"
        ).replace(/\/$/, "");


    // =========================================
    // LOGIN
    // =========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            let data = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Invalid email or password"
                );
            }

            if (!data.token) {

                throw new Error(
                    "Login successful, but token was not received."
                );
            }

            // =========================================
            // SAVE LOGIN DATA
            // =========================================

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "userEmail",
                email.trim()
            );

            // =========================================
            // GO TO DASHBOARD
            // =========================================

            navigate("/dashboard");

        } catch (err) {

            console.error(
                "Login error:",
                err
            );

            if (
                err instanceof TypeError &&
                err.message === "Failed to fetch"
            ) {

                setError(
                    "Unable to connect to the server. Please try again."
                );

            } else {

                setError(
                    err.message ||
                    "Login failed. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-background"></div>

            <div className="auth-container">

                <Link
                    to="/"
                    className="back-home"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>


                <div className="auth-card">


                    {/* LOGO */}

                    <div className="auth-logo">

                        <div className="auth-logo-icon">
                            <Factory size={25} />
                        </div>

                        <span>
                            FACTORY
                            <span>X</span>
                        </span>

                    </div>


                    {/* HEADING */}

                    <div className="auth-heading">

                        <h1>
                            Welcome back
                        </h1>

                        <p>
                            Sign in to access your factory intelligence dashboard.
                        </p>

                    </div>


                    {/* LOGIN FORM */}

                    <form onSubmit={handleLogin}>


                        {/* EMAIL */}

                        <div className="input-group">

                            <label>
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <Mail size={18} />

                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="input-group">

                            <label>
                                Password
                            </label>

                            <div className="input-wrapper">

                                <Lock size={18} />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >

                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    background:
                                        "rgba(255, 70, 70, 0.08)",
                                    border:
                                        "1px solid rgba(255, 70, 70, 0.25)",
                                    color: "#ff7676",
                                    fontSize: "14px",
                                }}
                            >
                                {error}
                            </div>

                        )}


                        {/* OPTIONS */}

                        <div className="auth-options">

                            <label className="remember">

                                <input
                                    type="checkbox"
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>


                            <Link to="/forgot-password">
                                Forgot password?
                            </Link>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing In..."
                                : "Sign In"}

                        </button>

                    </form>


                    {/* DIVIDER */}

                    <div className="auth-divider">

                        <span>
                            OR
                        </span>

                    </div>


                    {/* REGISTER */}

                    <p className="auth-register">

                        Don't have an account?

                        <Link to="/register">
                            Create account
                        </Link>

                    </p>

                </div>


                {/* FOOTER */}

                <p className="auth-footer">

                    FACTORYX AI • Smart Manufacturing Intelligence

                </p>

            </div>

        </div>
    );
}

export default Login;