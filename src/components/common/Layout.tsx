import Header from "./Header"
import Footer from "./Footer"
import { LayoutProps } from "@/types/type"

const Layout = ({children}: LayoutProps) => {
  return (
    <div>
      <Header/>
      {children}
      <Footer />
    </div>
  )
}

export default Layout