import fs from 'fs';
import path from 'path';
import rp_decode from './lib.js';

class tlvparser {
    constructor(raw) {
        this.raw = raw;
        this.pos = 0;
    }

    take_u32() {
        const len = this.raw.readUInt32LE(this.pos);
        this.pos += 4;
        return len;
    }

    take_u8() {
        const byte = this.raw.readUInt8(this.pos);
        this.pos += 1;
        return byte;
    }

    take_bytes(len) {
        const data = this.raw.subarray(this.pos, this.pos + len);
        this.pos += len;
        return data;
    }

    payload() {
        return this.take_bytes(this.take_u32());
    }

    pos() {
        return this.pos;
    }

    is_eof() {
        return this.pos >= this.raw.length;
    }
}

function extract_assets(tlv, module) {
    const tot = module.assets?.length || 0;
    if (tot === 0) {
        console.error('No asset contained');
        return;
    }
    console.error(`${tot} assets found`);

    const odir = './extracted_assets';
    if (!fs.existsSync(odir)) {
        fs.mkdirSync(odir, { recursive: true });
    }

    let i = 0;
    while (!tlv.is_eof()) {
        const mark = tlv.take_u8();
        if (mark === 0)         // eof
            break;
        else if (mark !== 1)
            console.err(
                `Warning: Invalid mark ${mark} found on asset ${i}, offset ${tlv.pos()} (shoud be 1)`
            );

        const meta = module.assets?.[i];
        const name = (meta && typeof meta[0] === 'string')
            ? path.basename(meta[0])
            : `asset_${i}.bin`;

        const asset = rp_decode(tlv.payload());
        const path = path.join(odir, name);

        fs.writeFileSync(path, asset);
        console.error(`Asset ${i}: ${path} (${(asset.length / 1024).toFixed(2)} KB)`);

        i++;
    }
}

function main(raw) {
    const tlv = new tlvparser(raw);

    // Header
    if (tlv.take_u8() !== 111)
        throw new Error("Invalid magic");
    if (tlv.take_u8() !== 0)
        throw new Error("Invalid version");

    const payload = JSON.parse(
        Buffer.from(rp_decode(tlv.payload())).toString()
    );
    console.error(`type: ${payload.type}`);

    const module = payload.module;

    extract_assets(tlv, module);

    console.log(JSON.stringify(module, null, 2));
}

main(fs.readFileSync(0));
