import {dtype} from "./dtype.js";
import {anArray} from "./an-array.js";
import {isBuffer} from "./is-buffer.js";

const CW = [0, 2, 3]
const CCW = [2, 1, 3]

export function createIndices(array, opt) {
    if (!array || !(anArray(array) || isBuffer(array))) {
        opt = array || {};
        array = null;
    }

    if (typeof opt === 'number') //backwards-compatible
    {
        opt = { count: opt };
    }
    else
    {
        opt = opt || {};
    }

    const type = typeof opt.type === 'string' ? opt.type : 'uint16';
    const count = typeof opt.count === 'number' ? opt.count : 1;
    const start = (opt.start || 0);

    const dir = opt.clockwise !== false ? CW : CCW,
        a = dir[0],
        b = dir[1],
        c = dir[2];

    const numIndices = count * 6;

    const indices = array || new (dtype(type))(numIndices);

    for (let i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        let x = i + start;
        indices[x + 0] = j + 0;
        indices[x + 1] = j + 1;
        indices[x + 2] = j + 2;
        indices[x + 3] = j + a;
        indices[x + 4] = j + b;
        indices[x + 5] = j + c;
    }

    return indices;
}