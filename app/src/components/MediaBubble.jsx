import React from "react";
import useChat from "../store/useChat";

const MediaBubble = ({ chat }) => {
    const { uploadProgress } = useChat();
    console.log(chat.files);
    console.log(uploadProgress);
    return (
        <div className="message sent">
            <div className="sending-media">
                {chat?.files?.length > 0 &&
                    chat?.files?.map((file, index) => {
                        return (
                            <div key={index} className="media-item">
                                <img src="/boy.png" />
                                <div className="overly">
                                    {file.uploadId && (
                                        <p>{uploadProgress[file.uploadId]}%</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                {chat.text}
                <div className="message-time">10:34 AM</div>
            </div>
        </div>
    );
};

export default MediaBubble;
