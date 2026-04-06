
import { nameFormatList, toFileNamePath } from "@/nameFormats/main";
import { useCallback, useEffect } from "react";
import DisplayNameArray from "./DisplayNameArray";
import DisplayNameResult from "./DisplayNameResult";

export default function DisplayName( { displayNameBody, setDisplayNameBody, selectedVideos, handleOnClickRename, handleSelectFormat, obtainFormatCount, toUpload } ) {

	function obtainType( fileName ) {
		const splitFileName = fileName.split(".");
		return `.${splitFileName[ splitFileName.length - 1 ]}`;
	}

	function onHandleFieldChange(event, index) {
        setDisplayNameBody( oldDisplayNameBody => {
            const newDisplayNameBody = {...oldDisplayNameBody};
            const newValues = [...newDisplayNameBody.values];
			newValues[index] = event.target.value;
			newDisplayNameBody.values =  newValues;
			newDisplayNameBody.fileName = newValues.join("") + obtainType( newDisplayNameBody.fileName )
            return newDisplayNameBody;
        }  );
	}

	console.log( displayNameBody );

	if (selectedVideos.length > 1) {
		return <>
			{ toUpload && <div className="flex flex-col max-h-40 overflow-y-auto gap-2">
				{ selectedVideos.map( video => {
					return <DisplayNameResult key={video} displayNameBody={{ fileName : video }}/>
				} ) }
			</div>  }
		</>;
	}

	return (
		<>
			{ !toUpload && <div className="flex flex-row gap-2 h-10 justify-between">
				<select
					className="bg-slate-700 px-4 w-1/4 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
					value={displayNameBody.selectedFormat.name}
					onChange={(e) => { handleSelectFormat( e.target.value )  } }
				>
					{ nameFormatList.map((format) => {
						return (
							<option value={format.name} key={format.name}>
								{format.name}
							</option>
						);
					})}
				</select>
				<button
					className="bg-blue-900 px-4 focus:border-blue-700 border-blue-800 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid "
					onClick={handleOnClickRename}
				>
					Cambiar Nombre
				</button>
			</div> }
			<div className="flex flex-row">
				{!toUpload && <DisplayNameArray displayNameBody={displayNameBody} obtainFormatCount={obtainFormatCount} onHandleFieldChange={onHandleFieldChange} /> }
				{ toUpload && <DisplayNameResult displayNameBody={displayNameBody}/>}
			</div>
		</>
	);
}
