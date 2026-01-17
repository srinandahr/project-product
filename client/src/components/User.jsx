import user from '../assets/user.png'
function User() {

  return (
    <>
        <img className='border-1 md:border-2 border-green-500 rounded-full p-1 w-1/9 md:w-1/20 cursor-pointer' src={user}></img>

    </>
  )
}

export default User