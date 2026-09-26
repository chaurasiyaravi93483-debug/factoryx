import { Link, useNavigate } from "react-router-dom";
import {
    Factory,
    Lock,
    Mail,
    User,
    ArrowLeft,
    Eye,
    EyeOff
} from "lucide-react";

import { useState } from "react";
import "../auth.css";

function Register() {

    const navigate = useNavigate();

    const API_BASE_URL =
        import.meta.env.VITE_API_URL?.replace(/\/$/, "");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };


    // =====================================================
    // REGISTER
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ---------------------------------------------
        // API URL CHECK
        // ---------------------------------------------

        if (!API_BASE_URL) {

            setError(
                "API URL is not configured."
            );

            return;
        }


        // ---------------------------------------------
        // REQUIRED FIELDS
        // ---------------------------------------------

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password ||
            !form.confirmPassword
        ) {

            setError(
                "Please fill all required fields."
            );

            return;
        }


        // ---------------------------------------------
        // PASSWORD LENGTH
        // ---------------------------------------------

        if (form.password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        // ---------------------------------------------
        // PASSWORD MATCH
        // ---------------------------------------------

        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_BASE_URL}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        name: form.name.trim(),
                        email: form.email.trim(),
                        password: form.password,
                    }),
                }
            );


            let data = {};

            try {
                data = await response.json();
            } catch {
                data = {};
            }


            // ---------------------------------------------
            // SERVER ERROR
            // ---------------------------------------------

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registration failed."
                );
            }


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            setSuccess(
                "Registration successful. Redirecting to login..."
            );


            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });


            setTimeout(() => {

                navigate("/login");

            }, 1200);


        } catch (err) {

            console.error(
                "Registration Error:",
                err
            );

            setError(
                err.message ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            {/* BACKGROUND */}

            <div className="auth-background"></div>


            <div className="auth-container">


                {/* BACK TO HOME */}

                <Link
                    to="/"
                    className="back-home"
                >

                    <ArrowLeft size={16} />

                    Back to Home

                </Link>


                {/* CARD */}

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
                            Create your account
                        </h1>

                        <p>
                            Join FACTORYX AI and manage your
                            smart manufacturing operations.
                        </p>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                    >


                        {/* NAME */}

                        <div className="input-group">

                            <label>
                                Full Name
                            </label>


                            <div className="input-wrapper">

                                <User size={18} />


                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    required
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="input-group">

                            <label>
                                Email Address
                            </label>


                            <div className="input-wrapper">

                                <Mail size={18} />


                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@company.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
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
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
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
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
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


                        {/* CONFIRM PASSWORD */}

                        <div className="input-group">

                            <label>
                                Confirm Password
                            </label>


                            <div className="input-wrapper">

                                <Lock size={18} />


                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={
                                        form.confirmPassword
                                    }
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >

                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-error">
                                {error}
                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="auth-success">
                                {success}
                            </div>

                        )}


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }

                        </button>

                    </form>


                    {/* DIVIDER */}

                    <div className="auth-divider">

                        <span>
                            OR
                        </span>

                    </div>


                    {/* LOGIN */}

                    <p className="auth-register">

                        Already have an account?

                        <Link to="/login">
                            Sign in
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

export default Register;