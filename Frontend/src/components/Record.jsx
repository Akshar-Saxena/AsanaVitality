import React from "react";

export default function Record(props) {
    return (
        <div className="flex flex-col p-5 bg-gray-100 rounded-md shadow-sm shadow-gray-300 my-6">
            <h1 className="font-bold text-xl">
                Score:{" "}
                <span className="font-semibold text-gray-400">
                    {props.record.score}
                </span>
            </h1>
            <h1 className="font-bold text-xl">
                Best Yoga Name :{" "}
                <span className="font-semibold text-gray-400">
                    {props.record.best_yoga.charAt(0).toUpperCase() +
                        props.record.best_yoga.slice(1)}
                </span>
            </h1>
            <h1 className="font-bold text-xl">
                Worst Yoga Name :{" "}
                <span className="font-semibold text-gray-400">
                    {props.record.worst_yoga.charAt(0).toUpperCase() +
                        props.record.worst_yoga.slice(1)}
                </span>
            </h1>
            <h1 className="font-bold text-xl">
                Calories Burnt :{" "}
                <span className="font-semibold text-gray-400">
                    {props.record.calories_burned} KCal
                </span>
            </h1>
        </div>
    );
}
