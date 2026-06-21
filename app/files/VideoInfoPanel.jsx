import React, { useContext, useRef, useState } from 'react';
import DisplayVideo from "./leftPanel/DisplayVideo";
import DisplayName from "./leftPanel/DisplayName";
import PrettyButton from "@/components/Commons/PrettyButton";
import CompressButton from "./buttons/CompressButton";
import MoveUploadButton from "./buttons/MoveUploadButton";
import MergeButton from "./buttons/MergeButton";
import ComButton from "./buttons/ComButton";
import DeleteButton from "./buttons/DeleteButton";
import SetIDButton from "./buttons/SetIDButton";
import { fromFileNamePath, nameFormatList, toFileNamePath, toYoutubeName } from '@/nameFormats/main';
import { OptionContext } from '@/store/option-context';
import { decodeBase62 } from '@/util/base62';
import { durationToTime } from '@/util/time';
import ThumbnailGenerator from './leftPanel/ThumbnailGenerator';
import { formatThumbnailObject } from '@/nameFormats/formatText';
import VideoMergeInfo from './leftPanel/videoMergeInfo';
import { renameVideo } from '@/http/video';

export default function VideoInfoPanel( { body, setBody, setSelectedVideos, displayNameBody, setDisplayNameBody, handleSelectFormat, obtainFormatCount, selectedVideos, videosFormatted, videosCompressed, videosUpload, comVideos, mergeVideos, infoFiles, getVideFormattedById } ) {

    const { mainFolder, formattedFolder, uploadFolder } = useContext( OptionContext );
    
    const canvasRef = useRef(null);
    const [fileNameType, setFileNameType] = useState(false)
    const [COM, setCOM] = useState(false)
    
    //States of the video
    const formatted = ArrayContainsElements( { mainArray : selectedVideos, searchArray: videosFormatted, mainMod : removeFileType, searchMod : (searchElement) => removeFileType( searchElement.fullName ) }  );
    const compressed = ArrayContainsElements( { mainArray : selectedVideos, searchArray: videosCompressed, mainMod : removeFileType, searchMod : removeFileType}  );
    const toUpload = selectedVideos.findIndex( row => { const rowN = row.split(".")[0]; return videosUpload.findIndex( rowF => rowF.indexOf( rowN ) != -1 ) != -1 } ) != -1;
    const com = selectedVideos.findIndex( row => { const rowN = row.split(".")[0]; return comVideos.findIndex( rowF => rowF.indexOf( rowN ) != -1 ) != -1 } ) != -1;
    
    const fileNameFormatted = selectedVideos.length > 0 ? toYoutubeName( selectedVideos[0] ) : "";
    
    const fileName = selectedVideos[0] ? selectedVideos[0] : "";
    const videoName = fileName.substr(0, fileName.lastIndexOf(".") );                            
    const id = videoName.indexOf("›") == -1 ? null : decodeBase62( videoName.substr( videoName.indexOf("›") + 1 ) );
    const videoMerge = mergeVideos != null && Object.keys(mergeVideos).length > 0 && id != null ? mergeVideos[id] : null;

    if ( id != null && displayNameBody.id == null )  {
        setDisplayNameBody( oldDisplayNameBody => {
            const newDisplayNameBody = {...oldDisplayNameBody};
            newDisplayNameBody.values = JSON.parse( getVideFormattedById(id).fields );
            newDisplayNameBody.id = id;
            return newDisplayNameBody;
        }  );
    }

    async function handleOnClickRename() {
        const params = {
            dirPath : body.url,
            oldFileName : selectedVideos[0],
            newFileName : toFileNamePath(displayNameBody.fileName),
            formatName : displayNameBody.selectedFormat.name,
            jsonFields : JSON.stringify( displayNameBody.values )
        }

        const data = await renameVideo( params, {} );

        handleVideoPathUpdate();
    }    

    function handleVideoPathUpdate() {
        setBody( ( oldBody ) => {
            const newBody = {...oldBody};
            return newBody;
        });
        setSelectedVideos([])
    }

    const handleCopy = async ( value ) => {
        try {
            await navigator.clipboard.writeText( value );
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "react-generated-image.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    let formatThumbnailObj = {}
    if ( videoMerge && videoMerge.length > 0 != null ) {
        const videoFormattedArray = videoMerge.map( ( merge => getVideFormattedById( merge.videoID  ) ) );
        const format = nameFormatList.find( format => format.name == videoFormattedArray[0].format );
        formatThumbnailObj = {...formatThumbnailObject( format, videoFormattedArray, { isCom: COM } )};
    }

    return <>
        { selectedVideos.length > 0 &&
            <div className="w-1/2 fixed top-0 right-0 ">
                <div className="m-2 flex flex-col gap-2 overflow-y-scroll h-screen">
                    <div className='w-full flex flex-row gap-2'>
                        <div className="text-2xl text-white justify-between overflow-x-auto text-nowrap flex-1"> 
                            { fileNameType ? selectedVideos[0] : fileNameFormatted }
                        </div>
                        <PrettyButton 
                            onClick={() => { setFileNameType( !fileNameType ) }}
                            >
                            {fileNameType ? "Youtube" : "Path"}
                        </PrettyButton>
                        <PrettyButton onClick={() => handleCopy( fileNameType ? selectedVideos[0] : fileNameFormatted )}>
                            Copy Title
                        </PrettyButton>
                    </div>

                    <DisplayVideo className="w-full" url={ (toUpload ? uploadFolder : mainFolder) +"\\"+selectedVideos[0] } />
                    
                    <DisplayName 
                        toUpload={toUpload} 
                        displayNameBody={displayNameBody} 
                        setDisplayNameBody={setDisplayNameBody} 
                        handleOnClickRename={handleOnClickRename} 
                        handleSelectFormat={handleSelectFormat} 
                        selectedVideos={selectedVideos} 
                        obtainFormatCount={obtainFormatCount}
                    />
                    { videoMerge != null && <div className='flex flex-row gap-2'> 
                        <VideoMergeInfo infoFiles={infoFiles} videoMerge={videoMerge} />
                        <ThumbnailGenerator 
                            canvasRef={canvasRef}
                            formatThumbnailObj={formatThumbnailObj}
                        /> 
                    </div>  }
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2 min-h-10 justify-start">
                            { videoMerge == null && <> 
                                <SetIDButton selectedVideos={selectedVideos} formatted={formatted} toUpload={toUpload} com={com} handleVideoPathUpdate={handleVideoPathUpdate} />
                                <CompressButton selectedVideos={selectedVideos} compressed={compressed} handleVideoPathUpdate={handleVideoPathUpdate} />
                                <MoveUploadButton selectedVideos={selectedVideos} toUpload={toUpload} handleVideoPathUpdate={handleVideoPathUpdate} />
                                <ComButton selectedVideos={selectedVideos} toUpload={toUpload} com={com} handleVideoPathUpdate={handleVideoPathUpdate} />
                            </>  }
                            <DeleteButton selectedVideos={selectedVideos} toUpload={toUpload} com={com} handleVideoPathUpdate={handleVideoPathUpdate} />
                            { videoMerge != null && <>
                                <PrettyButton onClick={handleDownload}> Descargar Portada </PrettyButton> 
                                <PrettyButton onClick={() => {setCOM( !COM )}}> { COM ? "COM" : "NOT" } </PrettyButton> 
                            </>}
                        </div>
                        { selectedVideos.length > 1 && <div className="flex flex-row gap-2 h-10 justify-start">
                            <MergeButton selectedVideos={selectedVideos} toUpload={toUpload} />
                        </div> }
                    </div>
                </div>
            </div>
        }
    </>

}

function ArrayContainsElements( { mainArray, searchArray, mainMod, searchMod } ) {
    for (let i = 0; i < mainArray.length; i++) {
        const mainElement = mainMod ? mainMod( mainArray[i] ) : mainArray[i];
        for (let j = 0; j < searchArray.length; j++) {
        const searchElement = searchMod ? searchMod( searchArray[j] ) : searchArray[j];
            if ( mainElement == searchElement ) {
                return true;
            }
        }
    }
    return false;
}

function removeFileType(element)  {
    return element.substr(0, element.lastIndexOf(".") )
}