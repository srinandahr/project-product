import { GiHamburgerMenu } from "react-icons/gi";
import { ImCancelCircle } from "react-icons/im";
export function Hamburger({show,toggle}) {
    

  return (
    <>
    <div className={`text-2xl md:text-3xl font-bold m-1 mt-2 md:m-2 text-green-500 cursor-pointer md:hidden ${show ? "hidden" : ""}`} onClick={toggle}>
      <GiHamburgerMenu />
    </div>
    <div className={`flex flex-col text-2xl md:text-3xl font-bold m-1 mt-2 md:m-2 text-green-500 cursor-pointer md:hidden ${show ? "" : "hidden"}`} onClick={toggle}>
      <ImCancelCircle />
    </div>
    </>
  )
}

export default Hamburger