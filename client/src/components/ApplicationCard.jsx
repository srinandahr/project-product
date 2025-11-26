export default function ApplicationCard() {
	return (
		<>
			<div className="p-2 border border-green-300 w-1/2 rounded-lg flex flex-col gap-4 bg-gray-900 items-center">
				<h1 className="font-semibold">Applications</h1>
				<div className="text-sm px-2 w-full flex flex-col gap-2">
					<div className="flex justify-between">
						<div>Total Applied</div>
						<div className="flex justify-start">
							<div className="bg-orange-400 px-10 rounded-lg"></div>
							<div className="font-bold">10</div>
						</div>
					</div>
					<div className="flex justify-around">
						<div>Callback</div>
						<div className="flex justify-start gap-4">
							<div className="bg-yellow-400 px-6 rounded-lg"></div>
							<div className="font-bold">6</div>
						</div>
					</div>
					<div className="flex justify-between">
						<div>Interviewed</div>
						<div className="bg-blue-400 px-3 rounded-lg"></div>
						<div className="font-bold">3</div>
					</div>
					<div className="flex justify-between">
						<div>Selected</div>
						<div className="bg-green-400 px-2 rounded-lg"></div>
						<div className="font-bold">2</div>
					</div>
					<div className="flex justify-between">
						<div>Rejected</div>
						<div className="bg-red-400 px-8 rounded-lg"></div>
						<div className="font-bold">8</div>
					</div>
				</div>
			</div>
		</>
	);
}
