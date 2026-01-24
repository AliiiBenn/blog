import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/payload-types'

interface CategoryCardProps {
  category: Category
  postCount?: number
}

export const CategoryCard = ({ category, postCount = 0 }: CategoryCardProps) => {
  const { name, slug, description, icon } = category
  const iconData = typeof icon === 'object' && icon !== null ? icon : null
  const iconUrl = iconData?.url || null
  const iconAlt = iconData?.alt || name

  return (
    <Link
      href={`/category/${slug}`}
      className="group flex flex-col items-center rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
    >
      {iconUrl ? (
        <div className="relative mb-4 size-16 overflow-hidden rounded-full bg-muted">
          <Image
            src={iconUrl}
            alt={iconAlt}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      ) : (
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-2xl font-bold">{name.charAt(0)}</span>
        </div>
      )}

      <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
        {name}
      </h3>

      {description && (
        <p className="mb-4 flex-1 text-center text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        {postCount} {postCount === 1 ? 'post' : 'posts'}
      </p>
    </Link>
  )
}
