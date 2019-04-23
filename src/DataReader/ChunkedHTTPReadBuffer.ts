import * as http from 'http';
import { IncomingMessage } from 'http';

import { IChunkedReadBuffer } from 'DataReader/ChunkedDataReader';

export default class ChunkedHTTPReadBuffer implements IChunkedReadBuffer<Uint8Array> {
    public constructor(private url: string) {

    }

    public loadChunk(start: number, end: number): Promise<Uint8Array[]> {
        return new Promise((resolve, reject) => {
            http.get(this.url, {
                headers: {
                    Range: `bytes=${start}-${end}`
                }
            }, (message: IncomingMessage) => {
                const data: Uint8Array[] = [];

                message
                    .on('data', (chunk) => {
                        data.push(chunk);
                    })
                    .on('end', () => {
                        resolve(data);
                    })
                    .on('error', () => {
                        reject();
                    });
            }).on('error', () => {
                reject();
            });
        });
    }
}
