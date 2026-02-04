export default function Select({options, width, ...props}) {
	return (
		<select
			className="bg-slate-700 px-2 outline-none text-white border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
			style={{width: width+"%"}}
			{...props}
		>
			{options.map((optionText) => {
				return (
					<option value={optionText} key={optionText}>
						{" "}
						{optionText}{" "}
					</option>
				);
			})}
		</select>
	);
}
