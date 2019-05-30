
var buffer = new ArrayBuffer(8);
var int8View = new Int8Array(buffer, 0, 8);

int8View.set([1, 2], 0)
console.log(int8View)



