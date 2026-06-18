import ProductCard from './ProductCard'

export default function RelatedProducts({ products, title = 'Produits associés' }) {
  if (!products?.length) return null

  return (
    <section className="mt-16 border-t border-border-light pt-16" aria-labelledby="related-products-title">
      <h2 id="related-products-title" className="section-title mb-8">
        {title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}
