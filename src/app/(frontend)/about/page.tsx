import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - David Pereira',
  description:
    'Developer and creator of Nesalia Inc and Deessejs - A company building the future of software development and computer science education, along with a CMS/Framework for computing excellence.',
}

export default function AboutPage() {
  return (
    <main className="w-full mt-0 md:mt-16 px-4">
      <h1
        id="about"
        className="text-xl md:text-2xl mb-1 font-medium leading-13"
      >
        About
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
        My life&apos;s work is to write the next chapter of software engineering, ready for AI and the next generation of exceptional developers.
      </p>
      <h2 className="text-lg md:text-xl mb-1 font-medium leading-13 mt-8">
        Organizations
      </h2>
      <div className="space-y-4 mt-4">
        <div>
          <h3 className="text-copy font-medium">Nesalia Inc</h3>
          <p className="text-copy my-2">
            Software development toolkit company for modern developers, creating the future of software development and computer science education.
          </p>
          <a
            href="https://github.com/nesalia-inc"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
          >
            github.com/nesalia-inc
          </a>
        </div>
        <div>
          <h3 className="text-copy font-medium">Deessejs</h3>
          <p className="text-copy my-2">
            A CMS/Framework for computing excellence, built for the next generation of developers and AI-powered applications.
          </p>
          <a
            href="https://deessejs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
          >
            deessejs.com
          </a>
        </div>
      </div>
      <h2 className="text-lg md:text-xl mb-1 font-medium leading-13 mt-8">
        Contact
      </h2>
      <p className="text-copy my-5">
        You can reach me at{' '}
        <a
          href="mailto:david@nesalia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
        >
          david@nesalia.com
        </a>
        , or find me on{' '}
        <a
          href="https://github.com/AliiiBenn"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
        >
          GitHub
        </a>
        ,{' '}
        <a
          href="https://x.com/codewizdave"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
        >
          X
        </a>
        , or{' '}
        <a
          href="https://linkedin.com/in/codewithdave"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors underline decoration-neutral-500 decoration-1 underline-offset-[2.5px] hover:decoration-neutral-400 dark:hover:decoration-neutral-600"
        >
          LinkedIn
        </a>
        .
      </p>
    </main>
  )
}