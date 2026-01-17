import { useState } from "react"
function Menu() {

  const [show, setShow] = useState(false)

  const toggle = () => {
    setShow(!show)
  }

  return (
    <>
      <div className="hidden md:block font-semibold m-1 md:m-2 text-green-500 cursor-pointer md:space-x-16 m-1">
        <a href="#">Dashboard</a>
        <a href="#">Applications</a>
        <a href="#">Practice</a>
        <a href="#">Projects</a>
      </div>
    </>
  )
}

export default Menu