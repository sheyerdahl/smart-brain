import React from "react";

const ImageRecognition = ({imageUrl, imageCaptions}) => {
    return (
        <div className="">
            <p>{imageCaptions}</p>
            <img alt="" src={imageUrl} style={{width: "600px"}} />
        </div>
    )
}

export default ImageRecognition