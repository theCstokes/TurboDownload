import * as yargs from 'yargs';
import { Argv } from 'yargs';

import DownloadCommandHandler from 'CommandHandlers/DownloadCommandHandler';

export default class App {
    public run() {
        yargs
            .command(
                'download',
                'Downloads the file from the specified url.',
                (yarg: Argv) => {
                    return yarg
                        .option('url', {
                            type: 'string',
                            description: 'The url to download from.',
                            required: true
                        })
                        .option('output', {
                            alias: 'o',
                            type: 'string',
                            description: 'The location on the local machine to save the file.',
                        })
                        .option('chunkSize', {
                            type: 'number',
                            description: 'The size of each chunk to download (bytes).',
                            default: Math.pow(1024, 2)
                        })
                        .option('numberOfChunks', {
                            type: 'number',
                            description: 'The number of chunks to download.',
                            default: 4
                        })
                        .option('parallel', {
                            type: 'boolean',
                            description: 'Downloads the chunks in parallel when set to true.',
                            default: false
                        });
                },
                DownloadCommandHandler.run
            )
            .demandCommand()
            .demandOption('url')
            .help()
            .parse();
    }
}
