import { Link, useNavigate } from "react-router-dom";
import {
    Factory,
    Mail,
    Lock,
    ArrowLeft,
    ShieldCheck,
    Eye,
    EyeOff,
    CheckCircle
} from "lucide-react";

import { useState } from "react";
import "../auth.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // BACKEND API URL
    // =====================================================

    const API_BASE_URL = (
        import.meta.env.VITE_API_URL ||
        "https://factoryx-1.onrender.com"
    ).replace(/\/$/, "");


    // =====================================================
    // SEND OTP
    // =====================================================

    const handleSendOtp = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/forgot-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email.trim(),
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
                    "Unable to send OTP."
                );
            }

            setSuccess(
                "OTP has been sent to your registered email."
            );

            setStep(2);

        } catch (err) {

            console.error(
                "Send OTP error:",
                err
            );

            if (err instanceof TypeError) {

                setError(
                    "Unable to connect to the server. Please try again."
                );

            } else {

                setError(
                    err.message ||
                    "Unable to send OTP. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // VERIFY OTP
    // =====================================================

    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (otp.length !== 6) {

            setError(
                "Please enter a valid 6-digit OTP."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/verify-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        otp: otp.trim(),
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
                    "Invalid OTP."
                );
            }

            setSuccess(
                "OTP verified successfully."
            );

            setStep(3);

        } catch (err) {

            console.error(
                "OTP verification error:",
                err
            );

            if (err instanceof TypeError) {

                setError(
                    "Unable to connect to the server. Please try again."
                );

            } else {

                setError(
                    err.message ||
                    "Invalid OTP. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (newPassword.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }

        if (newPassword !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/reset-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: email.trim(),
                        otp: otp.trim(),
                        newPassword: newPassword,
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
                    "Password reset failed."
                );
            }

            setSuccess(
                "Password reset successfully."
            );

            setStep(4);

        } catch (err) {

            console.error(
                "Reset password error:",
                err
            );

            if (err instanceof TypeError) {

                setError(
                    "Unable to connect to the server. Please try again."
                );

            } else {

                setError(
                    err.message ||
                    "Password reset failed."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // STEP 1 - EMAIL
    // =====================================================

    const renderEmailStep = () => {

        return (
            <>

                <div className="auth-heading">

                    <div className="auth-security-icon">
                        <Mail size={29} />
                    </div>

                    <h1>
                        Forgot password?
                    </h1>

                    <p>
                        Enter your registered email address and
                        we'll send you a verification OTP.
                    </p>

                </div>


                <form onSubmit={handleSendOtp}>

                    <div className="input-group">

                        <label>
                            Email Address
                        </label>

                        <div className="input-wrapper">

                            <Mail size={20} />

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


                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Sending OTP..."
                            : "Send OTP"
                        }

                    </button>

                </form>

            </>
        );
    };


    // =====================================================
    // STEP 2 - OTP
    // =====================================================

    const renderOtpStep = () => {

        return (
            <>

                <div className="auth-heading">

                    <div className="auth-security-icon">
                        <ShieldCheck size={30} />
                    </div>

                    <h1>
                        Verify OTP
                    </h1>

                    <p>
                        Enter the 6-digit OTP sent to
                        <br />

                        <strong
                            style={{
                                color: "#ffd33f",
                                fontWeight: "700"
                            }}
                        >
                            {email}
                        </strong>
                    </p>

                </div>


                <form onSubmit={handleVerifyOtp}>

                    <div className="input-group">

                        <label>
                            Verification OTP
                        </label>

                        <div className="input-wrapper">

                            <ShieldCheck size={20} />

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                className="otp-input"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                required
                            />

                        </div>

                    </div>


                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify OTP"
                        }

                    </button>

                </form>


                <div
                    style={{
                        textAlign: "center",
                        marginTop: "18px"
                    }}
                >

                    <button
                        type="button"
                        onClick={() => {
                            setStep(1);
                            setOtp("");
                            setError("");
                            setSuccess("");
                        }}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#74898a",
                            fontSize: "11px",
                            cursor: "pointer"
                        }}
                    >
                        Use a different email
                    </button>

                </div>

            </>
        );
    };


    // =====================================================
    // STEP 3 - NEW PASSWORD
    // =====================================================

    const renderPasswordStep = () => {

        return (
            <>

                <div className="auth-heading">

                    <div className="auth-security-icon">
                        <Lock size={29} />
                    </div>

                    <h1>
                        Create new password
                    </h1>

                    <p>
                        Your OTP has been verified.
                        Set a new password for your account.
                    </p>

                </div>


                <form onSubmit={handleResetPassword}>

                    {/* NEW PASSWORD */}

                    <div className="input-group">

                        <label>
                            New Password
                        </label>

                        <div className="input-wrapper">

                            <Lock size={20} />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
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


                    {/* CONFIRM PASSWORD */}

                    <div className="input-group">

                        <label>
                            Confirm Password
                        </label>

                        <div className="input-wrapper">

                            <Lock size={20} />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
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
                            >

                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}

                            </button>

                        </div>

                    </div>


                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Updating Password..."
                            : "Reset Password"
                        }

                    </button>

                </form>

            </>
        );
    };


    // =====================================================
    // STEP 4 - SUCCESS
    // =====================================================

    const renderSuccessStep = () => {

        return (
            <>

                <div className="auth-heading">

                    <div
                        className="auth-security-icon"
                        style={{
                            color: "#65e6b2",
                            background:
                                "rgba(50, 220, 150, 0.06)",
                            borderColor:
                                "rgba(50, 220, 150, 0.18)"
                        }}
                    >

                        <CheckCircle size={31} />

                    </div>

                    <h1>
                        Password updated
                    </h1>

                    <p>
                        Your FACTORYX account password has
                        been successfully changed.
                    </p>

                </div>


                <button
                    type="button"
                    className="auth-submit"
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Continue to Login
                </button>

            </>
        );
    };


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="auth-page">

            <div className="auth-background"></div>

            <div className="auth-container">

                {/* BACK TO LOGIN */}

                <Link
                    to="/login"
                    className="back-home"
                >
                    <ArrowLeft size={16} />
                    Back to Login
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


                    {/* STEP CONTENT */}

                    {step === 1 && renderEmailStep()}

                    {step === 2 && renderOtpStep()}

                    {step === 3 && renderPasswordStep()}

                    {step === 4 && renderSuccessStep()}


                    {/* BOTTOM LINK */}

                    {step !== 4 && (

                        <p className="auth-register">

                            Remember your password?

                            <Link to="/login">
                                Sign in
                            </Link>

                        </p>

                    )}

                </div>


                {/* FOOTER */}

                <p className="auth-footer">

                    FACTORYX AI • Smart Manufacturing Intelligence

                </p>

            </div>

        </div>
    );
}

export default ForgotPassword;