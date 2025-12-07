import React from 'react'

const VideoMedia = () => {
  return (
   <div className="media sent">
                    <video controls paused>
                        <source src="./video.mp4" type="video/mp4" />
                    </video>
                </div>
  )
}

export default VideoMedia