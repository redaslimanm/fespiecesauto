import { Link } from 'react-router-dom'

import CategoryIcon from './CategoryIcon'



export default function CategoryGrid({ categories }) {

  return (

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">

      {categories.map((cat) => (

        <Link

          key={cat.id}

          to={`/categories/${cat.slug}`}

          className="group flex flex-col items-center rounded-xl px-3 py-5 transition-all duration-300 hover:bg-white hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] sm:px-4 sm:py-6"

        >

          <div className="flex h-24 w-full items-center justify-center sm:h-28 md:h-32">

            <CategoryIcon category={cat} size="lg" />

          </div>

          <span className="mt-2 text-center text-xs font-medium leading-snug text-text sm:mt-3 sm:text-sm">

            {cat.name}

          </span>

        </Link>

      ))}

    </div>

  )

}

