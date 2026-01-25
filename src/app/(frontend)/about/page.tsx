import type { Metadata } from 'next'
import Image from 'next/image'
import { Terminal, ChevronRight, Mail, MapPin, FileText } from 'lucide-react'
import { Kbd } from '@/components/ui/kbd'

export const metadata: Metadata = {
  title: 'About',
  description: 'About David Pereira - Python, Next.js, React, TypeScript developer and creator of Developers Secrets and Nesalia Inc',
}

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Header Section */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-border">
          {/* Terminal Prompt */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 font-mono text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Kbd className="bg-muted">$</Kbd>
              <span>cd ~/about</span>
            </div>
          </div>

          {/* Section Header */}
          <div>
            <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-3 py-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 font-mono text-xs text-muted-foreground">
                ~/about/
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl border-x border-b border-border px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="border-2 border-border bg-background">
                {/* Card Header */}
                <div className="border-b border-border bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3 w-3" />
                    <span>whoami</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="relative mx-auto mb-4 size-48 overflow-hidden rounded-full border-2 border-border">
                    <Image
                      src="/me.png"
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ChevronRight className="h-3 w-3" />
                      <span>name:</span>
                      <span className="text-foreground">&quot;David Pereira&quot;</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ChevronRight className="h-3 w-3" />
                      <span>role:</span>
                      <span className="text-foreground">&quot;Full-Stack Developer &amp; Entrepreneur&quot;</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ChevronRight className="h-3 w-3" />
                      <span>location:</span>
                      <span className="text-foreground">&quot;France&quot;</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ChevronRight className="h-3 w-3" />
                      <span>status:</span>
                      <span className="text-green-500">&quot;Building the future&quot;</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Bio Section */}
              <div>
                <div className="mb-4 font-mono text-sm font-semibold">
                  <span className="text-muted-foreground">{'>'}</span>
                  <span className="ml-2">./bio.sh</span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="font-mono text-sm text-muted-foreground">
                    Hi, I&apos;m David Pereira, a full-stack developer passionate about Python, Next.js, React, and TypeScript.
                    I&apos;m the creator of Developers Secrets, a computer science learning platform, and Nesalia Inc, a software development toolkit company.
                    My mission is to create a generation of exceptional developers.
                    This blog is where I share my thoughts, tutorials, and insights about technology.
                  </p>
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <div className="mb-4 font-mono text-sm font-semibold">
                  <span className="text-muted-foreground">{'>'}</span>
                  <span className="ml-2">cat skills.json</span>
                </div>
                <div className="border border-border bg-muted/20 p-4 font-mono text-sm">
                  <pre className="text-muted-foreground">
{`{
  "languages": ["Python", "TypeScript", "JavaScript"],
  "frontend": ["React", "Next.js"],
  "backend": ["Node.js", "Python"],
  "tools": ["Git", "VS Code", "Terminal"]
}`}
                  </pre>
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <div className="mb-4 font-mono text-sm font-semibold">
                  <span className="text-muted-foreground">{'>'}</span>
                  <span className="ml-2">curl contact.txt</span>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href="mailto:davidddpereiraaa6@gmail.com" className="hover:text-foreground">
                      davidddpereiraaa6@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>France</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <a href="https://github.com/AliiiBenn" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      github.com/AliiiBenn
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <a href="https://www.linkedin.com/in/codewithdave/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      linkedin.com/in/codewithdave
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
