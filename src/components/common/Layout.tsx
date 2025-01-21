import Footer from "./Footer";
import Header from "./Header";
import { LayoutProps } from "@/types/type";

export default function Layout({ children }: LayoutProps) {
    return (
       <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 gap-4 p-4 flex-col">{children}</main>
        <Footer />
       </div> 
      );
}