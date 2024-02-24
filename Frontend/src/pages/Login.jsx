import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { redirect } from "react-router-dom";
import Loader from "../components/Loader";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const theme = createTheme({
        palette: {
            primary: {
                main: "#000000",
            },
        },
    });

    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });

    const loginHandler = (data) => {
        setLoading(true);
        axios
            .post(`${import.meta.env.VITE_BACKEND_API}/api/login`, data, {
                withCredentials: true,
            })
            .then((res) => {
                window.location.href = "/";
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                console.log(err);
                setLoading(false);
            });
    };

    const validation = () => {
        if (userDetails.email == "" || userDetails.password == "") {
            toast.error("Fill each user details");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
            toast.error("Enter a valid email");
            return;
        }
        loginHandler(userDetails);
    };

    return (
        <div>
            <Toaster />
            {loading ? (
                <Loader />
            ) : (
                <div className="w-full flex justify-center items-center h-screen bg-gradient-to-r from-[#d1601b4f] to-[#ad5c51d1]">
                    <div className="bg-white flex shadow-md flex-col items-center p-4 w-[400px]">
                        <h1 className="text-5xl text-[#D25F1F] mb-14 mt-3 font-semibold text-center">
                            Login
                        </h1>
                        <div className="my-5 m-auto w-[300px] flex flex-col justify-between h-[140px]">
                            <ThemeProvider theme={theme}>
                                <TextField
                                    // id="filled-email-input"
                                    label="Email Address"
                                    type="email"
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
                                    // id="filled-password-input"
                                    label="Password"
                                    type="password"
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
                            Login
                        </button>

                        <h1 className="text-[#D25F1F] mb-4 font-semibold">
                            Don't have an account?{" "}
                            <a className="text-black" href="/signup">
                                SignUp
                            </a>
                        </h1>
                    </div>
                </div>
            )}
        </div>
    );
}
