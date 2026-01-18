import Logo from "./Logo"
import User from "./User"
import Hamburger from "./Hamburger"
import { useState } from "react";

function Navbar() {
    const [show, setShow] = useState(false);

    const toggle = () => {
        setShow(!show);
    }

  return (
    <>
    <div className="flex justify-between m-2">
      <Hamburger show={show} toggle={toggle}></Hamburger>
      <Logo></Logo>
      <div className="hidden md:block font-semibold m-2 text-green-500 cursor-pointer space-x-16">
        <a href="#">Dashboard</a>
        <a href="#">Applications</a>
        <a href="#">Practice</a>
        <a href="#">Projects</a>
      </div>
      <User></User>
    </div>
    <div className={`flex flex-col block md:hidden font-semibold text-green-500 cursor-pointer space-y-2 m-1 mt-10 items-center ${show ? "" : "hidden"}`}>
        <a href="#">Dashboard</a>
        <a href="#">Applications</a>
        <a href="#">Practice</a>
        <a href="#">Projects</a>
      </div>
    </>
  )
}

export default Navbar
