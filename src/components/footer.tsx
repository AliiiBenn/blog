import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About section */}
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-semibold">
              <span className="text-muted-foreground">{'>'}</span>
              <span className="ml-2">About</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Blog of David Pereira, creator of Developers Secrets and Nesalia Inc
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 font-mono text-sm font-semibold">
              <ChevronRight className="inline h-3 w-3" />
              <span className="ml-1">Navigation</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-3 font-mono text-sm font-semibold">
              <ChevronRight className="inline h-3 w-3" />
              <span className="ml-1">Connect</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/AliiiBenn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/codewithdave/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 font-mono text-sm font-semibold">
              <ChevronRight className="inline h-3 w-3" />
              <span className="ml-1">Legal</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
