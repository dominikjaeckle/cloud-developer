import fs from 'fs';
import Jimp = require('jimp');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise(async (resolve, reject) => {
        try {
            const photo = await Jimp.read(inputURL);
            const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
            await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname+outpath, (img)=>{
                resolve(__dirname+outpath);
            });
        } catch(_) {
            reject("");
        }
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

/**
 * Helper function to validate an URL.
 * Code taken from https://gist.github.com/rodneyrehm/8013067
 * and then adapted to check the following protocols:
 *  - check protocol: http://, https://, file://, ftp:// 
 *  
 * @param textUrl 
 */
export function isUrl(textUrl: string): boolean {
    let url_pattern = /^(https?|ftp|file):\/\/(-\.)?([^\s\/?\.#]+\.?)+(\/[^\s]*)?$/i;
    if(textUrl.match(url_pattern)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Method checks for a respective filetype. This is done by only
 * looking at the file type.
 * 
 * @param textUrl 
 * @param filetypes 
 */
export function isImageFile(textUrl: string, 
        filetypes: string[] = ['jpg', 'jpeg', 'png']): boolean {
    let urlSplit = textUrl.split('.');
    let fileType = urlSplit[urlSplit.length - 1].trim();
    return filetypes.includes(fileType);
}