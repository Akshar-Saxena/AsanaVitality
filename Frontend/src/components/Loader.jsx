import React, { useEffect, useState } from "react";
import yogaFacts from "../constants/yogaFacts.json";

export default function Loader() {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        setIndex(Math.floor(Math.random() * 9));
    }, []);
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <div className="flex flex-col items-center justify-center">
                <h1 className="italic">Loading Asana Vitality</h1>
                <img className="max-w-[200px]" src="./loader.gif" alt="" />
                <h1 className="w-[260px] font-semibold text-center">
                    {yogaFacts[0].facts[index]}
                </h1>
            </div>
        </div>
    );
}
