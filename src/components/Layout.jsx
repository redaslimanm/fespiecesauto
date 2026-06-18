import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import { RouteSeo } from './Seo'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <RouteSeo />
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
