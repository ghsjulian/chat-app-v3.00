import React from 'react'

const AudioMedia = () => {
  return (
      <div className="media sent">
                    <audio controls paused>
                        <source src="./audio.mp3" type="audio/mp3" />
                    </audio>
                </div>
  )
}

export default AudioMedia