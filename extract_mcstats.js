import { gunzip } from 'zlib';

// diagnostics mcstats
const base64Data = "";
const buffer = Buffer.from(base64Data, 'base64');

gunzip(buffer, (err, decompressed) => {
    if (err) {
        console.error("Failed to decompress:", err);
        return;
    }
    const jsonTxt = decompressed.toString('utf-8');
    const json = JSON.parse(jsonTxt);
    console.log(JSON.stringify(json, undefined, 2));
});
