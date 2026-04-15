import PrettyButton from "@/components/Commons/PrettyButton";
import {  mergeVideo } from "@/http/video";
import Text from "@/nameFormats/components/Text";
import { toFileNamePath } from "@/nameFormats/main";
import { OptionContext } from "@/store/option-context";
import { useContext, useState } from "react";

export default function MergeButton( { selectedVideos, toUpload } ) {

    const [ newFileName, setNewFileName ] = useState("")
    const { mainFolder, uploadFolder } = useContext( OptionContext );
    

    async function mergeVideos() {
        const params = {
            dirPath : mainFolder,
            newFileName: toFileNamePath(newFileName),
            uploadUrl : uploadFolder,
            files : selectedVideos,
        };

        await mergeVideo( params, {} )
    }

    return <div className="flex-1 flex flex-row gap-2">
        <Text length={100} className="flex-1" value={newFileName} onChange={ (e) => { setNewFileName(e.target.value) } }  />
        <PrettyButton
            onClick={mergeVideos}
            disabled={!toUpload}    
        >
            Unir { selectedVideos.length }
        </PrettyButton>
    </div>
}