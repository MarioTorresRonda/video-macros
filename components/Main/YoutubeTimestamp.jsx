"use client";

import { useFetch } from "@/hooks/useFetch";
import {readOptions, updateOptions} from "@/http/options";
import {OptionContext} from "@/store/option-context";
import {useContext, useEffect, useRef, useState} from "react";

export default function YoutubeTimestamp() {
	
  	const dialog = useRef();
	const [videoURL, setVideoURL] = useState("")
	const [timestamps, setTimestamps] = useState("")

	const chapters =  []
	const timestampsRows = timestamps.split("\n");
	timestampsRows.forEach( timestampRow => {
		const time =  timestampRow.split(" ")[0];
		chapters.push( { time, info: timestampRow.substr( time.length + 1 ) } )
	});

	let command = ""
	try{
		for (let index = 0; index < chapters.length; index++) {
			const fromChapter = chapters[index];
			const toChapter = index + 1 < chapters.length ? chapters[index+1] : { time: "inf" };
			command += `yt-dlp --cookies /youtube/www.youtube.com_cookies.txt --js-runtimes node --remote-components ejs:github --download-sections "*${fromChapter.time}-${toChapter.time}" -o "%(title)s_${index+1}_${fromChapter.info}.%(ext)s" ${videoURL} ${ index + 1 < chapters.length ? "\n" : ""} `
			
		}
	}catch(e) {
		command= e.message;
	}


	return (<>
		<div className="absolute top-2 left-32">
			<button
					className="bg-blue-900 px-4 focus:border-blue-700 border-blue-800 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid "
					onClick={() => { dialog.current.showModal() }}
			>
				Youtube Timestamps
			</button>
		</div>
		<dialog className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent" id="modal" ref={dialog}>
			<div className="flex flex-col min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
				<div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-lg relative">
					<div className="flex flex-col gap-2 sm:items-start ">
						<p className="text-white text-xl"> Youtube URL </p>
						<input
							value={videoURL}
							onChange={(e) => {
								setVideoURL(e.target.value);
							}}
							className="bg-slate-700 px-2 w-[400px] h-10 outline-none text-white border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
						/>
						<p className="text-white text-xl"> Timestamps </p>
						<textarea
							value={timestamps}
							onChange={(e) => {
								setTimestamps(e.target.value);
							}}
							rows={5}
							className="bg-slate-700 px-2 w-[400px] h-[400px] outline-none text-white border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
						/>
						<p className="text-white text-xl"> Chapters </p>
						<div className="text-white">
							{chapters.map( (chapter) => {
								return <p key={chapter.time}> { chapter.time } - { chapter.info }  </p>
							} )}
						</div>
						<p className="text-white text-xl"> YT-DLP command </p>
						<textarea
							disabled
							value={command}
							rows={5}
							className="bg-slate-700 px-2 w-[400px] h-[400px] outline-none text-white border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
						/>
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