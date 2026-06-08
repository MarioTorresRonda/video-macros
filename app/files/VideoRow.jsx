import Checkbox from "@/components/Commons/Checkbox";
import { fromFileNamePath, toYoutubeName } from "@/nameFormats/main";
import { faIdCard } from "@fortawesome/free-regular-svg-icons";
import { faBook, faBullhorn, faCompress, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function VideoRow( { fileName, selectedVideos, setSelectedVideos, afterHandleSelect, infoFiles, formatted, compressed, toUpload, com, merge } ) {

    function onHandleSelectVideo( event ) {
        setSelectedVideos( ( oldSelectedVideos ) => {
            let newSelectedVideos; 
            if ( event.target.checked ) {
                newSelectedVideos = [...oldSelectedVideos, fileName ];
            }else{
                newSelectedVideos = oldSelectedVideos.filter( ( videoName ) => videoName != fileName )
            }
            afterHandleSelect( newSelectedVideos );
            return newSelectedVideos;
        } )
    }

    let checked = false;
    selectedVideos.forEach( (videoName) =>  { 
        if ( videoName == fileName ) {  
            checked = true; 
            return;
        } 
    } );

    if ( infoFiles )  {
        console.log(  )
    }

    return <div className=" h-9 flex flex-col justify-center">
        <div className="bg-slate-600 h-0.5" ></div>
        <div className={`flex flex-row gap-3 flex-1 ml-3 ${ merge ? "bg-gray-700" : ""  }`}>
            <Checkbox id={fileName+"_S"} text="" checked={checked} onChange={onHandleSelectVideo} />
            <div className="flex flex-row gap-1 justify-between flex-1">
                <div key={fileName} className="text-white self-center overflow-hidden flex-1"> { toYoutubeName( fileName ) } </div>
                { infoFiles && infoFiles[fileName] && <div className="text-white self-center overflow-hidden"> { ( Math.round( ( infoFiles[fileName].size / 1073741824 ) * 10 ) / 10 ) * (com ? 2 : 1 ) }GB </div> }
                { merge && <div className="w-4 text-white self-center overflow-hidden"> <FontAwesomeIcon icon={faBook} /> </div> }
                { formatted && <div className="w-4 text-white self-center overflow-hidden"> <FontAwesomeIcon icon={faIdCard} /> </div> }
                { compressed && <div className="w-4 text-white self-center overflow-hidden"> <FontAwesomeIcon icon={faCompress} /> </div> }
                { toUpload && <div className="w-4 text-white self-center overflow-hidden"> <FontAwesomeIcon icon={faUpload} /> </div> }
                { com && <div className="w-4 text-white self-center overflow-hidden"> <FontAwesomeIcon icon={faBullhorn} /> </div> }
            </div>
            
        </div>
    </div>
}