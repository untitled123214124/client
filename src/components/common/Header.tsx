import { Button } from "../ui/button";

export default function Header() {
    return (
      <div  className="flex w-full fixed top-0 left-0 border-b p-4">
          <h1 className="text-lg font-bold grow text-left pt-1">DevMate</h1>
          <div className="place-self-end">
          <Button className="mr-2">Sign in</Button>
          <Button className="bg-white text-black border-black">Register</Button>
          </div>
      </div>
    )
  };