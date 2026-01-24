import type { Category } from '@/payload-types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category: _category }: CategoryCardProps) {
  return <div>Category Card</div>
}
