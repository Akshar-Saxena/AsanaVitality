import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";
import avatars from "../constants/avatarImg.json";
import { TextField, ThemeProvider, createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
    const [loading, setLoading] = useState(false);
    const [circle, setCircle] = useState(0);
    const navigate = useNavigate();
    const [img, setImg] = useState("./avatar1.png");
    const [userDetails, setUserDetails] = useState({
        height: 0,
        weight: 0,
        age: 0,
    });

    const theme = createTheme({
        palette: {
            primary: {
                main: "#000000",
            },
        },
    });

    const saveProfile = () => {
        setLoading(true);
        axios
            .post(
                import.meta.env.VITE_BACKEND_API + "/api/editProfile",
                {
                    ...userDetails,
                    avatarLink: img,
                },
                { withCredentials: true }
            )
            .then((res) => {
                setUserDetails({
                    height: 0,
                    weight: 0,
                    age: 0,
                });

                setLoading(false);
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const validation = () => {
        if (userDetails.height == 0 || userDetails.weight == 0) {
            toast.error("Fill each fields");
            return;
        }
        saveProfile();
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
                            Welcome
                        </h1>

                        <div className="flex flex-col justify-center items-center">
                            <img className="w-[80px]" src={img} alt="" />
                            <h1 className="text-xs my-3">Choose your Avatar</h1>
                        </div>

                        <div className="flex flex-wrap my-3 justify-center">
                            {avatars.map((element, id) => (
                                <img
                                    src={`./avatar${element.avatar}.png`}
                                    key={id}
                                    style={{
                                        border:
                                            circle == id
                                                ? "4px solid #D25F1F"
                                                : null,
                                        borderRadius: "50%",
                                    }}
                                    alt=""
                                    className="w-[50px] mx-1 cursor-pointer"
                                    onClick={() => {
                                        setImg(`./avatar${element.avatar}.png`);
                                        setCircle(element.avatar - 1);
                                    }}
                                />
                            ))}
                        </div>

                        <div className="my-5 m-auto w-[300px] flex flex-col justify-between h-[170px]">
                            <ThemeProvider theme={theme}>
                                <TextField
                                    // id="filled-email-input"
                                    label="Weight (in Kgs)"
                                    type="number"
                                    variant="filled"
                                    InputLabelProps={{
                                        style: { color: "gray" },
                                    }}
                                    style={{ margin: "5px 0" }}
                                    onChange={(e) => {
                                        setUserDetails({
                                            ...userDetails,
                                            weight: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    // id="filled-password-input"
                                    label="Height (in Cms)"
                                    type="number"
                                    variant="filled"
                                    InputLabelProps={{
                                        style: { color: "gray" },
                                    }}
                                    style={{ margin: "5px 0" }}
                                    onChange={(e) => {
                                        setUserDetails({
                                            ...userDetails,
                                            height: e.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    // id="filled-password-input"
                                    label="Age"
                                    type="number"
                                    variant="filled"
                                    InputLabelProps={{
                                        style: { color: "gray" },
                                    }}
                                    style={{ margin: "5px 0" }}
                                    onChange={(e) => {
                                        setUserDetails({
                                            ...userDetails,
                                            age: e.target.value,
                                        });
                                    }}
                                />
                            </ThemeProvider>
                        </div>
                        <button
                            className="py-2 my-7 px-10 rounded-md hover:outline hover:outline-1 hover:outline-white bg-[#D25F1F] text-white"
                            onClick={validation}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
