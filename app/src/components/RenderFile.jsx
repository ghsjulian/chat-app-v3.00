import React from "react";
import useApp from "../store/useApp";

const RenderFile = () => {
    const { previewMediaObj } = useApp();

    if (previewMediaObj.type === "image") {
        return (
            <img
                style={{
                    width: "320px",
                    height: "350px",
                    objectFit: "cover",
                    borderRadius: "8px"
                }}
                src={previewMediaObj.url}
                alt="Preview Image"
            />
        );
    } else if (previewMediaObj.type === "video") {
        return (
            <video
                src={previewMediaObj.url}
                autoPlay
                loop
                playsInline
                controls
                style={{
                    width: "320px",
                    height: "350px",
                    objectFit: "cover",
                    borderRadius: "8px"
                }}
            ></video>
        );
    } else if (previewMediaObj.type === "audio") {
        return <audio src={previewMediaObj.url} autoPlay
                loop
                playsInline
                controls></audio>;
    } else {
        return (
            <img
                style={{
                    width: "320px",
                    height: "350px",
                    objectFit: "cover",
                    borderRadius: "8px"
                }}
                src="/icons/file.png"
                alt="Application File"
            />
        );
    }
};

export default RenderFile;
