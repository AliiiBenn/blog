import type { Category } from '@/payload-types'

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories: _categories }: CategoryListProps) {
  return <div>Category List</div>
}
