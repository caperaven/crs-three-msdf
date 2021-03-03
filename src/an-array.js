const str = Object.prototype.toString;

export function anArray(arr) {
    return (
        arr.BYTES_PER_ELEMENT
        && str.call(arr.buffer) === '[object ArrayBuffer]'
        || Array.isArray(arr)
    );
}