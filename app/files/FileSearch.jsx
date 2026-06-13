'use client'

import { useFetch } from "@/hooks/useFetch";
import { fetchInfoVideos, fetchMergeVideos, fetchVideos, renameVideo } from "@/http/video";
import { videoFileType } from "@/lib/utils/videoFileType";
import { useContext, useEffect, useState } from "react";
import VideoRow from "./VideoRow";
import { fromFileNamePath, nameFormatList, toFileNamePath } from "@/nameFormats/main";
import { types } from "@/nameFormats/fields";
import { OptionContext } from "@/store/option-context";
import { decodeBase62 } from "@/util/base62";
import VideoInfoPanel from "./VideoInfoPanel";

export default function FileSearch() {

    const { mainFolder, formattedFolder, uploadFolder } = useContext( OptionContext );

    const [body, setBody] = useState( { 
        url: mainFolder,
        types: videoFileType.toString(videoFileType.defaultObj)
    } )

    useEffect(() => {
        setBody( ( oldBody ) => {
            const newBody = {...oldBody};
            newBody.url = mainFolder;
            newBody.formattedUrl = formattedFolder;
            newBody.uploadUrl = uploadFolder;
            return newBody;
        });
    }, [mainFolder, formattedFolder, uploadFolder, setBody])

    const [selectedVideos, setSelectedVideos] = useState( [] )
    const [displayNameBody, setDisplayNameBody] = useState( {
        fileName : "",
        values: [],
        selectedFormat : nameFormatList[0]
    })


    const [oldVideosHeight, setOldVideosHeight] = useState("h-0")
    
    function afterHandleSelect( newSelectedVideos ) {
        setDisplayNameBody( oldDisplayNameBody => {
            const newDisplayNameBody = {...oldDisplayNameBody};
            if ( newSelectedVideos[0] ) {
                newDisplayNameBody.fileName = newSelectedVideos[0];
                newDisplayNameBody.selectedFormat = nameFormatList.find( format => format.name == oldVideoObj[ fromFileNamePath(newSelectedVideos[0]) ]?.formatName ) ;
            }
            return newDisplayNameBody;
        }  );


        let videoFormatted
        if ( newSelectedVideos.length > 0 ) {
            videoFormatted = getVideFormatted( newSelectedVideos[0] );
            videoFormatted = ( videoFormatted && videoFormatted.format != "" ) ? videoFormatted : false;
        }
        
        if ( videoFormatted ) {
            handleSelectFormat( videoFormatted.format )
        }else{
            handleSelectFormat( nameFormatList[0].name  )
        } 
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
	const {mergeFetching, fetchedData: mergeFiles, mergeError, setFetchedData: setMergeVideos } = useFetch(fetchMergeVideos, null, { message: [] }, []);
    const isResponseValid = videos.message.length != 0 && videos.message.videos != null;

    const [infoBody, setInfoBody] = useState( { 
        mainVideos : [],
        uploadVideos: [],
        mainFolder : mainFolder,
        uploadFolder : uploadFolder
    } )
    
    const videoNames = videos.message.videos ? videos.message.videos : [];
    const oldVideoNames = videos.message.oldVideos ? videos.message.oldVideos : [];
    const videosUpload = videos.message.uploadVideos ? videos.message.uploadVideos : [];
    const videosFormatted = videos.message.videosFormatted ? videos.message.videosFormatted : [];
    const videosCompressed = videos.message.videosCompressed ? videos.message.videosCompressed : [];
    const comVideos = videos.message.comVideos ? videos.message.comVideos : [];
    const mergeVideos = mergeFiles ? mergeFiles.message.mergeFiles :  {};

    const formatCount = {}
    const oldVideoObj = {}
    oldVideoNames.forEach( file => {
        let [ fileName, formatName ] = file.split("■");
        formatCount[formatName]= !formatCount[formatName] ? 1 : formatCount[formatName] + 1
        oldVideoObj[ fromFileNamePath(fileName) ] = { formatName };
    })

    function getVideFormatted( fileName ) {
        const videoName = fileName.substr(0, fileName.lastIndexOf(".") );                            
        const id = videoName.indexOf("›") == -1 ? null : decodeBase62( videoName.substr( videoName.indexOf("›") + 1 ) );
        let result = null;
        if ( id != null )  {
            result = getVideFormattedById( id );
        }
        return result;
    }

    function getVideFormattedById( id ) {
        let result = null;
        videosFormatted.forEach( videoFormatted => {
            if ( videoFormatted.id == id ) {
                result = videoFormatted;
                return;
            }
        } )
        return result;
    }

    useEffect(() => {
        setInfoBody( (oldBody) =>  {
            const newBody = {...oldBody};
            newBody.mainVideos = videos.message.videos ? videos.message.videos : [];
            newBody.uploadVideos = videos.message.uploadVideos ? videos.message.uploadVideos : [];
            newBody.mainFolder = mainFolder;
            newBody.uploadFolder = uploadFolder;
            return newBody;
        } )
    }, [videos, mainFolder, uploadFolder, setInfoBody])
	const {InfoFetching, fetchedData: infoFiles, infoError, setFetchedData: setInfoVideos } = useFetch(fetchInfoVideos, infoBody, { message: [] }, []);

    return (
        <div className="flex flex-row">
            <div className="w-1/2 flex flex-col gap-2 pt-6">
                <div className="flex flex-row justify-between">
                    <h2 className="text-xl text-white"> Lista de videos </h2>
                    <p className="text-xl text-stone-200">{ videoNames.length }</p>
                </div>
                { !isResponseValid && error && <div> Error: {error.message} </div>}
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
                            if ( oldVideoObj[fileName] ) {
                                return;
                            }
                            return <div key={fileName} > {fileName} </div>
                        } ) }
                    </div>
                </div>
                { ( !isFetching && isResponseValid ) &&  <div> 
                    <div className="flex flex-col">
                        { [...videosUpload, ...videoNames].map( (fileName) => {

                            const videoName = fileName.substr(0, fileName.lastIndexOf(".") );                            
                            const id = videoName.indexOf("›") == -1 ? null : decodeBase62( videoName.substr( videoName.indexOf("›") + 1 ) );

                            const formatted = videosFormatted.findIndex( row => row.id == id ) != -1;;
                            const compressed = videosCompressed.findIndex( row => row.indexOf( videoName ) != -1 ) != -1;
                            const toUpload = videosUpload.findIndex( row => row.indexOf( videoName ) != -1 ) != -1;
                            const com = comVideos.findIndex( row => row.indexOf( videoName ) != -1 ) != -1;
                            const merge = mergeVideos[id] != null;

                            return <VideoRow 
                                fileName={fileName} 
                                key={fileName} 
                                selectedVideos={selectedVideos} 
                                setSelectedVideos={setSelectedVideos} 
                                afterHandleSelect={afterHandleSelect}
                                infoFiles={infoFiles}
                                formatted={formatted}
                                compressed={compressed}
                                toUpload={toUpload}
                                com={com}
                                merge={merge}
                            />
                        } ) }
                        <div className="bg-slate-600 h-0.5" ></div>
                    </div>
                </div>}
            </div>
            <VideoInfoPanel
                setBody={setBody}
                setSelectedVideos={setSelectedVideos}
                displayNameBody={displayNameBody}
                setDisplayNameBody={setDisplayNameBody}
                obtainFormatCount={obtainFormatCount}
                handleSelectFormat={handleSelectFormat}
                selectedVideos={selectedVideos}
                videosFormatted={videosFormatted}
                videosCompressed={videosCompressed}
                videosUpload={videosUpload}
                comVideos={comVideos}
                mergeVideos={mergeVideos}
                infoFiles={infoFiles}
                getVideFormattedById={getVideFormattedById}
            />
        </div>
	);
}