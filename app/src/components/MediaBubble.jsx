import React from "react";
import useChatStore from "../store/useChatStore";
import useApp from "../store/useApp";
import useAuth from "../store/useAuth";
import timeAgo from "../auth/formatter";


const MediaBubble = ({ chat }) => {
    const { uploadProgress } = useChatStore();
    const { previewMedia, api } = useApp();
    const { user } = useAuth();
    const isSender = user?._id === chat?.sender?._id;


    return (
        <div className={`message ${isSender ? "sent" : "received"}`}>
            <div className="sending-media">
                {chat?.files[0]?.src_url
                    ? chat?.files?.length > 0 &&
                      chat?.files?.map((file, index) => {
                          let ext = file?.filename.split(".").pop();
                          let type = file?.type;
                          let src = "";
                          if (type === "image") {
                              src = file.src_url;
                          } else if (type === "video") {
                              src = "/video.png";
                          } else if (type === "audio") {
                              src = "/audio.png";
                          } else {
                              src = "/file.png";
                          }
                          return (
                              <div key={index} className="media-item">
                                  <img
                                      onClick={() => {
                                          previewMedia({
                                              type: file.type,
                                              url: file.src_url
                                          });
                                      }}
                                      src={src}
                                  />
                              </div>
                          );
                      })
                    : chat?.files?.length > 0 &&
                      chat?.files?.map((file, index) => {
                          let ext = file?.file?.name.split(".").pop();
                          let type = file?.file?.type.split("/")[0];
                          let src = "";
                          if (type === "image") {
                              src = URL.createObjectURL(file.file);
                          } else if (type === "video") {
                              src = "/video.png";
                          } else if (type === "audio") {
                              src = "/audio.png";
                          } else {
                              src = "/file.png";
                          }
                          return (
                              <div key={index} className="media-item">
                                  <img
                                      onClick={() => {
                                          previewMedia({
                                              type: file.file.type.split(
                                                  "/"
                                              )[0],
                                              url: `${api}/${file.uploadId}.${ext}`
                                          });
                                      }}
                                      src={src}
                                  />
                                  {uploadProgress[file.uploadId] < 100 && (
                                      <div className="overly">
                                          {file.uploadId && (
                                              <p>
                                                  {
                                                      uploadProgress[
                                                          file.uploadId
                                                      ]
                                                  }
                                                  %
                                              </p>
                                          )}
                                      </div>
                                  )}
                              </div>
                          );
                      })}
            </div>
            {chat.text}
            <div className="message-time">{timeAgo(chat.createdAt)}</div>
        </div>
    );
};

export default MediaBubble;
