'use client'

import { useFetch } from "@/hooks/useFetch"
import { fetchVideos, renameVideo } from "@/http/video";
import { videoFileType } from "@/lib/utils/videoFileType";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import React from 'react';
import DisplayVideo from "./DisplayVideo";
import Checkbox from "@/components/Forms/Checkbox";
import VideoRow from "./VideoRow";
import DisplayName from "./DisplayName";
import { fromFileNamePath, nameFormatList, toFileNamePath } from "@/nameFormats/main";
import { types } from "@/nameFormats/fields";
import { OptionContext } from "@/store/option-context";

export default function FileSearch() {

    const { mainFolder } = useContext( OptionContext );

    const [body, setBody] = useState( { 
        url: mainFolder,
        types: videoFileType.toString(videoFileType.defaultObj)
    } )

    useEffect(() => {
        setBody( ( oldBody ) => {
            const newBody = {...oldBody};
            newBody.url = mainFolder;
            return newBody;
        });
    }, [mainFolder, setBody])

    const [selectedVideos, setSelectedVideos] = useState( [] )

    const [displayNameBody, setDisplayNameBody] = useState( {
        fileName : "",
        values: [],
        selectedFormat : nameFormatList[0]
    })

    const [oldVideosHeight, setOldVideosHeight] = useState("h-0")
    
    const fileNameFormatted = selectedVideos.length > 0 ? fromFileNamePath( selectedVideos[0] ) : "";

    function handleVideoPathUpdate() {
        setBody( ( oldBody ) => {
            const newBody = {...oldBody};
            return newBody;
        });
        setSelectedVideos([])
    }
    
    function afterHandleSelect( newSelectedVideos ) {
        setDisplayNameBody( oldDisplayNameBody => {
            const newDisplayNameBody = {...oldDisplayNameBody};
            newDisplayNameBody.fileName = newSelectedVideos[0];
            return newDisplayNameBody;
        }  );
        handleSelectFormat( nameFormatList[0].name )
    }

    async function handleOnClickRename() {
        const params = {
            dirPath : body.url,
            oldFileName : selectedVideos[0],
            newFileName : displayNameBody.fileName,
            formatName : displayNameBody.selectedFormat.name,
        }

        const data = await renameVideo( params, {} );

        handleVideoPathUpdate();
    }

    function handleSelectFormat( formatName ) {
		const format = nameFormatList.find((format) => format.name == formatName );

        const valueArray = new Array(format.fields.length);
		format.fields.forEach((field, index) => {
			if (field.type == types.text) {
				valueArray[index] = field.default ? field.default : "";
			} else if (field.type == types.number) {
				valueArray[index] = field.default ? field.default : 0;
			} else if (field.type == types.select) {
				valueArray[index] = field.default ? field.options[field.default] : field.options[0];
			} else if (field.type == types.block) {
				valueArray[index] = field.char;
			} else if (field.type == types.createDate) {
				valueArray[index] = obtainVideoCreateDate();
			} else if (field.type == types.count) {
				valueArray[index] = obtainFormatCount( format );
			}
		});

        setDisplayNameBody( oldDisplayNameBody => {
            const newDisplayNameBody = {...oldDisplayNameBody};
            newDisplayNameBody.selectedFormat = format;
            newDisplayNameBody.values = valueArray;
            
            return newDisplayNameBody;
        }  );
	}

    function obtainVideoCreateDate() {
        if ( selectedVideos && selectedVideos.length == 1 ) {
            const dateLength = selectedVideos[0].indexOf("(") != -1 ? selectedVideos[0].indexOf(")") + 1 : 8;
            return selectedVideos[0].substring(0, dateLength);
        }
        return "";
    }

	function obtainFormatCount( format ) {

        const actualFormat = format ? format : displayNameBody.selectedFormat;
		const counter = formatCount[actualFormat.name] ? formatCount[actualFormat.name] + 1 : 1;

		return counter;
    }

    
	const {isFetching, fetchedData: videos, error, setFetchedData: setVideos} = useFetch(fetchVideos, body, { message: [] }, []);

    const videoNames = videos.message.videos ? videos.message.videos : [];
    const oldVideoNames = videos.message.oldVideos ? videos.message.oldVideos : [];
    const formatCount = {}

    oldVideoNames.forEach( ( oldVideoName ) => {
        const formatIndex = oldVideoName.indexOf("■") + 1
        if ( formatIndex != 0 ) {
            let format = oldVideoName.substr( formatIndex, oldVideoName.length - ( formatIndex - 1 ) );
            formatCount[format] = !formatCount[format] ? 1 : formatCount[format] + 1;
        }
    });

	return (
        <div className="flex flex-row">
            <div className="w-1/2 flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                    <h2 className="text-xl text-white"> Lista de videos </h2>
                    <p className="text-xl text-stone-200">{ videoNames.length }</p>
                </div>
                { error && <div> Error: {error.message} </div>}
                { isFetching && <div> Loading... </div>}
                <div className="flex flex-col w-full gap-2">
                    <button 
                        onClick={() => {  setOldVideosHeight( oldVideosHeight == "h-0" ? "h-50" : "h-0" ) }}
                        className="bg-blue-900 px-4 focus:border-blue-700 border-blue-800 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid "
					> 
                        Mostrar Videos Antiguos 
                    </button>
                    <div className={`flex flex-col w-full overflow-y-scroll ${oldVideosHeight}`}>
                        { oldVideoNames.map( (fileName) => {
                            const formatIndex = fileName.indexOf("■");
                            fileName = fileName.substr( 0, formatIndex == -1 ? fileName.length : formatIndex )
                            if ( videoNames.includes( toFileNamePath(fileName) ) ) {
                                return;
                            }
                            return <div key={fileName} > {fileName} </div>
                        } ) }
                    </div>
                </div>
                { ( !error && !isFetching && videos ) &&  <div> 
                    <div className="flex flex-col">
                        { videoNames.map( (fileName) => {
                            return <VideoRow fileName={fileName} key={fileName} selectedVideos={selectedVideos} setSelectedVideos={setSelectedVideos} afterHandleSelect={afterHandleSelect} />
                        } ) }
                        <div className="bg-slate-600 h-0.5" ></div>
                    </div>
                </div>}
            </div>
            { selectedVideos.length > 0 &&
                <div className="w-1/2 m-2 flex flex-col gap-2">
                    <div className="text-2xl text-white"> { body.url+"\\"+fileNameFormatted } </div>
                    <DisplayVideo className="w-full" url={body.url+"\\"+selectedVideos[0] } />
                    <DisplayName displayNameBody={displayNameBody} setDisplayNameBody={setDisplayNameBody} handleOnClickRename={handleOnClickRename} handleSelectFormat={handleSelectFormat} selectedVideos={selectedVideos} obtainFormatCount={obtainFormatCount}/>
                </div>
            }
        </div>
	);
}