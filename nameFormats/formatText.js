import { canvasTextOrientation } from '@/app/files/leftPanel/ThumbnailGenerator';
import { types } from '@/nameFormats/fields';

export function formatThumbnailObject( format, videoFormattedList, variables  ) {
    const thumbnailObj  = { ...format.thumbnail };
    try{
        const fieldList = [];
        for (let index = 0; index < videoFormattedList.length; index++) {
            const videoFormatted = videoFormattedList[index];
            if ( !videoFormatted || videoFormatted .fields == "" )   {
                throw new Error("VideoFormatted null or without fields")
            }
            fieldList.push( JSON.parse( videoFormatted.fields ) )
        }

        for (let index = 0; index < thumbnailObj.texts.length; index++) {
            if ( thumbnailObj.texts[index].id == undefined ) {   
                thumbnailObj.texts[index] = formatThumbnailText( thumbnailObj.texts[index], fieldList, format, variables );   
            }
        }

        fieldList.forEach( ( field, i ) => {

            const rowPosition = 1920 / fieldList.length * i + ( 1920 / fieldList.length * 0.5);
            for (let j = 0; j < thumbnailObj.videoTexts.length; j++) {
                const text = formatThumbnailText( thumbnailObj.videoTexts[j], [ field ], format, variables );
                text.id = j + ( i * thumbnailObj.videoTexts.length );
                text.location.x = rowPosition + ( text.location.offsetX ? text.location.offsetX : 0 );
                const textIndex = thumbnailObj.texts.findIndex( oldText => oldText.id == text.id ); 
                if ( textIndex != -1 )  {
                    thumbnailObj.texts[textIndex]  = text;
                }else{
                    thumbnailObj.texts.push(text);
                }
            }
        } )

        thumbnailObj.texts = [...thumbnailObj.texts]

        return thumbnailObj;
    }catch(e) {
        return errorThumbnail( thumbnailObj, e )
    }
}

export function formatThumbnailText( text, fieldList, format, variables ) {
    switch (text.type) {
        case thumbnailCanvasTypes.text:
            text.value = text.text;
            break;
        case thumbnailCanvasTypes.condition:
            text.value = variables[text.condition] ? text.text1 : text.text2;
            break;
        case thumbnailCanvasTypes.count:
            text.value = count( fieldList, text.index );
            break;
        case thumbnailCanvasTypes.fieldText:
            text.value = textArray( fieldList, text.indexArray );
            break;
        case thumbnailCanvasTypes.fieldImage:
            text.image = imageURL( fieldList, text.url, text.index );
            break;
        default:
            return { location: { x: 1920/2, y:1080/2, orientation: canvasTextOrientation.centerMiddle }, value: "error formatting text " + JSON.stringify( text ) };
    }

    return JSON.parse( JSON.stringify( text ) );

}

export function count( fieldsList, index ) {
    const minCount = minValue( fieldsList, index );
    const maxCount = maxValue( fieldsList, index )

    return minCount != maxCount ? `#${minCount}-${maxCount}` : `#${minCount}`;
}

export function textArray( fieldsList, indexArray ) {
    const value = indexArray.map( (index) => fieldsList[0][index] ).join("")
    return value ? value : " ";
}

export function imageURL( fieldsList, url, index ) {
    return url.replace("@1", fieldsList[0][index]);
}

export function minValue( fieldsList, index ) {
    let min = Number.POSITIVE_INFINITY;
    fieldsList.forEach(fields => {
        min = min > fields[index] ? fields[index] : min;
    });
    return min;
}

export function maxValue( fieldsList, index ) {
    let max = Number.NEGATIVE_INFINITY;
    fieldsList.forEach(fields => {
        max = max < fields[index] ? fields[index] : max;
    });
    return max;
}

export function errorThumbnail( thumbnailObj, error ) {
    thumbnailObj.texts =  [ { location: { x: 1920/2, y:1080/2, orientation: canvasTextOrientation.centerMiddle }, value: error, size : 120 } ]
    return thumbnailObj;
}

export const thumbnailCanvasTypes =  {
    text : "text",
    condition: "condition",
    count: "count",
    fieldText: "fieldText",
    fieldImage: "fieldImage"
}

export function canvasSimpleText( location, text, size ) {
    return { type: thumbnailCanvasTypes.text, location, text, size }
}

export function canvasConditionText( location, condition, text1, text2, size ) {
    return { type: thumbnailCanvasTypes.condition, location, condition, text1, text2, size }
}

export function canvasCountText( location, index, size ) {
    return { type: thumbnailCanvasTypes.count, location, index, size }
}

export function canvasFieldsText( location, indexArray, size ) {
    return { type: thumbnailCanvasTypes.fieldText, location, indexArray, size }
}

export function canvasFieldsImage( location, url, index, size ) {
    return { type: thumbnailCanvasTypes.fieldImage, location, url, index, size }
}

