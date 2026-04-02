export default function PrettyButton( { children, ...props } ) {
    return <button
        className="bg-blue-900 px-4 focus:border-blue-700 border-blue-800 disabled:bg-blue-950 disabled:border-blue-900/50 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid "
        {...props}
    >
        {children}
    </button>
}