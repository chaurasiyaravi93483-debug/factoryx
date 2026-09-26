import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = "http://localhost:8081/api/auth/register";

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password
        ) {
            setError("Please fill all required fields.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed."
                );
            }

            setSuccess("Registration successful. Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {
            console.error("Registration Error:", error);
            setError(error.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#031a1d",
                padding: "30px",
                color: "white",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "430px",
                    background:
                        "linear-gradient(145deg, #09282b, #061f22)",
                    border: "1px solid rgba(255,213,79,0.18)",
                    borderRadius: "16px",
                    padding: "35px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <h1
                        style={{
                            margin: 0,
                            color: "#FFD54F",
                            fontSize: "28px",
                        }}
                    >
                        FACTORYX
                    </h1>

                    <p
                        style={{
                            color: "#8fa7a9",
                            marginTop: "8px",
                        }}
                    >
                        Create your account
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            background: "rgba(255,70,70,0.1)",
                            border: "1px solid rgba(255,70,70,0.3)",
                            color: "#ff8c8c",
                            padding: "11px",
                            borderRadius: "8px",
                            marginBottom: "15px",
                            fontSize: "13px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        style={{
                            background: "rgba(50,220,150,0.1)",
                            border: "1px solid rgba(50,220,150,0.3)",
                            color: "#65e6b2",
                            padding: "11px",
                            borderRadius: "8px",
                            marginBottom: "15px",
                            fontSize: "13px",
                        }}
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            marginTop: "8px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#FFD54F",
                            color: "#031a1d",
                            fontWeight: "700",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "22px",
                        color: "#8fa7a9",
                        fontSize: "13px",
                    }}
                >
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        style={{
                            color: "#FFD54F",
                            textDecoration: "none",
                            fontWeight: "600",
                        }}
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    marginBottom: "13px",
    background: "#031a1d",
    border: "1px solid #244447",
    borderRadius: "8px",
    color: "white",
    outline: "none",
    fontSize: "14px",
};

export default Register;