export default function Number({width, ...props}) {
	return (
		<input
			style={{width: width+"%"}}
			className="bg-slate-700 px-2 w-full h-10 outline-none text-white border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
			type="number"
			{...props}
		/>
	);
}
