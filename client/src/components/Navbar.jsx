import Logo from "./logo"
import User from "./User"
import Hamburger from "./Hamburger"
import Menu from "./Menu"

function Navbar() {

  return (
    <>
    <div className="flex justify-between m-2">
      <Hamburger></Hamburger>
      <Logo></Logo>
      <Menu></Menu>
      <User></User>
    </div>
    </>
  )
}

export default Navbar
