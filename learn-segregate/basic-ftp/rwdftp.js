// Command line syntax examples are at the bottom of this file

// use Node 10.18.1 per Ray
// const readline = require('readline');
const ftp = require("basic-ftp");
require ('dotenv').config();

const remotePathPrefix = '/Development/';
const connSettings = {
            host: process.env.OFFSUP_HOST,
            user: process.env.OFFSUP_USER,
            password: process.env.OFFSUP_PASS,
            secure: false, //true
            // use NODE options https://nodejs.org/api/tls.html#tls_tls_connect_options_callback
}


if ('undefined' === process.argv[2] || !['la', 'ln', 'lo', 'lp', 'lr', 'pu', 'ge', 'ds', 'dn'].includes(process.argv[2]) ){
    process.argv[2] = 'la';
}


switch (process.argv[2]) {
case 'la': 
    //List all remote files 
    listAllFiles();
    break;
case 'ln': 
    //List remote files newer than... ' + process.argv[3]  
    //Using formats (even partially) similar to "2015-03-25" \n"03/25/2015" \n"Mar 25 2015" \n"25 Mar 2015"')
    listNewerFiles(process.argv[3]);  /////////// todo needs second arg
    break;
case 'lo': 
    //List remote files older than... '  );
    //Using formats (even partially) similar to "2015-03-25" \n"03/25/2015" \n"Mar 25 2015" \n"25 Mar 2015"')
    listOlderFiles(process.argv[3]);
    break;
case 'lp': 
    //List remote files matching this pattern
    listNamedFiles(process.argv[3]);
    break;
case 'lr': 
    //List remote files as raw object
    listRawFileObject();
    break;

case 'pu':
    //Put file pathA to pathB.
    put(process.argv[3], process.argv[4]);
    break;
case 'ge':
    // Get file; localA from remoteB
    get(process.argv[3], process.argv[4]);
    break;
case 'ds':
    // Delete remote file by name
    remoteDelete(process.argv[3]);
    break;
case 'dn':
    // Delete all files newer than...
    deleteNewerThan(process.argv[3]);
    break;
default:
    console.log(`Should never see this.` + process.argv[2] );// todo
}


async function listAllFiles() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {   
        await client.access(connSettings);
        const list = await client.list(remotePathPrefix);
        const regex1 = /\w+\ \d+\ \d+\ \d+:\d+/i; 
        let i = list.length - 1, 
        d = new Date(),
        n = '';
        for (; i >= 0; i--){
            if (false){
                next;
            }
            d =  list[i].modifiedAt;
            d = regex1.exec(d);
            s =  list[i].size;
            if (list[i].type === 2) { s = 'dir'}
            n = list[i].name 
            console.log('\t' + d 
                + '\t' + s
                + '\t' + n);
        }
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}


// For development only=
async function listRawFileObject() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
        await client.access(connSettings);
        console.dir(await client.list(remotePathPrefix));
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}


