import React from 'react'

const Chatbox = () => {
  return (
       <content className="chatbox">
          
    <div className="messages">
      <div className="message received">
        Hey! Long time no see
        <div className="message-time">10:32 AM</div>
      </div>
      <div className="message sent">
        Yeah! How have you been?
        <div className="message-time">10:34 AM</div>
      </div>
      <div className="message received">
        Great! Working on some cool projects
        <div className="message-time">10:35 AM</div>
      </div>
      <div className="message sent">
        Same here! Let's catch up soon!
        <div className="message-time">10:36 AM</div>
      </div>
    </div>
</content>
  )
}

export default Chatbox