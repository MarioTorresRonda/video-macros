export default function Block({char, width, ...props}) {
	return <div 
		className="text-2xl text-white"
		style={{width: width+"%"}}	
	> {char} </div>;
}
