import { Button } from '@/components/ui/button'
import Layout from '@/components/common/Layout'

const Main = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center mt-32">
        <div className="flex flex-col w-2/4">
          <h1 className="text-5xl text-left">
            Welcome to DevMate <br /> Where Young <br /> Developers Grow <br /> Together!
          </h1>
          <h3 className="mt-10 text-left">
            Join our friendly community of young programmers. Share <br /> projects, learn together, and get helpful feedback from peers.
          </h3>
          <div className="place-self-start mt-10">
            <Button className="mr-5">Get Started</Button>
            <Button className="bg-gray-50 text-black">Learn More</Button>
          </div>
        </div>
        <div className="w-2/4">
          <img src="/assets/images/MainBanner.jpg" className="w-full" alt="Main Banner" />
        </div>
      </div>
    </Layout>
  )
}

export default Main