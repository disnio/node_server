const {exec} = require('child_process');
const iconv = require('iconv-lite');

let cp = require('child_process');
var binaryEncoding = 'binary';
var encoding = 'cp936';

cp.exec(`dir ${__dirname}`, {encoding: binaryEncoding}, function (err, stdout, stderr) {
    console.log(iconv.decode(Buffer.from(stdout, binaryEncoding), encoding), "error" + iconv.decode(new Buffer(stderr, binaryEncoding), encoding));
});


// const ls = exec(`dir ${__dirname}`, (err, stdout, stderr)=>{
//     if(err){
//         console.error(err);
//         return;
//     }
//     console.log(stdout);
// });



