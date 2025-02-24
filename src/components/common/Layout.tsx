import Header from "./Header"
import Footer from "./Footer"
import { LayoutProps } from "@/types/layout.type"

const Layout = ({children}: LayoutProps) => {
  return (
    <div className="flex flex-col">
      <Header/>
      <main className="relative z-0 flex-1 overflow-auto mt-[72px] mb-[56px]">
      {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout