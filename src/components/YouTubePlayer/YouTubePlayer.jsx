import React, { useEffect } from 'react'

export default function YouTubePlayer({ videoId, onClose }) {
  useEffect(() => {
    return () => {
      // cleanup if needed in future
    }
  }, [videoId])

  if (!videoId) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`

  return (
    <div className="max-w-4xl mx-auto mb-8 relative">
      <button
        onClick={onClose}
        aria-label="Close video"
        className="absolute z-20 right-2 top-2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white"
      >
        ✕
      </button>

      <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-lg">
        <iframe
          title={`youtube-player-${videoId}`}
          src={src}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}
