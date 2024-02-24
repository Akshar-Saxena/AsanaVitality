import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import AboutUsContent from "../constants/AboutUsContent";
import HowItWorksContent from "../constants/HowItWorks";
import Footer from "../components/Footer";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";

export default function Home() {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_BACKEND_API}/api/verify`, {
                withCredentials: true,
            })
            .then((res) => {
                setVerified(true);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const startSession = () => {
        axios
            .get(`${import.meta.env.VITE_BACKEND_API}/api/session/Id`, {
                withCredentials: true,
            })
            .then((res) => {
                navigate(`/session/${res.data.sessionId}`);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    {/* Hero Section Starts */}
                    <div className="flex flex-col items-center bg-gradient-to-r from-[#d1601b4f] to-[#ad5c51d1] h-screen">
                        <NavBar verified={verified} />
                        <img className="w-[60%] mt-12" src="./bg.png" alt="" />
                        <h1 className="text-gray-200 text-2xl mt-10 font-semibold">
                            Yoga, Reinvented for Your Goals
                        </h1>
                        {verified && (
                            <button
                                onClick={startSession}
                                className="mt-8 bg-[#D25F1F] text-white rounded-2xl hover:shadow-md hover:shadow-white py-2 px-6"
                            >
                                Start Session
                            </button>
                        )}
                    </div>
                    {/* Hero Section Ends */}

                    {/* About Section Starts */}
                    <div className="py-10 mx-8">
                        <h1 className="text-5xl text-[#BC7A70] font-semibold">
                            Abo
                            <span className="border-b-2 border-[#BC7A70]">
                                ut
                            </span>
                        </h1>
                        <p className="text-justify mt-6">{AboutUsContent()}</p>
                    </div>
                    {/* About Section Ends */}

                    {/* How it works Section Starts */}
                    <div className="py-10 mx-8">
                        <h1 className="text-5xl text-[#BC7A70] font-semibold">
                            How it wor
                            <span className="border-b-2 border-[#BC7A70]">
                                ks
                            </span>
                        </h1>
                        <p className="text-justify mt-6">
                            {HowItWorksContent()}
                        </p>
                    </div>
                    {/* How it works Section Ends */}

                    {/* Footer Section Starts */}
                    <Footer />
                    {/* Footer Section Ends */}
                </div>
            )}
        </div>
    );
}
