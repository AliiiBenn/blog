import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="w-full mt-0 md:mt-16">
      <h1
        id="404"
        className="text-xl md:text-2xl mb-1 font-medium leading-13"
      >
        404 - Page Not Found
      </h1>
      <p className="text-copy my-5">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <p className="text-copy my-5">
        You can{' '}
        <Link
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
          href="/"
        >
          go back home
        </Link>
        , or check out my{' '}
        <Link
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
          href="/about"
        >
          about page
        </Link>
        .
      </p>
    </main>
  )
}