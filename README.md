# TurboDownload

## Requirements
    NodeJS LTS v10.15.3
    npm 6.4.1
    
    Note: This is important as there is a known issue with NodeJS v8.15.0 http.get

## Running Locally
    npm install -g typescript
    npm install
    npm run build
    node dist/index.js <command> [options]

## Usage
    node dist/index.js <command> [options]

Commands:
    
    node dist/index.js download  Downloads the file from the specified url.
  
Options:

    --version  Show version number                                       [boolean]
    --help     Show help                                                 [boolean]
    --url                                                               [required]
    --output, -o      The location on the local machine to save the file. [string]
    --chunkSize       The size of each chunk to download (bytes).
                                                         [number] [default: 1048576]
    --numberOfChunks  The number of chunks to download.      [number] [default: 4]
    --parallel        Downloads the chunks in parallel when set to true.
                                                          [boolean] [default: false]
                                                          
## Example

    node dist/index.js download --url=http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar --parallel=true
    
    node dist/index.js download --url=http://f39bf6aa.bwtest-aws.pravala.com/384MB.jar --output=data.jar


