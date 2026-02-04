export default function Count({count, width, ...props}) {
	return <div 
		className="text-2xl text-white"
		style={{width: width+"%"}}	
	> {count} </div>;
}
