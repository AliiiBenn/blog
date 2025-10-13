'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Project } from '@/payload-types'

export const getProjects = async (): Promise<Project[]> => {
  const payload = await getPayload({ config })

  const projects = await payload.find({
    collection: 'projects',
  })

  return projects.docs
}
