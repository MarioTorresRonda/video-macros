import Block from "@/nameFormats/components/Block";
import Count from "@/nameFormats/components/Count";
import Number from "@/nameFormats/components/Number";
import Select from "@/nameFormats/components/Select";
import Text from "@/nameFormats/components/Text";
import { types } from "@/nameFormats/fields";
import { nameFormatList, toFileNamePath } from "@/nameFormats/main";
import { useCallback, useEffect } from "react";

export default function DisplayName( { displayNameBody, setDisplayNameBody, selectedVideos, handleOnClickRename, handleSelectFormat, obtainFormatCount } ) {

    console.log( displayNameBody.values )

	function onHandleFieldChange(event, index) {
        setDisplayNameBody( oldDisplayNameBody => {
            const newDisplayNameBody = {...oldDisplayNameBody};
            const newValues = [...newDisplayNameBody.values];
			newValues[index] = event.target.value;
			newDisplayNameBody.values =  newValues;
            return newDisplayNameBody;
        }  );
	}

	const obtainVideoType = useCallback(() => {
		if (selectedVideos[0]) {
			const dir = selectedVideos[0];
			const fileTypeIndex = dir.lastIndexOf(".");
			return dir.substring(fileTypeIndex, dir.length);
		}
	}, [selectedVideos]);

	const onUpdateFileName = useCallback(() => {
        setDisplayNameBody( oldDisplayNameBody => {
            const newDisplayNameBody = {...oldDisplayNameBody};
            newDisplayNameBody.fileName = toFileNamePath(displayNameBody.values.join("")) + obtainVideoType();
            return newDisplayNameBody;
        }  );
	}, [setDisplayNameBody, displayNameBody.values, obtainVideoType]);

	useEffect(() => {
		onUpdateFileName();
	}, [onUpdateFileName]);

	if (selectedVideos.length > 1) {
		return <></>;
	}

	return (
		<>
			<div className="flex flex-row gap-2 h-10 justify-between">
				<select
					className="bg-slate-700 px-4 w-1/4 outline-none text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-slate-400 border-slate-800"
					value={displayNameBody.selectedFormat.name}
					onChange={(e) => { handleSelectFormat( e.target.value )  } }
				>
					{nameFormatList.map((format) => {
						return (
							<option value={format.name} key={format.name}>
								{" "}
								{format.name}{" "}
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
			</div>
			<div className="flex flex-row">
				{displayNameBody.selectedFormat.fields.map((field, index) => {

                    const key = displayNameBody.selectedFormat.name;
                    const value = displayNameBody.values[index];

					if (field.type == types.text) {
						return (
							<Text
								value={value}
								onChange={(e) => {
									onHandleFieldChange(e, index);
								}}
								length={field.length}
								width={field.width}
								key={key + index}
							/>
						);
					} else if (field.type == types.number) {
						return (
							<Number
								value={value}
								onChange={(e) => {
									onHandleFieldChange(e, index);
								}}
								width={field.width}
								key={key + index}
							/>
						);
					} else if (field.type == types.select) {
						return (
							<Select
								value={value}
								onChange={(e) => {
									onHandleFieldChange(e, index);
								}}
								options={field.options}
								width={field.width}
								key={key + index}
							/>
						);
					} else if (field.type == types.block) {
						return <Block char={field.char} key={key + index} width={field.width} />;
					} else if (field.type == types.count) {
						return (
							<Count count={obtainFormatCount(displayNameBody.selectedFormat)} key={key + index} width={field.width} />
						);
					}
				})}
			</div>
		</>
	);
}
