export default async function Page({ params }: { params: { article_slug: string } }) {
  const { article_slug } = params
  return <>{article_slug}</>
}
