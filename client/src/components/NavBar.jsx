import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
function NavBar() {
	const [open, setOpen] = useState(false);
	const [md, setMd] = useState(false);
	var green = true;
	useEffect(() => {
		window.addEventListener("resize", () => {
			if (window.innerWidth >= 768) {
				setMd(true);
			} else {
				setMd(false);
			}
		});
	}, []);
	setInterval(() => {
		if (green) {
			document.getElementById("thedot").classList.remove("text-green-300");
			green = false;
		} else {
			document.getElementById("thedot").classList.add("text-green-300");
			green = true;
		}
	}, 5000);

	return (
		<div className="absolute  mt-0 border-b-2 border-green-300 w-full">
			<nav className="flex justify-between items-center p-2 md:m-2">
				<div className="flex">
					<h1 className="font-[khand] text-xl md:text-2xl font-semibold md:font-bold cursor-pointer hover:text-green-300">Project Product</h1>
					<h1 className="font-[khand] text-xl md:text-2xl font-semibold md:font-bold cursor-pointer" id="thedot">
						.
					</h1>
				</div>
				<button className="" onClick={() => setOpen(!open)}>
					{!md ? open ? <IoClose /> : <GiHamburgerMenu /> : null}
				</button>
				{md ? (
					<>
						<div className="flex gap-6 font-semibold">
							<a className="cursor-pointer hover:underline hover:text-green-300 underline-offset-5" href="#">
								Applications
							</a>
							<a className="cursor-pointer hover:underline hover:text-green-300 underline-offset-5" href="#">
								Resume
							</a>
							<a className="cursor-pointer hover:underline hover:text-green-300 underline-offset-5" href="#">
								Projects
							</a>
							<a className="cursor-pointer hover:underline hover:text-green-300 underline-offset-5" href="#">
								Learning
							</a>
						</div>
					</>
				) : null}
			</nav>
			{open && !md ? (
				<>
					<div className="flex flex-col items-center md:hidden">
						<a className="cursor-pointer" href="#">
							Applications
						</a>
						<a className="cursor-pointer" href="#">
							Resume
						</a>
						<a className="cursor-pointer" href="#">
							Projects
						</a>
						<a className="cursor-pointer" href="#">
							Learning
						</a>
					</div>
				</>
			) : null}
		</div>
	);
}
export default NavBar;