async function listNewerFiles(filter) {
    // handles variable date formats by converting both to Internet time

    const client = new ftp.Client();
    if (undefined === filter   ){
        console.log('Please enter a date string');
        return;
    }
    let cutOffMS = Date.parse(filter);
    client.ftp.verbose = false;

    try {
        await client.access(connSettings);
        const list = await client.list(remotePathPrefix);
        const regex1 = /\w+\ \d+\ \d+\ \d+:\d+/i; 
        let i = list.length - 1, 
        d = new Date(),
        n = '',
        fileMSSince1970 = 0;
        for (; i >= 0; i--){
            fileMSSince1970 = Date.parse(list[i].modifiedAt);
            d =  list[i].modifiedAt;
            // console.log(`${fileMSSince1970} vs cutoff: ${cutOffMS} `)
            if (fileMSSince1970 < cutOffMS){
                continue;
            }
            d = regex1.exec(d);
            s =  list[i].size;
            if (list[i].type === 2) { s = 'dir'}
            n = list[i].name 
            console.log('\t' + d 
                + '\t' + s
                + '\t' + n);
        }
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}



 
 async function arrayitizeNewerFiles(filter) {
    // console.log(`Filter typeis ${typeof filter} and value ${filter} `)
    const client = new ftp.Client();
    if (undefined === filter   ){
        console.log('Please enter a date string');
        return;
    }
    let cutOffMS = Date.parse(filter),
    filenames = [];
    client.ftp.verbose = false;

    try {
        await client.access(connSettings);
        const list = await client.list(remotePathPrefix);
        let i = list.length - 1, 
        fileMSSince1970 = 0;
        for (; i >= 0; i--){
            fileMSSince1970 = Date.parse(list[i].modifiedAt);
            d =  list[i].modifiedAt;
            if (fileMSSince1970 < cutOffMS){
                continue;
            }
            if (list[i].type === 2) { s = 'dir'}
            n = list[i].name 
            filenames.push(n);
        }
    }
    catch(err) {
        console.log(err);
    }
    client.close();
    return filenames;
}


async function deleteNewerThan(filter) {
    // not efficient; opens and closes the client once per file!

    let newFiles = await arrayitizeNewerFiles(filter);
    console.log(`First filename: [${newFiles[0]}] ... Last filename: [${newFiles[newFiles.length - 1]}]\nFiles modified after: [${filter}]\nNumber of files: [${newFiles.length}]`);
    while(newFiles[0] !== undefined){
        let doomedFile = newFiles.shift();
        console.log('Man overboard!  [' + doomedFile + ']');
        // UNCOMMENT THE FOLLOWING LINE TO ACTUALLY DELETE FILES
        // remoteDelete(doomedFile);
    }
}



async function listNamedFiles(filter) {
    const client = new ftp.Client();
    if (undefined === filter   ){
        console.log('*******************\nYou entered no pattern string\n*******************');
        return;
    }
    let cutOffMS = Date.parse(filter);
    client.ftp.verbose = false;

    try {
        await client.access(connSettings);
        const list = await client.list(remotePathPrefix);
        const regex1 = /\w+\ \d+\ \d+\ \d+:\d+/i,
        regex2 = new RegExp(filter, 'i'); 
        let i = list.length - 1, 
        d = new Date(),
        n = '';
        for (; i >= 0; i--){
            d =  list[i].modifiedAt;
            if (!regex2.test(list[i].name)){
                // console.log(`NO MATCH: [${filter}] and [${list[i].name}] `);
                continue;
            }
            d = regex1.exec(d);
            s =  list[i].size;
            if (list[i].type === 2) { s = 'dir'}
            n = list[i].name;
            console.log('\t' + d 
                + '\t' + s
                + '\t' + n);
        }
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}




async function put(){
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access(connSettings);
        let herePath = process.argv[3];
        let therePath = remotePathPrefix + process.argv[4];
        await client.uploadFrom(herePath , therePath);
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}

async function get(){
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access(connSettings);
        let herePath = process.argv[3];
        let therePath = remotePathPrefix + process.argv[4];
        await client.downloadTo(herePath, therePath);
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}

async function remoteDelete(remoteFilename){
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access(connSettings);
        const completeRemotePath = remotePathPrefix + remoteFilename;
        console.log(`Will delete ${completeRemotePath}`); 
        await client.remove(completeRemotePath);
    }

    catch(err) {
        console.log(err);
    }
    client.close();
}



/* Useage:  SYNTAX EXAMPLES for the Node.js terminal:

node rwd-basic-ftp.js   de   remote.csv
node rwd-basic-ftp.js   pu   local.csv  remote.csv
node rwd-basic-ftp.js   ge   local.csv  remote.csv
node rwd-basic-ftp.js   ln   "25 Jan 2020" 
node rwd-basic-ftp.js   ln  "25 Mar 2015"

The two letter options are
1. DE  delete
2. PU  put
3. GE  get
4. LN  list newer than
5. LO  list older than
6. LP  list by filename pattern
7. LA  list all
8. DN  delete any files newer than [date]



*/