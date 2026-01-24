import React from 'react'

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  return <div>Tag Page: {slug}</div>
}
