import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Signup() {
    const [otp, setOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [stateOtp, stateSetOtp] = useState(-2328243434);

    const theme = createTheme({
        palette: {
            primary: {
                main: "#000000",
            },
        },
    });

    const SignUpHandler = () => {
        setLoading(true);
        axios
            .post(
                import.meta.env.VITE_BACKEND_API + "/api/signup",
                {
                    ...userDetails,
                    otp: stateOtp,
                },
                { withCredentials: true }
            )
            .then((res) => {
                // console.log(res.data);
                if (Object.entries(res.data).length == 1) {
                    axios
                        .post(
                            import.meta.env.VITE_BACKEND_API + "/api/profile",
                            { avatarLink: "" },
                            { withCredentials: true }
                        )
                        .then((res) => {
                            axios
                                .post(
                                    import.meta.env.VITE_BACKEND_API +
                                        "/api/records/editRecords",
                                    { record: [] },
                                    { withCredentials: true }
                                )
                                .then(() => {
                                    navigate("/welcome");
                                })
                                .catch((err) => {
                                    setLoading(false);
                                    console.log(err);
                                });
                        })
                        .catch((err) => {
                            setLoading(false);
                            null;
                            console.log(err);
                        });
                    return;
                }
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.response.data.message);
            });
    };

    const [userDetails, setUserDetails] = useState({
        email: "",
        username: "",
        password: "",
    });

    const validation = () => {
        if (userDetails.email == "" || userDetails.password == "") {
            toast.error("Fill each user details");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
            toast.error("Enter a valid email");
            return;
        }
        setLoading(true);
        axios
            .post(import.meta.env.VITE_BACKEND_API + "/api/sendOtp", {
                email: userDetails.email,
                username: userDetails.username,
            })
            .then((res) => {
                setOtp(true);
                setLoading(false);
                toast.success("OTP sent successfully");
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    return (
        <div>
            <Toaster />
            {loading ? (
                <Loader />
            ) : (
                <div className="w-full flex justify-center items-center h-screen bg-gradient-to-r from-[#d1601b4f] to-[#ad5c51d1]">
                    {otp ? (
                        <div className="bg-white flex shadow-md flex-col items-center p-4 w-[400px]">
                            <h1 className="text-5xl text-[#D25F1F] mb-14 mt-3 font-semibold text-center">
                                Verify OTP
                            </h1>
                            <div className="my-5 m-auto w-[300px] flex flex-col justify-between">
                                <ThemeProvider theme={theme}>
                                    <TextField
                                        id="filled-otp-input"
                                        label="Enter OTP"
                                        type="number"
                                        InputLabelProps={{
                                            style: { color: "gray" },
                                        }}
                                        onChange={(e) => {
                                            stateSetOtp(e.target.value);
                                        }}
                                    />
                                </ThemeProvider>
                            </div>
                            <button
                                onClick={SignUpHandler}
                                className="py-2 my-7 px-10 rounded-md hover:outline hover:outline-1 hover:outline-white bg-[#D25F1F] text-white"
                            >
                                Sign Up
                            </button>

                            <h1 className="text-[#D25F1F] text-center mb-4 font-semibold">
                                Check the spam box also. Didn't Received?{" "}
                                <a className="text-black" onClick={validation}>
                                    Resend OTP
                                </a>
                            </h1>
                        </div>
                    ) : (
                        <div className="bg-white flex shadow-md flex-col items-center p-4 w-[400px]">
                            <h1 className="text-5xl text-[#D25F1F] mb-14 mt-3 font-semibold text-center">
                                Sign Up
                            </h1>
                            <div className="my-5 m-auto w-[300px] flex flex-col justify-between h-[200px]">
                                <ThemeProvider theme={theme}>
                                    <TextField
                                        id="filled-username-input"
                                        label="Username"
                                        type="text"
                                        autoComplete="current-username"
                                        variant="filled"
                                        InputLabelProps={{
                                            style: { color: "gray" },
                                        }}
                                        onChange={(e) => {
                                            setUserDetails({
                                                ...userDetails,
                                                username: e.target.value,
                                            });
                                        }}
                                    />
                                    <TextField
                                        id="filled-email-input"
                                        label="Email Address"
                                        type="email"
                                        autoComplete="current-email"
                                        variant="filled"
                                        InputLabelProps={{
                                            style: { color: "gray" },
                                        }}
                                        onChange={(e) => {
                                            setUserDetails({
                                                ...userDetails,
                                                email: e.target.value,
                                            });
                                        }}
                                    />
                                    <TextField
                                        id="filled-password-input"
                                        label="Password"
                                        type="password"
                                        autoComplete="current-password"
                                        variant="filled"
                                        InputLabelProps={{
                                            style: { color: "gray" },
                                        }}
                                        onChange={(e) => {
                                            setUserDetails({
                                                ...userDetails,
                                                password: e.target.value,
                                            });
                                        }}
                                    />
                                </ThemeProvider>
                            </div>
                            <button
                                onClick={validation}
                                className="py-2 my-7 px-10 rounded-md hover:outline hover:outline-1 hover:outline-white bg-[#D25F1F] text-white"
                            >
                                Send OTP
                            </button>

                            <h1 className="text-[#D25F1F] mb-4 font-semibold">
                                Already have an account?{" "}
                                <a className="text-black" href="/login">
                                    Login
                                </a>
                            </h1>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
