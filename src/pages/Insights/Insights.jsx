import React, { useEffect, useState } from 'react'
import axios from 'axios'
import YouTubePlayer from '../../components/YouTubePlayer/YouTubePlayer'

function RecentVideos({ channelId }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [playingVideoId, setPlayingVideoId] = useState(null)
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyAaBfT_IL7w1uJ5QGIMO_AZC7J_fhIhnTY'

  useEffect(() => {
    if (!channelId) return
    const fetchVideos = async () => {
      setLoading(true)
      try {
        const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: API_KEY,
            channelId,
            part: 'snippet',
            order: 'date',
            maxResults: 3,
            type: 'video'
          }
        })
        setVideos(res.data.items || [])
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [channelId, API_KEY])

  return (
    <section className="bg-gradient-to-b from-white via-amber-50 to-amber-100 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            <span className="text-amber-600">Recent</span> Videos
          </h1>
          <a className="text-sm text-slate-600 hover:text-slate-800 font-medium" href={`https://www.youtube.com/channel/${channelId}`} target="_blank" rel="noreferrer">
            View channel →
          </a>
        </div>

        {playingVideoId && (
          <YouTubePlayer videoId={playingVideoId} onClose={() => setPlayingVideoId(null)} />
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-md h-96 animate-pulse">
                <div className="w-full h-56 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No videos found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {videos.map((video) => (
              <div
                key={video.id.videoId}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group"
              >
                <button
                  type="button"
                  onClick={() => setPlayingVideoId(video.id.videoId)}
                  className="block relative w-full text-left"
                  aria-label={`Play ${video.snippet.title}`}
                >
                  <div className="w-full h-56 overflow-hidden">
                    <img
                      src={video.snippet.thumbnails.high?.url || ''}
                      alt={video.snippet.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-14 h-14 text-white drop-shadow-lg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z" />
                    </svg>
                  </div>
                </button>

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-amber-700 transition">
                    {video.snippet.title.length > 70
                      ? video.snippet.title.slice(0, 70) + '...'
                      : video.snippet.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {video.snippet.description || 'No description available.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {new Date(video.snippet.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <button
                      className="text-sm font-medium text-[#00674F] hover:text-[#004d38] transition-colors"
                      onClick={() => setPlayingVideoId(video.id.videoId)}
                      type="button"
                    >
                      Watch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function LinkedInSection() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const feedUrl = import.meta.env.VITE_LINKEDIN_ARTICLES_URL || 'https://www.linkedin.com/posts/krutikakathal_proficorn2025-proudmsme-activity-7376133998852485121-dxxh?utm_source=share&utm_medium=member_desktop&rcm=ACoAADjk9IIBCzee7bW8oT-qWCi1FceArlAAj68'

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        if (!feedUrl) {
          setArticles([
            { id: 'mock-a', title: 'Sample LinkedIn Article 1', url: '#', excerpt: 'Configure VITE_LINKEDIN_ARTICLES_URL to load real articles.' },
            { id: 'mock-b', title: 'Sample LinkedIn Article 2', url: '#', excerpt: 'Configure VITE_LINKEDIN_ARTICLES_URL to load real articles.' },
            { id: 'mock-c', title: 'Sample LinkedIn Article 3', url: '#', excerpt: 'Configure VITE_LINKEDIN_ARTICLES_URL to load real articles.' }
          ])
          return
        }

        const res = await fetch(feedUrl)
        if (!res.ok) throw new Error('LinkedIn feed fetch failed')
        const data = await res.json()
        setArticles((data || []).slice(0, 3))
      } catch (err) {
        console.warn('Failed to fetch LinkedIn articles', err)
        setFetchError(err && err.message ? String(err.message) : String(err))
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [feedUrl])

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-gray-900 mb-12">
          <span className="text-[#0077b5]">LinkedIn</span> Articles
        </h2>
        {/* Debug info: visible when no feed or fetch failed */}
        {!feedUrl && (
          <div className="text-center text-sm text-yellow-700 mb-6">No `VITE_LINKEDIN_ARTICLES_URL` configured — showing mock articles.</div>
        )}
        {feedUrl && fetchError && (
          <div className="text-center text-sm text-red-600 mb-6">Failed to fetch LinkedIn feed: {fetchError}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="border rounded-2xl p-6 bg-white h-64 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map(a => (
              <article
                key={a.id}
                className="border rounded-2xl p-6 bg-white hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform"
              >
                <h3 className="font-semibold text-xl text-gray-900 mb-3">{a.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {a.excerpt && a.excerpt.slice(0, 140)}...
                </p>
                {a.url && (
                  <a
                    className="inline-block mt-3 text-sm font-medium text-[#0077b5] hover:text-[#005983] transition-colors"
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read on LinkedIn →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Insights() {
  const ytChannel = 'UCny1rTsKt1XuV1w5ML4RK6g'

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-4">
            Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our latest videos and articles curated from our channels
          </p>
        </div>

        <RecentVideos channelId={ytChannel} />
        {/* <LinkedInSection /> */}
      </div>
    </div>
  )
}
