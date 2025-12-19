import React, { useState, useEffect } from 'react'

// This component will try to dynamically import `react-social-media-embed`
// and use its LinkedIn embed component. If the import or component is
// unavailable or embedding is blocked, it falls back to a styled card.
export default function LinkedInEmbed({ url, title, excerpt, image, postUrl, width, height }) {
  const [EmbedComp, setEmbedComp] = useState(null)
  const [embedError, setEmbedError] = useState(false)

  useEffect(() => {
    let mounted = true
    setEmbedComp(null)
    setEmbedError(false)
    // dynamic import so builds won't fail if package isn't installed
    import('react-social-media-embed').then(mod => {
      // Try common export names, including named `LinkedInEmbed`
      const Comp = mod.LinkedInEmbed || mod.LinkedIn || mod.LinkedInPost || (mod.default && (mod.default.LinkedInEmbed || mod.default.LinkedIn || mod.default.LinkedInPost))
      if (mounted && Comp) setEmbedComp(() => Comp)
      else if (mounted) setEmbedError(true)
    }).catch(err => {
      console.warn('react-social-media-embed import failed', err)
      if (mounted) setEmbedError(true)
    })
    return () => { mounted = false }
  }, [url])

  if (EmbedComp && !embedError) {
    // Render the third-party embed component. Most social embed components
    // accept a `url` prop. We pass the url and fall back to our card if it fails.
    // Pass through common props expected by react-social-media-embed
    const embedProps = { url }
    if (postUrl) embedProps.postUrl = postUrl
    if (width) embedProps.width = width
    if (height) embedProps.height = height

    return (
      <div className="mb-8">
        <EmbedComp {...embedProps} onError={() => setEmbedError(true)} style={{ width: '100%' }} />
      </div>
    )
  }

  // Fallback card when embed isn't available or allowed
  return (
    <div className="mb-8">
      <article className="border rounded-2xl p-6 bg-white shadow-md">
        {image && <img src={image} alt={title} className="w-full h-56 object-cover rounded mb-4" />}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title || 'LinkedIn Article'}</h3>
        <p className="text-slate-600 mb-4">{excerpt || 'Read the full article on LinkedIn.'}</p>
        <a className="inline-block text-sm font-medium text-[#0077b5] hover:underline" href={url} target="_blank" rel="noreferrer">Read on LinkedIn →</a>
      </article>
    </div>
  )
}
