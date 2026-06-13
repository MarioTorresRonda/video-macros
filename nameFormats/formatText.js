
import { types } from '@/nameFormats/fields';

export function formatThumbnailObject( format, videoFormattedList, isCom ) {
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

        thumbnailObj.text1 = formatThumbnailText( thumbnailObj.text1, fieldList, format, isCom )
        thumbnailObj.text2 = formatThumbnailText( thumbnailObj.text2, fieldList, format, isCom )
        thumbnailObj.text3 = formatThumbnailText( thumbnailObj.text3, fieldList, format, isCom )
        thumbnailObj.text4 = formatThumbnailText( thumbnailObj.text4, fieldList, format, isCom )

        return thumbnailObj;
    }catch(e) {
        return errorThumbnail( thumbnailObj, e )
    }
}

export function formatThumbnailText( text, fieldList, format, isCom ) {

    const countIndex = format.fields.findIndex( field => field.type == types.count )
    text = Object.hasOwn( text, "count" ) ? count( fieldList, countIndex ) : text;
    text = Object.hasOwn( text, "comF" ) ? ( isCom ? text.comT : text.comF )  : text;
    return text;
}

export function count( fieldsList, index ) {
    const minCount = minValue( fieldsList, index );
    const maxCount = maxValue( fieldsList, index )

    return minCount != maxCount ? `#${minCount}-${maxCount}` : `#${minCount}`;
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
    thumbnailObj.text1 = error;
    thumbnailObj.text2 = "";
    thumbnailObj.text3 = "";
    thumbnailObj.text4 = "";
}
