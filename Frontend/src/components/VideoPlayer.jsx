import React from "react";

export default function VideoPlayer() {
    return (
        <video
            src="/yogaTuit.mp4"
            autoPlay
            muted
            style={{
                border: "1px solid black",
                borderRadius: "10px",
                boxShadow: "2px 2px 2px gray",
            }}
        ></video>
    );
}
