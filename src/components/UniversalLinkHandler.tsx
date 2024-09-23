'use client'

import { useEffect } from 'react'

interface UniversalLinkHandlerProps {
  path: string
}

export default function UniversalLinkHandler({ path }: UniversalLinkHandlerProps) {
  useEffect(() => {
    const mobileDeepLink = `alicialonsocampus://${path}`
    const appStoreLink = 'https://apps.apple.com/app/org.alicialonso.campus'
    const playStoreLink = 'https://play.google.com/store/apps/details?id=org.alicialonso.campus'

    // Check if the user is on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      // Attempt to open the app
      window.location.href = mobileDeepLink

      // If the app doesn't open after a delay, redirect to the app store
      setTimeout(() => {
        window.location.href = /iPhone|iPad|iPod/i.test(navigator.userAgent) 
          ? appStoreLink 
          : playStoreLink
      }, 2000)
    } else {
      // For desktop users, show a QR code or a message
      // You'll need to implement this part
      console.log('Show QR code or message for desktop users')
    }
  }, [path])

  return (<div>Redirecting...</div>);
}