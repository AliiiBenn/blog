import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'David Pereira',
  description:
    'Developer and creator of Nesalia Inc and Deessejs - A company building the future of software development and computer science education, along with a CMS/Framework for computing excellence.',
}

export default async function HomePage() {
  return (
    <main className="w-full mt-0 md:mt-16">
      <h1
        id="david-pereira"
        className="text-xl md:text-2xl mb-1 font-medium leading-13"
      >
        David Pereira
      </h1>
      <p className="text-copy my-5">
        I&apos;m a{' '}
        <a
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
          href="/about"
        >
          developer and creator
        </a>
        . I founded{' '}
        <a
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
          href="https://nesalia.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nesalia Inc
        </a>{' '}
        and{' '}
        <a
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
          href="https://deessejs.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deessejs
        </a>
        , companies dedicated to creating the future of software development and computer science education. I&apos;ve been coding for over a decade and building tools for developers.
      </p>
      <p className="text-copy my-5">
        My life&apos;s work is to build the world of tomorrow&apos;s computing, ready for AI and the next generation of exceptional developers.
      </p>
      <p className="text-copy my-5">Some of my favorite writing includes:</p>
      <ul className="text-copy pl-0 space-y-1">
        <li className="pl-1">
          <a
            className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
            href="/beliefs"
          >
            Things I Believe
          </a>
        </li>
        <li className="pl-1">
          <a
            className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
            href="/ai"
          >
            Understanding AI
          </a>
        </li>
        <li className="pl-1">
          <a
            className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
            href="/developers"
          >
            Developer Tools of Tomorrow
          </a>
        </li>
        <li className="pl-1">
          <a
            className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
            href="/education"
          >
            The Future of CS Education
          </a>
        </li>
        <li className="pl-1">
          <a
            className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
            href="/cms"
          >
            Building Excellence in Web Development
          </a>
        </li>
      </ul>
      <p className="text-copy my-5">
        You can{' '}
        <a
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
          href="https://github.com/AliiiBenn"
          target="_blank"
          rel="noopener noreferrer"
        >
          code
        </a>
        , or{' '}
        <a
          href="https://x.com/codewizdave"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
        >
          follow me on X
        </a>
        , or{' '}
        <a
          href="https://linkedin.com/in/codewithdave"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
        >
          connect on LinkedIn
        </a>
        .{' '}
        <a
          href="mailto:david@nesalia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
        >
          Reach out
        </a>{' '}
        if interested.
      </p>
    </main>
  )
}