import { types } from "./fields"

const plainText = {
    name: "PlainText",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | " },
        { type: types.text, length: 92, width: 100 }
    ]
}

const lol = {
    name: "League of Legends",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | " },
        { type: types.text, length: 3, width: 5 },
        { type: types.block, char: " | " },
        { type: types.select, options: [ "Normal", "SoloQ", "FlexQ", "ARAM", "ARAM CHAOS", "SCRIM" ], width: 15 },
        { type: types.block, char: " | " },
        { type: types.text, length: 12, width: 15 },
        { type: types.block, char: " " },
        { type: types.select, options: [ "", "Top", "Jungla", "Medio", "Tirador", "Soporte" ], width: 11 },
        { type: types.block, char: " | " },
        { type: types.select, options: [ "Victoria", "Derrota" ], width: 11 },
        { type: types.block, char: " | " },
        { type: types.number, width: 5  },
        { type: types.block, char: "/" },
        { type: types.number, width: 5  },
        { type: types.block, char: "/" },
        { type: types.number, width: 5  },
        { type: types.block, char: " | " },
        { type: types.select, options: [ "", "Hierro", "Bronce", "Plata", "Oro", "Platino", "Esmeralda", "Diamante", "Master" ], width: 14 },
        { type: types.block, char: " " },
        { type: types.select, options: [ "", "IV", "III", "II", "I" ], width: 7  },
        { type: types.block, char: " | " },
        { type: types.select, options: [ "", "Mods" ], width: 9  },
    ]
}

const videoEncoder = {
    name: "Video Encoder",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | " },
        { type: types.block, char: "Video Encoder ", width: 18 },
        { type: types.count, width: 2 },
        { type: types.block, char: " ", width: 1 },
        { type: types.select, options: [ "Bash", "Web" ], width: 15 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, width: 40 },
    ]
}

const portfolio = {
    name: "Portfolio Mario Torres",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " Portfolio ", width: 20 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, length: 70, width: 70 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " #", width: 1 },
        { type: types.count, width: 2 },
        { type: types.block, char: " | ", width: 1 },
    ]
}

const wizardWithAGun = {
    name: "Wizard with a Gun",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " Wizard with a Gun ", width: 30 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, length: 70, width: 60 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " #", width: 1 },
        { type: types.count, width: 2 },
        { type: types.block, char: " | ", width: 1 },
    ]
}

const megabonk = {
    name: "Megabonk",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: "Megabonk ", width: 30 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, length: 70, width: 57 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " #", width: 2 },
        { type: types.count, width: 4 },
        { type: types.block, char: " | ", width: 1 },
    ]
}


const brotato = {
    name: "Brotato",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: "Brotato ", width: 20 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, length: 70, width: 67 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " #", width: 2 },
        { type: types.count, width: 4 },
        { type: types.block, char: " | ", width: 1 },
    ]
}

const factorKubata = {
    name: "Factor Kubata",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " Factor Kuubata ", width: 20 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, length: 70, width: 67 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " #", width: 2 },
        { type: types.count, width: 4 },
        { type: types.block, char: " | ", width: 1 },
    ]
}

const lolDemaciaRising = {
    name: "LoL Demacia Rising",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " LoL Demacia Rising ", width: 20 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, length: 60, width: 57 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " #", width: 2 },
        { type: types.count, width: 4 },
        { type: types.block, char: " | ", width: 1 },
    ]
}

const dispatch = {
    name: "Dispatch",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " Dispatch ", width: 20 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, length: 70, width: 67 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " #", width: 2 },
        { type: types.count, width: 4 },
        { type: types.block, char: " | ", width: 1 },
    ]
}

const circuitoTormenta = {
    name: "Circuito Tormenta",
    fields: [
        { type: types.createDate, length: 8, width: 0 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.block, char: " Circuito tormenta ", width: 30 },
        { type: types.block, char: " | ", width: 1 },
        { type: types.text, length: 60, width: 57 },
        { type: types.block, char: " | ", width: 1 },
    ]
}

export const nameFormatList = [
    plainText,
    factorKubata,
    videoEncoder,
    portfolio,
    lol,
    wizardWithAGun,
    megabonk,
    brotato,
    lolDemaciaRising,
    dispatch,
    circuitoTormenta
]

export function valuesFromFormat( format, fileName ) {
    const values = [];

    let lastValueCharacterIndex = 0;
    format.fields.forEach( ( field, index ) => {
        if ( field.type == types.createDate )  {
            const value = fileName.substr( lastValueCharacterIndex, lastValueCharacterIndex + 10 );
            const length = value.indexOf("(") != -1 ? ( fileName.indexOf(")") + 1 ) : 8;
            values[index] = fileName.substr( lastValueCharacterIndex, length );
            lastValueCharacterIndex += length;
        }else if ( field.type == types.block )  {
            values[index] = fileName.substr( lastValueCharacterIndex, field.char.length )
            lastValueCharacterIndex += field.char.length;
        }else if ( field.type == types.text || field.type == types.number || field.type == types.block )  {
            const nextField = format.fields[index+1];
            if ( nextField == null ) {
                values[index] = fileName.substr( lastValueCharacterIndex, fileName.length - lastValueCharacterIndex );
            }else{
                if ( nextField.type != types.block ) {
                    alert("Estupido")
                }
                const rest = fileName.substr( lastValueCharacterIndex, fileName.length );
                const length = rest.indexOf( nextField.char ) == -1 ? fileName.length - lastValueCharacterIndex : rest.indexOf( nextField.char );
                console.log( length, lastValueCharacterIndex, fileName.substr( lastValueCharacterIndex, length ) );
                values[index] = fileName.substr( lastValueCharacterIndex, length )
                lastValueCharacterIndex += length;
            }
        }else if ( field.type == types.select ) {
            let optionMaxLength = 0; 
            let optionMaxIndex = -1;
            field.options.forEach( (option, index) => {
                const length = fileName.indexOf( option );
                if ( length != -1 && length > optionMaxLength ) {
                    optionMaxLength = length;
                    optionMaxIndex = index;
                }
            } )

            if ( optionMaxIndex != -1 ) {                
                const option = field.options[optionMaxIndex];
                values[index] = fileName.substr( lastValueCharacterIndex, option.length )
                lastValueCharacterIndex += option.length;
            }else{
                values[index] = fileName.substr( lastValueCharacterIndex, fileName.length - lastValueCharacterIndex )
                lastValueCharacterIndex += fileName.length - lastValueCharacterIndex;
            }

        }
    });

    return values;
}




export function toFileNamePath( fileName ) {
    fileName = fileName.replaceAll(" ", "_").replaceAll("|", "║").replaceAll("<", "≤").replaceAll(">", "≥").replaceAll(":", "░")
    fileName = fileName.replaceAll("\"", "▀").replaceAll("/", "⌠").replaceAll("\\", "⌡").replaceAll("?", "¿").replaceAll("*", "■")
    return fileName;
}

export function fromFileNamePath( fileName ) {
    fileName = fileName.replaceAll("_", " ").replaceAll("║", "|").replaceAll("≤", "<").replaceAll("≥", ">").replaceAll("░", ":")
    fileName = fileName.replaceAll("▀", "\"").replaceAll("⌠", "/").replaceAll("⌡", "\\").replaceAll("¿", "?").replaceAll("■", "*")
    return fileName;
}

