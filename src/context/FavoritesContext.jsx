import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { categoryPath, subcategoryPath } from '../utils/routes'

const STORAGE_KEY = 'autopieces.favorites'

const FavoritesContext = createContext(null)

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readStored)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const value = useMemo(
    () => ({
      favorites,
      count: favorites.length,
      isFavorite: (key) => favorites.some((item) => item.key === key),
      toggleFavorite: (item) =>
        setFavorites((current) =>
          current.some((fav) => fav.key === item.key)
            ? current.filter((fav) => fav.key !== item.key)
            : [...current, item]
        ),
      removeFavorite: (key) =>
        setFavorites((current) => current.filter((item) => item.key !== key)),
    }),
    [favorites]
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export function categoryFavorite(category) {
  return {
    key: `category:${category.slug}`,
    type: 'category',
    name: category.name,
    to: categoryPath(category.slug),
    image: category.iconPng || `/categories/icons/${category.slug}.png`,
  }
}

export function subcategoryFavorite(category, sub) {
  return {
    key: `subcategory:${category.slug}/${sub.slug}`,
    type: 'subcategory',
    name: sub.name,
    parentName: category.name,
    to: subcategoryPath(category.slug, sub.slug),
    image: sub.image || category.iconPng || `/categories/icons/${category.slug}.png`,
  }
}
