import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { div } from "@tensorflow/tfjs";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Record from "../components/Record";

export default function Profile() {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [userData, setUserData] = useState({
        email: "",
        username: "",
        weight: 0,
        height: 0,
        age: 0,
        avatarLink: "./defaultAvatar.png",
    });

    function cmToFeetAndInches(cm) {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        return `${feet} ft ${Math.round(inches)} in`;
    }

    function calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return parseFloat(bmi.toFixed(1));
    }

    useEffect(() => {
        setLoading(true);
        axios
            .get(import.meta.env.VITE_BACKEND_API + "/api/verify", {
                withCredentials: true,
            })
            .then((res) => {
                if (Object.entries(res.data).length == 2) {
                    setVerified(true);
                    axios
                        .get(
                            import.meta.env.VITE_BACKEND_API +
                                "/api/getProfile",
                            {
                                withCredentials: true,
                            }
                        )
                        .then((res) => {
                            axios
                                .get(
                                    import.meta.env.VITE_BACKEND_API +
                                        "/api/records/getRecords",
                                    { withCredentials: true }
                                )
                                .then((res) => {
                                    setRecords(res.data.records);
                                })
                                .catch((err) => {
                                    null;
                                });
                            setUserData(res.data);
                            setLoading(false);
                        })
                        .catch((err) => {
                            setLoading(false);
                        });
                }
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);
    const logoutHandler = () => {
        axios
            .get(import.meta.env.VITE_BACKEND_API + "/api/logout", {
                withCredentials: true,
            })
            .then((res) => {
                console.log(res.data);
                window.location.href = "/";
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="w-full">
                    <div className="flex w-full flex-col items-center bg-gradient-to-r from-[#d1601b4f] to-[#ad5c51d1] h-fit">
                        <NavBar verified={verified} />
                        <div className="bg-white my-5 mb-8  flex flex-col justify-center items-center p-10 rounded-2xl shadow-sm shadow-gray-700 w-[320px]">
                            <img
                                className="w-[200px]"
                                src={userData.avatarLink}
                                alt=""
                            />
                            <h1 className="text-3xl text-center mt-4 font-semibold">
                                {userData.username}
                            </h1>
                            <h1 className="font-semibold">{userData.email}</h1>
                        </div>
                        <button
                            className="py-2 mb-14 px-10 rounded-md hover:outline hover:outline-1 hover:outline-white bg-[#D25F1F] text-white"
                            onClick={logoutHandler}
                        >
                            Logout
                        </button>
                    </div>
                    <div className="w-[90%] m-auto mt-10">
                        <h1 className="text-5xl text-[#BC7A70] font-bold">
                            Body Recor
                            <span className="border-b-2 border-[#BC7A70]">
                                ds
                            </span>
                        </h1>
                        <div className="ml-4 font-semibold text-xl">
                            <h1 className="mt-4">
                                Weight: {userData.weight} Kgs
                            </h1>
                            <h1>
                                Height: {cmToFeetAndInches(userData.height)}{" "}
                            </h1>
                            <h1>Age: {userData.age} yrs</h1>
                            <h1>
                                BMI:{" "}
                                {calculateBMI(userData.weight, userData.height)}
                            </h1>
                        </div>
                    </div>
                    <div className="my-4 mb-10 w-[90%] m-auto">
                        <h1 className="text-5xl text-[#BC7A70] font-bold">
                            Sessio
                            <span className="border-b-2 border-[#BC7A70]">
                                ns
                            </span>
                        </h1>
                        {records.map((element) => (
                            <Record record={element} />
                        ))}
                    </div>
                    <Footer />
                </div>
            )}
        </div>
    );
}
