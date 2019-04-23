import * as fs from 'fs';
import * as path from 'path';

import ChunkedDataReader from 'DataReader/ChunkedDataReader';
import ChunkedHTTPReadBuffer from 'DataReader/ChunkedHTTPReadBuffer';

export interface IDownloadCommandHandlerArgs {
    url: string;
    output?: string;
    chunkSize: number;
    numberOfChunks: number;
    parallel: boolean;
}

export default class DownloadCommandHandler {
    public static async run(args: IDownloadCommandHandlerArgs) {
        const httpReadBuffer = new ChunkedHTTPReadBuffer(args.url);
        const dataReader = new ChunkedDataReader(httpReadBuffer);

        // Read.
        let dataBuffer: Buffer;
        if (args.parallel === true) {
            dataBuffer = await dataReader.parallel(args.chunkSize, args.numberOfChunks);
        } else {
            dataBuffer = await dataReader.serial(args.chunkSize, args.numberOfChunks);
        }

        // Write to file.
        let outputFilePath = path.basename(args.url);
        if (args.output !== undefined) {
            const outputDir = path.dirname(args.output);
            outputFilePath = path.isAbsolute(args.output) ? args.output : path.join(process.cwd(), args.output);
            // Create the output directory if needed.
            DownloadCommandHandler.mkdirByPathSync(outputDir);
        }

        const fileStream = fs.createWriteStream(outputFilePath);
        fileStream.write(dataBuffer);
        fileStream.end();
    }

    private static mkdirByPathSync(targetDir: string, { isRelativeToScript = false } = {}) {
        const sep = path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        const baseDir = process.cwd(); //isRelativeToScript ? __dirname : '.';

        return targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            try {
                fs.mkdirSync(curDir);
            } catch (err) {
                if (err.code === 'EEXIST') { // curDir already exists!
                    return curDir;
                }

                // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
                if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                    throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
                }

                const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
                if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                    throw err; // Throw if it's just the last created dir.
                }
            }

            return curDir;
        }, initDir);
    }
}
