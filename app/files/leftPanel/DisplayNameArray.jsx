import Block from "@/nameFormats/components/Block";
import Count from "@/nameFormats/components/Count";
import Number from "@/nameFormats/components/Number";
import Select from "@/nameFormats/components/Select";
import Text from "@/nameFormats/components/Text";
import {types} from "@/nameFormats/fields";

export default function DisplayNameArray({displayNameBody, onHandleFieldChange, obtainFormatCount}) {
	return (
		<>
			{displayNameBody.selectedFormat.fields.map((field, index) => {
				const props = {
					value: displayNameBody.values[index],
					onChange: (e) => {
						onHandleFieldChange(e, index);
					},
					count: obtainFormatCount(displayNameBody.selectedFormat),
					...field,
				};

				if (field.type == types.text) {
					return <Text key={displayNameBody.selectedFormat.name + index} {...props} />;
				} else if (field.type == types.number) {
					return <Number key={displayNameBody.selectedFormat.name + index} {...props} />;
				} else if (field.type == types.select) {
					return <Select key={displayNameBody.selectedFormat.name + index} {...props} />;
				} else if (field.type == types.block) {
					return <Block key={displayNameBody.selectedFormat.name + index} {...props} />;
				} else if (field.type == types.count) {
					return <Count key={displayNameBody.selectedFormat.name + index} {...props} />;
				}
			})}
		</>
	);
}
