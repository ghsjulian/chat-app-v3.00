import React from "react";
import useApp from "../store/useApp";

const RenderFile = () => {
    const { previewMediaObj } = useApp();

    if (previewMediaObj.type === "image") {
        return <img src={previewMediaObj.url} alt="Preview Image" />;
    }else if (previewMediaObj.type === "video") {
        return <video src={previewMediaObj.url} controlls></video>;
    }else if (previewMediaObj.type === "audio") {
        return <audio src={previewMediaObj.url} controlls></audio>;
    }else {
        return <img src="/file.png" alt="Application File"/>
    }
};

export default RenderFile;
