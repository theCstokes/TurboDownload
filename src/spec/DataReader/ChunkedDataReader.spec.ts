import ChunkedDataReader, { IChunkedReadBuffer } from '../../DataReader/ChunkedDataReader';

class MockDataChunkProvider implements IChunkedReadBuffer<Uint8Array> {
    public constructor(private dataSet: number[]) {
    }

    public loadChunk(start: number, end: number): Promise<Uint8Array[]> {
        const slice = this.dataSet.slice(start, end + 1).map((x: number) => Uint8Array.from([x]));
        return Promise.resolve(slice);
    }
}

describe('ChunkedDataReader', () => {
    describe('serial', () => {
        let builder: ChunkedDataReader;
        beforeEach(() => {
            builder = new ChunkedDataReader(new MockDataChunkProvider([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        });
        it('concatenates valid chunks when request less than range', (done) => {
            builder.serial(1, 4)
                .then((result) => {
                    const data = [
                        Uint8Array.from([1]),
                        Uint8Array.from([2]),
                        Uint8Array.from([3]),
                        Uint8Array.from([4])
                    ];

                    expect(result).toEqual(Buffer.concat(data));
                    done();
                });
        });

        it('concatenates all chunks when request length equals range', (done) => {
            builder.serial(2, 5)
                .then((result)  => {
                    const data = [
                        Uint8Array.from([1, 2]),
                        Uint8Array.from([3, 4]),
                        Uint8Array.from([5, 6]),
                        Uint8Array.from([7, 8]),
                        Uint8Array.from([9, 10])
                    ];

                    expect(result).toEqual(Buffer.concat(data));
                    done();
                });
        });

        it('concatenates all chunks when request length exceeds range', (done) => {
            builder.serial(3, 4)
                .then((result) => {
                    const data = [
                        Uint8Array.from([1, 2, 3]),
                        Uint8Array.from([4, 5, 6]),
                        Uint8Array.from([7, 8, 9]),
                        Uint8Array.from([10])
                    ];

                    expect(result).toEqual(Buffer.concat(data));
                    done();
                });
        });
    });

    describe('parallel', () => {
        let builder: ChunkedDataReader;
        beforeEach(() => {
            builder = new ChunkedDataReader(new MockDataChunkProvider([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        });
        it('concatenates valid chunks when request less than range', (done) => {
            builder.parallel(1, 4)
                .then((result) => {
                    const data = [
                        Uint8Array.from([1]),
                        Uint8Array.from([2]),
                        Uint8Array.from([3]),
                        Uint8Array.from([4])
                    ];

                    expect(result).toEqual(Buffer.concat(data));
                    done();
                });
        });

        it('concatenates all chunks when request length equals range', (done) => {
            builder.parallel(2, 5)
                .then((result)  => {
                    const data = [
                        Uint8Array.from([1, 2]),
                        Uint8Array.from([3, 4]),
                        Uint8Array.from([5, 6]),
                        Uint8Array.from([7, 8]),
                        Uint8Array.from([9, 10])
                    ];

                    expect(result).toEqual(Buffer.concat(data));
                    done();
                });
        });

        it('concatenates all chunks when request length exceeds range', (done) => {
            builder.parallel(3, 4)
                .then((result) => {
                    const data = [
                        Uint8Array.from([1, 2, 3]),
                        Uint8Array.from([4, 5, 6]),
                        Uint8Array.from([7, 8, 9]),
                        Uint8Array.from([10])
                    ];

                    expect(result).toEqual(Buffer.concat(data));
                    done();
                });
        });
    });
});
