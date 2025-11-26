import NavBar from "./components/NavBar.jsx";
import Hero from "./components/Hero.jsx";
function App() {
	return (
		<>
			<div className="flex flex-col gap-20">
				<NavBar />
				<Hero />
			</div>
		</>
	);
}

export default App;
