import React, { useContext, useState } from 'react';
import DisplayVideo from "./leftPanel/DisplayVideo";
import DisplayName from "./leftPanel/DisplayName";
import PrettyButton from "@/components/Commons/PrettyButton";
import CompressButton from "./buttons/CompressButton";
import MoveUploadButton from "./buttons/MoveUploadButton";
import MergeButton from "./buttons/MergeButton";
import ComButton from "./buttons/ComButton";
import DeleteButton from "./buttons/DeleteButton";
import SetIDButton from "./buttons/SetIDButton";
import { fromFileNamePath, toYoutubeName } from '@/nameFormats/main';
import { OptionContext } from '@/store/option-context';
import { decodeBase62 } from '@/util/base62';
import { durationToTime } from '@/util/time';

export default function VideoInfoPanel( { setBody, setSelectedVideos, displayNameBody, setDisplayNameBody, handleSelectFormat, obtainFormatCount, selectedVideos, videosFormatted, videosCompressed, videosUpload, comVideos, mergeVideos, infoFiles } ) {


    const { mainFolder, formattedFolder, uploadFolder } = useContext( OptionContext );

    const [fileNameType, setFileNameType] = useState(false)
    
    //States of the video
    const formatted = ArrayContainsElements( { mainArray : selectedVideos, searchArray: videosFormatted, mainMod : removeFileType, searchMod : (searchElement) => removeFileType( searchElement.fullName ) }  );
    const compressed = ArrayContainsElements( { mainArray : selectedVideos, searchArray: videosCompressed, mainMod : removeFileType, searchMod : removeFileType}  );
    const toUpload = selectedVideos.findIndex( row => { const rowN = row.split(".")[0]; return videosUpload.findIndex( rowF => rowF.indexOf( rowN ) != -1 ) != -1 } ) != -1;
    const com = selectedVideos.findIndex( row => { const rowN = row.split(".")[0]; return comVideos.findIndex( rowF => rowF.indexOf( rowN ) != -1 ) != -1 } ) != -1;
    
    const fileNameFormatted = selectedVideos.length > 0 ? fromFileNamePath( selectedVideos[0] ) : "";
    
    const fileName = selectedVideos[0] ? selectedVideos[0] : "";
    const videoName = fileName.substr(0, fileName.lastIndexOf(".") );                            
    const id = videoName.indexOf("›") == -1 ? null : decodeBase62( videoName.substr( videoName.indexOf("›") + 1 ) );
    const videoMerge =mergeVideos != null && Object.keys(mergeVideos).length > 0 && id != null ? mergeVideos[id] : null;

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

    let duration = 0

    return <>
        { selectedVideos.length > 0 &&
            <div className="w-1/2 fixed top-0 right-0">
                <div className="m-2 flex flex-col gap-2 ">
                    <div className="text-2xl text-white flex flex-row justify-between"> 
                        { fileNameType ? selectedVideos[0] : fileNameFormatted }
                        <PrettyButton 
                            onClick={() => { setFileNameType( !fileNameType ) }}
                        >
                            {fileNameType ? "URL" : "FORMAT"}
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
                    { videoMerge != null && <> 
                        <div className="flex flex-col gap-1 rounded-md text-white text-xl">
                            { videoMerge.map( (video) => {
                                const videoDuration = infoFiles && infoFiles[video.fullName] ? infoFiles[video.fullName].duration : 0
                                const startTime = durationToTime( duration )
                                duration += parseFloat( videoDuration );
                                return <p key={video.videoID } > { startTime } - { toYoutubeName( video.fullName ) } </p>
                            } ) } 
                        </div>
                    </>  }
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2 min-h-10 justify-start">
                            {  videoMerge == null && <> 
                                <SetIDButton selectedVideos={selectedVideos} formatted={formatted} toUpload={toUpload} com={com} handleVideoPathUpdate={handleVideoPathUpdate} />
                                <CompressButton selectedVideos={selectedVideos} compressed={compressed} handleVideoPathUpdate={handleVideoPathUpdate} />
                                <MoveUploadButton selectedVideos={selectedVideos} toUpload={toUpload} handleVideoPathUpdate={handleVideoPathUpdate} />
                                <ComButton selectedVideos={selectedVideos} toUpload={toUpload} com={com} handleVideoPathUpdate={handleVideoPathUpdate} />
                            </>  }
                            <DeleteButton selectedVideos={selectedVideos} toUpload={toUpload} com={com} handleVideoPathUpdate={handleVideoPathUpdate} />
                        </div>
                        <div className="flex flex-row gap-2 h-10 justify-start">
                            { selectedVideos.length > 1 && <MergeButton selectedVideos={selectedVideos} toUpload={toUpload} /> }
                        </div>
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