import React, { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'

export default function OidcTrigger() {
  const auth = useAuth()

  useEffect(() => {
    const onSignIn = () => {
      try {
        auth.signinRedirect()
      } catch {
        // ignore
      }
    }

    window.addEventListener('oidc-signin', onSignIn)
    return () => window.removeEventListener('oidc-signin', onSignIn)
  }, [auth])

  return null
}
