import { GiHamburgerMenu } from "react-icons/gi";
import { ImCancelCircle } from "react-icons/im";
import { useState } from "react";
export function Hamburger() {
    const [show, setShow] = useState(false);

    const toggle = () => {
        setShow(!show);
    }

  return (
    <>
    <div className={`text-2xl md:text-3xl font-bold m-1 mt-2 md:m-2 text-green-500 cursor-pointer md:hidden ${show ? "hidden" : ""}`} onClick={toggle}>
      <GiHamburgerMenu />
    </div>
    <div className={`text-2xl md:text-3xl font-bold m-1 mt-2 md:m-2 text-green-500 cursor-pointer md:hidden ${show ? "" : "hidden"}`} onClick={toggle}>
      <ImCancelCircle />
    </div>
    </>
  )
}

export default Hamburger