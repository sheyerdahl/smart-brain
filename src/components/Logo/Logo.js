import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from "./brain.png"
import "./Logo.css"

const Logo = () => {
    return (
        <div className="ma4 mt0">
             <Tilt className="br2 shadow-2" style={{ height: '150px', width: '150px',}} perspective={500}>
                <div className="pa3">
                    <img style={{paddingTop: "1px"}} alt="logo" src={brain}/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo