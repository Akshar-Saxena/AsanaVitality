import React from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar(props) {
    const navigate = useNavigate();
    return (
        <div className="w-[95%] h-[80px] items-center flex justify-between">
            <img className="w-[150px]" src="./websiteName.png" alt="" />
            <ul className="flex text-white">
                <a
                    href="/"
                    className="mx-10 hover:border-b-2 hover:border-[#D25F1F] "
                >
                    <li>Home</li>
                </a>
                <a
                    href=""
                    className="mx-10 hover:border-b-2 hover:border-[#D25F1F]"
                >
                    <li>About</li>
                </a>
                <a
                    href=""
                    className="mx-10 hover:border-b-2 hover:border-[#D25F1F]"
                >
                    <li>How it works</li>
                </a>
                <a
                    href=""
                    className="mx-10 hover:border-b-2 hover:border-[#D25F1F]"
                >
                    <li>FAQ's</li>
                </a>
            </ul>
            {props.verified ? (
                <button
                    className="py-2 px-10 rounded-md hover:outline hover:outline-1 hover:outline-white bg-[#D25F1F] text-white"
                    onClick={() => navigate("/profile")}
                >
                    Profile
                </button>
            ) : (
                <button
                    className="py-2 px-10 rounded-md hover:outline hover:outline-1 hover:outline-white bg-[#D25F1F] text-white"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            )}
        </div>
    );
}

NavBar.defaultProps = {
    verified: false,
};
