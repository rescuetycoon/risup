import fs from 'fs';
import * as fflate from 'fflate';
import crypto from 'crypto';
import { decode } from '@msgpack/msgpack';
import rp_decode from './lib.js';

function window_aes(data, keys) {
    const key = crypto.createHash('sha256').update(keys).digest();

    const iv = Buffer.alloc(12);

    // Web Crypto API's Auth Tag
    const ciphertext = data.subarray(0, -16);
    const authTag = data.subarray(-16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
}

try {
    const raw = new Uint8Array(fs.readFileSync(0));

    let tmp;

    try {
        tmp = fflate.decompressSync(rp_decode(raw));
        console.error('format: risup')
    } catch {
        tmp = fflate.decompressSync(raw);
        console.error('format: risupreset')
    }

    const de = decode(tmp);
    const ver = de.presetVersion;
    const is_encrypted = (ver === 0 || ver === 2) && de.type === 'preset';

    console.error(`version: ${ver}${is_encrypted ? ' (encrypted)' : ''}`);

    const final = is_encrypted ? {
        ...de,
        preset: decode(await window_aes(de.preset ?? de.pres, 'risupreset')),
        pres: undefined
    } : de;

    console.log(JSON.stringify(final, null, 2));

} catch (err) {
    console.error("Failed: ", err.message);
    process.exit(1);
}
