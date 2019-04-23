
export interface IChunkedReadBuffer<T> {
    loadChunk(start: number, end: number): Promise<T[]>;
}

export default class ChunkedDataReader {
    public constructor(private chunkProvider: IChunkedReadBuffer<Uint8Array>) {
    }

    public async serial(chunkSize: number, numberOfChunks: number): Promise<Buffer> {
        // Create a list of valid chunks.
        const chunkList = await Array
            .from({ length: numberOfChunks })
            .reduce(async (task: Promise<Uint8Array[]>, _, i) => {
                const current = await task;
                const next = await this.chunkProvider.loadChunk(i * chunkSize, (i * chunkSize) + chunkSize - 1);
                return current.concat(next);
            }, Promise.resolve([])) as Uint8Array[];

        // Concat and return.
        return Buffer.concat(chunkList);
    }

    public async parallel(chunkSize: number, numberOfChunks: number): Promise<Buffer> {
        // Create a list of promises returning a valid chunk.
        const chunkPromiseList = Array
            .from({ length: numberOfChunks })
            .map((_, i) => {
                return this.chunkProvider.loadChunk(i * chunkSize, (i * chunkSize) + chunkSize - 1);
            });

        // Wait for all the chunks to resolve, then concat and return.
        const chunkList = await Promise.all(chunkPromiseList);
        return Buffer.concat(chunkList.reduce((a, b) => a.concat(b)));
    }
}
