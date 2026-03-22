"use client";

import { useFetch } from "@/hooks/useFetch";
import {readOptions, updateOptions} from "@/http/options";
import {OptionContext} from "@/store/option-context";
import {useContext, useEffect, useRef, useState} from "react";

export default function Options() {
	
  	const dialog = useRef();
	const {mainFolder, formattedFolder, init, setMainFolder, setFormattedFolder} = useContext(OptionContext);
    const [body, setBody] = useState({})
	async function handleSave() {
		const params = {
			mainFolder: mainFolder,
			formattedFolder: formattedFolder,
		};

		await updateOptions(params, {});
	}

	const {isFetching, fetchedData, error, setFetchedData} = useFetch(readOptions, body, {}, []);
	useEffect(() => {
        if ( fetchedData.message && mainFolder == "" && formattedFolder == "" ) {
            const values = JSON.parse( fetchedData.message );
            init( values )
        }
    }, [fetchedData, formattedFolder, init, mainFolder]);

	return (<>
		<div className="absolute top-2 left-2">
			<button
					className="bg-blue-900 px-4 focus:border-blue-700 border-blue-800 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid "
					onClick={() => { dialog.current.showModal() }}
			>
				Opciones
			</button>
		</div>
		<dialog className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent" id="modal" ref={dialog}>
			<div className="flex flex-col min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
				<div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg relative">
					<div className="flex flex-col gap-2 sm:items-start ">
						<p className="text-white text-xl"> Carpeta Ficheros </p>
						<input
							value={mainFolder}
							onChange={(e) => {
								setMainFolder(e.target.value);
							}}
							className="bg-slate-700 px-2 w-72 h-10 outline-none text-white border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
							/>
						<p className="text-white text-xl"> Carpeta Ficheros Formateados </p>
						<input
							value={formattedFolder}
							onChange={(e) => {
								setFormattedFolder(e.target.value);
							}}
							className="bg-slate-700 px-2  w-72 h-10 outline-none text-white border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
						/>
						<button
							className="bg-blue-900 px-4 focus:border-blue-700 border-blue-800 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid "
							onClick={handleSave}
						>
							Guardar Opciones
						</button>
					</div>
					<div className="absolute top-2 right-2">
						<button 
							onClick={() => { dialog.current.close() }}
							className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"> X </button>
					</div>
				</div>
			</div>
			
		</dialog>		
	</>
	);
}