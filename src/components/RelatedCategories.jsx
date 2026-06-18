import CategoryCard from './CategoryCard'
import SubcategoryCard from './SubcategoryCard'

export default function RelatedCategories({
  categories = [],
  subcategories = [],
  title = 'Catégories associées',
}) {
  const hasCategories = categories.length > 0
  const hasSubcategories = subcategories.length > 0
  if (!hasCategories && !hasSubcategories) return null

  return (
    <section className="mt-16 border-t border-border-light pt-16" aria-labelledby="related-categories-title">
      <h2 id="related-categories-title" className="section-title mb-8">
        {title}
      </h2>
      {hasSubcategories ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {subcategories.map(({ category, sub }) => (
            <SubcategoryCard key={`${category.slug}-${sub.slug}`} category={category} sub={sub} />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      )}
    </section>
  )
}
