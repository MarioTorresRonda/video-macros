'use client'

import { useFetch } from "@/hooks/useFetch"
import { fetchVideos, renameVideo } from "@/http/video";
import { videoFileType } from "@/lib/utils/videoFileType";
import { useCallback, useState } from "react";
import React from 'react';
import DisplayVideo from "./DisplayVideo";
import Checkbox from "@/components/Checkbox";
import VideoRow from "./VideoRow";

export default function FileSearch() {

    const [body, setBody] = useState( { 
        url: "C:\\Users\\mario\\Videos",
        types: videoFileType.toString(videoFileType.defaultObj)
    } )

    const [selectedVideos, setSelectedVideos] = useState( [] )
    
    const [renameBody, setRenameBody] = useState({
        fileName : "",
    })

    function handleVideoPathUpdate() {
        setBody( ( oldBody ) => {
            const newBody = {...oldBody};
            return newBody;
        });
        setSelectedVideos([])
    }

	function handleVideoPathChange(event) {
        setBody( ( oldBody ) => {
            const newBody = {...oldBody};
            newBody.url = event.target.value;
            return newBody;
        });
        setSelectedVideos([])
	}
    
	function handleVideoTypeChange(event, type) {
        setBody((oldBody) => {
            const newBody = {...oldBody};
			const newVideoType = videoFileType.fromString(newBody.types);
			newVideoType[type] = event.target.checked;
            newBody.types = videoFileType.toString(newVideoType);
			return newBody;
		});
	}

    function afterHandleSelect( newSelectedVideos ) {
        setRenameBody( (oldRenameBody) => {
            const newRenameBody = {...oldRenameBody}
            newRenameBody.fileName = newSelectedVideos[0];
            return newRenameBody;
        } )
    }
    
    function handleRenameChange( event ) {
        setRenameBody( (oldRenameBody) => {
            const newRenameBody = {...oldRenameBody}
            newRenameBody.fileName = event.target.value;
            return newRenameBody;
        } )
    }

    async function handleOnClickRename() {
        const params = {
            dirPath : body.url,
            oldFileName : selectedVideos[0],
            newFileName : renameBody.fileName,
        }

        const data = await renameVideo( params, {} );
        console.log( data );

        handleVideoPathUpdate();
    }
    
	const {isFetching, fetchedData: videos, error, setFetchedData: setVideos} = useFetch(fetchVideos, body, { message: [] }, []);


	return (
        <div className="flex flex-row">
            <div className="w-1/2 flex flex-col gap-2">
                <h1 className="text-2xl text-white"> Search video </h1>
                <div className="flex flex-row">
                    <input 
                        className="bg-slate-700 px-4 py-3 outline-none w-full text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800" 
                        value={body.url}
                        onChange={handleVideoPathChange} 
                    />
                </div>
                <div className="flex flex-row gap-2">
                    {videoFileType.types.map((type) => {
                        return (
                            <Checkbox text={type} id={type} key={type} checked={videoFileType.fromString(body.types)[type]} onChange={(event) => {  handleVideoTypeChange(event, type); }} />
                        );
                    })}
                </div>
                <h2 className="text-xl text-white"> Lista de videos </h2>
                { error && <div> Error: {error.message} </div>}
                { isFetching && <div> Loading... </div>}
                { ( !error && !isFetching && videos ) &&  <div> 
                    <div className="flex flex-col">
                        { videos.message.map( (fileName) => {
                            return <VideoRow fileName={fileName} key={fileName} selectedVideos={selectedVideos} setSelectedVideos={setSelectedVideos} afterHandleSelect={afterHandleSelect} />
                        } ) }
                        <div className="bg-slate-600 h-0.5" ></div>
                    </div>
                </div>}
            </div>
            <div className="w-1/2 m-2 flex flex-col gap-2">
                <div className="text-2xl text-white"> { body.url+"\\"+selectedVideos[0] } </div>
                <DisplayVideo className="w-full" url={body.url+"\\"+selectedVideos[0] } />
                { ( selectedVideos.length < 2 ) && <>
                <div className="flex flex-row gap-2 h-10 justify-between">
                    <select className="bg-slate-700 px-4 w-1/4 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800" >
                        <option> plainText </option>
                        <option> League Of Legends </option>
                    </select>
                    <button 
                        className="bg-blue-900 px-4 focus:border-blue-700 border-blue-800 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid "
                        onClick={handleOnClickRename}
                    > Cambiar Nombre </button>
                </div>
                <input 
                    className="bg-slate-700 px-4 w-full h-10 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800" 
                    value={renameBody.fileName} 
                    onChange={handleRenameChange}
                />
                </> }
            </div>
        </div>
	);
}