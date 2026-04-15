import { sleep } from "@/util/time.js";

export async function initCompressService() {
    while( true ) {
        await sleep( 1000 );
        console.log("Servidor iniciado, esperando a archivos...")
    }
} 