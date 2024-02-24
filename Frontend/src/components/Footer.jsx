import React from "react";

export default function Footer() {
    return (
        <footer className="flex justify-evenly flex-wrap bg-[#BD7A71] py-10 text-white">
            <div className="footer-part">
                <h3 className="text-2xl font-semibold">Asana Vitality</h3>
                <p>Yoga, Reinvented for your goals</p>
                <p>Phone no - 881032XXXX</p>
                <p>Email ID - asanavitalityhelp@gmail.com</p>
                <p>
                    Address - Asana Vitality Office, Tower B-1, Connaught Place,
                    Delhi
                </p>
            </div>

            <div className="footer-part">
                <h3 className="text-2xl font-semibold">Important Links</h3>
                <ul>
                    <a href="/">
                        <li>Home</li>
                    </a>
                    <a href="">
                        <li>About</li>
                    </a>
                    <a href="">
                        <li>How it works</li>
                    </a>
                    <a href="">
                        <li>FAQ’s</li>
                    </a>
                </ul>
            </div>

            <div className="footer-part">
                <h3 className="text-2xl font-semibold">Team EcoPioneers</h3>
                <ul>
                    <li>Abhishek Kumar</li>
                    <li>Akanksha Verma</li>
                    <li>Akshar Saxena</li>
                    <li>Akshat Singh</li>
                </ul>
            </div>
        </footer>
    );
}
