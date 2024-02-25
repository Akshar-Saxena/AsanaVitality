import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as posenet from "@tensorflow-models/posenet";
import { drawKeypoints, drawSkeleton } from "../constants/utilities";
import { useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import { useTimer } from "react-timer-hook";
import yogaLandmarks from "../constants/yogaLandmarks.json";

function MyTimer({ expiryTimestamp }) {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({
        expiryTimestamp,
        onExpire: () => console.warn("onExpire called"),
    });
    return (
        <h1 className="text-2xl font-bold">
            Time Left: {minutes}:{seconds}
        </h1>
    );
}

export default function Session() {
    const { id } = useParams();
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const time = new Date();
    let index = 0;
    const [yogaName, setYogaName] = useState(
        yogaLandmarks.angles[index].name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );
    const [nextYogaName, setNextYogaName] = useState(
        yogaLandmarks.angles[index + 1].name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );
    const [yogaImg, setYogaImg] = useState("/yogaImages/yoga-1.png");
    let counter = 0;
    const [rh, setRh] = useState(0);
    const [lh, setLh] = useState(0);
    const [rl, setRl] = useState(0);
    const [ll, setLl] = useState(0);
    const [ru, setRu] = useState(0);
    const [lu, setLu] = useState(0);
    const [rlw, setRlw] = useState(0);
    const [llw, setLlw] = useState(0);
    const [flag, setFlag] = useState(false);
    let interval;
    time.setSeconds(time.getSeconds() + 600);

    let count = 0;
    const runPosenet = async () => {
        const net = await posenet.load({
            inputResolution: { width: 640, height: 480 },
            scale: 0.8,
        });
        interval = setInterval(() => {
            detect(net);
            counter = counter + 1;
            if (counter == 15) {
                counter = 0;
                index = index + 1;
                setYogaName(
                    yogaLandmarks.angles[index].name
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                );
                setYogaImg(`/yogaImages/yoga-${index + 1}.png`);
                setNextYogaName(
                    index == 19
                        ? "-"
                        : yogaLandmarks.angles[index + 1].name
                              .split(" ")
                              .map(
                                  (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                              )
                              .join(" ")
                );
            }
        }, 1000);
    };

    useEffect(() => {
        function handleReload(event) {
            event.preventDefault();
            window.removeEventListener("beforeunload", handleReload, {
                capture: true,
            });
            return (event.returnValue = "");
        }
        window.history.pushState({}, null, null);

        window.addEventListener("beforeunload", handleReload, {
            capture: true,
        });

        window.addEventListener("popstate", handleReload, { capture: true });

        return () => {
            window.removeEventListener("beforeunload", handleReload, {
                capture: true,
            });
            window.removeEventListener("popstate", handleReload, {
                capture: true,
            });
        };
    });

    // useEffect(() => {
    //     if (!flag) return;
    //     return () => runPosenet();
    // }, []); // Run only once on component mount

    function find_angle(p0, p1, c) {
        // var p0c = Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2)); // p0->c (b)
        // var p1c = Math.sqrt(Math.pow(c.x - p1.x, 2) + Math.pow(c.y - p1.y, 2)); // p1->c (a)
        // var p0p1 = Math.sqrt(
        //     Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)
        // ); // p0->p1 (c)
        // return Math.acos(
        //     (p1c * p1c + p0c * p0c - p0p1 * p0p1) / (2 * p1c * p0c)
        // );
        let m1 = (p0.y - c.y) / (p0.x - c.x);
        let m2 = (p1.y - c.y) / (p1.x - c.x);
        const tanthetha = (m1 - m2) / (1 + m1 * m2);
        return Math.atan(tanthetha);
    }

    const angleCorrector = (angle) => {
        if (angle < 0) {
            return Math.round(180 + angle * 57.2958);
        } else {
            return Math.round(angle * 57.2958);
        }
    };

    const detect = async (net) => {
        // Make Detections
        if (
            typeof videoRef.current !== "undefined" &&
            videoRef.current !== null &&
            videoRef.current.video.readyState === 4
        ) {
            const video = videoRef.current.video;
            const videoWidth = videoRef.current.video.videoWidth;
            const videoHeight = videoRef.current.video.videoHeight;

            // Set video width
            videoRef.current.video.width = videoWidth;
            videoRef.current.video.height = videoHeight;

            const pose = await net.estimateSinglePose(video);
            const landmarks = [];
            const fullLandmarks = [];
            let temp = [];
            // pose.keypoints.forEach((element) => {
            //     if (
            //         element.part == "leftShoulder" ||
            //         element.part == "leftWrist" ||
            //         element.part == "leftElbow"
            //     ) {
            //         temp.push(element.position);
            //         fullLandmarks.push(element);
            //     }
            // });
            const { right_hand, left_hand, right_leg, left_leg } =
                yogaLandmarks.angles[0];
            const leftShoulder = pose.keypoints.find(
                (kp) => kp.part === "leftShoulder"
            );
            const leftElbow = pose.keypoints.find(
                (kp) => kp.part === "leftElbow"
            );
            const leftWrist = pose.keypoints.find(
                (kp) => kp.part === "leftWrist"
            );
            const rightShoulder = pose.keypoints.find(
                (kp) => kp.part === "rightShoulder"
            );
            const rightElbow = pose.keypoints.find(
                (kp) => kp.part === "rightElbow"
            );
            const rightWrist = pose.keypoints.find(
                (kp) => kp.part === "rightWrist"
            );
            const leftHip = pose.keypoints.find((kp) => kp.part === "leftHip");
            const leftKnee = pose.keypoints.find(
                (kp) => kp.part === "leftKnee"
            );
            const leftAnkle = pose.keypoints.find(
                (kp) => kp.part === "leftAnkle"
            );
            const rightHip = pose.keypoints.find(
                (kp) => kp.part === "rightHip"
            );
            const rightKnee = pose.keypoints.find(
                (kp) => kp.part === "rightKnee"
            );
            const rightAnkle = pose.keypoints.find(
                (kp) => kp.part === "rightAnkle"
            );

            // Calculate angles
            const leftHandAngle = angleCorrector(
                find_angle(
                    leftShoulder.position,
                    leftWrist.position,
                    leftElbow.position
                )
            );
            const rightHandAngle = angleCorrector(
                find_angle(
                    rightShoulder.position,
                    rightWrist.position,
                    rightElbow.position
                )
            );
            const leftLegAngle = angleCorrector(
                find_angle(
                    leftHip.position,
                    leftAnkle.position,
                    leftKnee.position
                )
            );
            const rightLegAngle = angleCorrector(
                find_angle(
                    rightHip.position,
                    rightAnkle.position,
                    rightKnee.position
                )
            );
            const rightUpperAngle = angleCorrector(
                find_angle(
                    rightHip.position,
                    rightElbow.position,
                    rightShoulder.position
                )
            );
            const leftUpperAngle = angleCorrector(
                find_angle(
                    leftHip.position,
                    leftElbow.position,
                    leftShoulder.position
                )
            );
            const rightLowerAngle = angleCorrector(
                find_angle(
                    rightShoulder.position,
                    rightKnee.position,
                    rightHip.position
                )
            );
            const leftLowerAngle = angleCorrector(
                find_angle(
                    leftShoulder.position,
                    leftKnee.position,
                    leftHip.position
                )
            );

            // const findScore = (rh0, lh0, rl0, ll0, rh1, lh1, rl1, ll1) => {
            //     let mean =
            //         (Math.abs(rh0 - rh1) +
            //             Math.abs(lh0 - lh1) +
            //             Math.abs(rl0 - rl1) +
            //             Math.abs(ll0 - ll1)) /
            //         4;
            //     console.log(100 - mean);
            // };

            // findScore(
            //     right_hand,
            //     left_hand,
            //     right_leg,
            //     left_leg,
            //     rightHandAngle,
            //     leftHandAngle,
            //     rightLegAngle,
            //     leftLegAngle
            // );
            // console.log("\n..............Calculated...............");
            // console.log("Right hand angle: " + rightHandAngle);
            // console.log("Left hand angle: " + leftHandAngle);
            // console.log("Right leg angle: " + rightLegAngle);
            // console.log("Left leg angle: " + leftLegAngle);
            // console.log("Right Upper angle: " + rightUpperAngle);
            // console.log("Left Upper angle: " + leftUpperAngle);
            // console.log("Right Lower angle: " + rightLowerAngle);
            // console.log("Left Lower angle: " + leftLowerAngle);
            // console.log(".....................................\n");
            setRh(rightHandAngle);
            setLh(180 - leftHandAngle);
            setRl(rightLegAngle);
            setLl(leftLegAngle);
            setRu(rightUpperAngle);
            setLu(leftUpperAngle);
            setRlw(rightLowerAngle);
            setLlw(leftLowerAngle);
            // console.log("\n...............Original..............");
            // console.log("Right hand angle: " + right_hand);
            // console.log("Left hand angle: " + left_hand);
            // console.log("Right leg angle: " + right_leg);
            // console.log("Left leg angle: " + left_leg);
            // console.log(".....................................\n");
            // console.log(landmarks);
            // const angle = find_angle(landmarks[0], landmarks[1], landmarks[2]);
            // // console.log(angle);
            // console.log(180 - Math.round(angle * 57.2958));
            // if (180 - angle * 57.3248407643 < 50) {
            //     count += 1;
            //     console.log(count);
            // }
        }
    };

    return (
        <div>
            {!flag ? (
                <div className="w-[300px] flex flex-col justify-center p-6 px-10 rounded-md shadow-sm shadow-gray-400 m-auto mt-[50vh] -translate-y-1/2 bg-gray-100">
                    <ul className="list-disc">
                        <li className="mb-4 text-justify">
                            Ensure the background is clear. Wear clothing that
                            contrasts with the background.
                        </li>
                        <li className="mb-4 text-justify">
                            Strong network connection
                        </li>
                        <li className="mb-4 text-justify">
                            The entire body should be visible on the webcam.
                        </li>
                    </ul>
                    <button
                        className="bg-green-600 mt-10 text-white py-2 px-7 rounded-md"
                        onClick={() => {
                            runPosenet();
                            setFlag(true);
                        }}
                    >
                        I Agree
                    </button>
                </div>
            ) : (
                <div className="w-full mt-10">
                    <div className="w-[95%] flex justify-evenly items-center m-auto">
                        <Webcam
                            ref={videoRef}
                            videoConstraints={{
                                width: 640,
                                height: 480,
                                facingMode: "user",
                            }}
                            style={{
                                transform: "scaleX(-1)",
                                border: "2px solid #BD7A71",
                                borderRadius: "10px",
                                boxShadow: "0px 10px 10px gray",
                            }}
                            audio={false}
                        />

                        <div className="w-[40%]">
                            {/* <VideoPlayer /> */}
                            <img src={yogaImg} alt="" />
                            <h1 className="font-bold text-xl my-2">
                                Yoga Name : {yogaName}
                            </h1>
                            <h1 className="font-semibold text-sm my-2">
                                Next Yoga Name : {nextYogaName}
                            </h1>
                            <MyTimer expiryTimestamp={time} />
                            <button
                                className="bg-red-600 mt-10 text-white py-2 px-7 rounded-md"
                                onClick={() => {
                                    clearInterval(interval);
                                    setFlag(false);
                                    navigate("/");
                                }}
                            >
                                End Session
                            </button>

                            {/* <h1>
                        Time:{" "}
                        {`${min.toString().padStart(2, "0")}:${sec
                            .toString()
                            .padStart(2, "0")}`}
                    </h1> */}
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center py-16 font-semibold">
                        <h1>Right hand angle: {rh}</h1>
                        <h1>Left hand angle: {lh}</h1>
                        <h1>Right leg angle: {rl}</h1>
                        <h1>Left leg angle: {ll}</h1>
                        <h1>Right Upper angle: {ru}</h1>
                        <h1>Left Upper angle: {lu}</h1>
                        <h1>Right Lower angle: {rlw}</h1>
                        <h1>Left Lower angle: {llw}</h1>
                    </div>
                </div>
            )}
        </div>
    );
}
