import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Folder, FolderOpen, File } from 'lucide-react'
import Link from 'next/link'
import { getProjects } from './index'
import { Project } from '@/payload-types'
import { Suspense } from 'react'

async function ProjectsGridContent() {
  const projects: Project[] = await getProjects()

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={project.url}
          className="block h-full hover:opacity-90 transition-opacity"
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-md border border-border p-2 bg-background">
                  <Folder className="size-5" />
                </div>
                <div className="flex-1">
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {project.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Project Image</span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export function ProjectsGrid() {
  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <ProjectsGridContent />
    </Suspense>
  )
}