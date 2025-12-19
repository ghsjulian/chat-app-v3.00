import React from 'react'

const MediaBubble = ({chat}) => {
    console.log(chat.files)
  return (
   <div className="message sent">
                        <div className="sending-media">
                            <div className="media-item">
                                <img src="/boy.png" />
                                <div className="overly">
                                <p>100%</p>
                                </div>
                            </div>
                            <div className="media-item"></div>
                            <div className="media-item"></div>
                        </div>
                        Yeah! How have you been?
                        <div className="message-time">10:34 AM</div>
                    </div>
  )
}

export default MediaBubble