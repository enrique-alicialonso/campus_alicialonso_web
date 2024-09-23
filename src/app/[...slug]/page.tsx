import { redirect } from 'next/navigation'
import UniversalLinkHandler from '@/components/UniversalLinkHandler'

interface UniversalLinkPageProps {
  params: {
    slug: string[]
  }
}

export default function UniversalLinkPage({ params }: UniversalLinkPageProps) {
  const path = params.slug.join('/')
  
  return <UniversalLinkHandler path={path} />
}

// This generates all possible routes at build time
export async function generateStaticParams() {
  return [] // You can add known paths here if needed
}