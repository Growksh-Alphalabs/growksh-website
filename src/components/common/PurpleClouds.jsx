import React from 'react'

export default function PurpleClouds({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-20 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-fuchsia-300/8 rounded-full blur-2xl" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-300/12 rounded-full blur-4xl" />
      <div className="absolute left-20 top-1/3 w-44 h-44 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-8 left-1/2 w-60 h-60 bg-fuchsia-400/8 rounded-full blur-3xl" />
    </div>
  )
}
