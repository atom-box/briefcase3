// Useage: syntax examples at the end of this file.
// Dependency https://www.npmjs.com/package/ssh2-sftp-client

// SEE how they did ENV VARS in the PUT function (where I commented it out)
require('dotenv').config(); // get environmental variables from hidden .ENV file
const Client = require('ssh2-sftp-client');
const remotePathPrefix = '/Development/';
let sftp = new Client();

const connSettings = {
     host: process.env.OFFSUP_HOST,
     port: 22, // Normal is 22 port
     username: process.env.OFFSUP_USER,
     password: process.env.OFFSUP_PASS,
     // TODO ¿Is this passwd string being transmitted in a secure way?
};

// const conn = new Client();
if (undefined === process.argv[2] || !['lr', 'la', 'pu', 'pd', 'ps', 'ge', 'ds'].includes(process.argv[2]) ){
    process.argv[2] = 'la';
}

switch (process.argv[2]) {
case 'lr': 
    //Get directory listing
    listFilesRaw();
    break;
case 'la': 
    //Get directory listing
    listFilesShow();
    break;
case 'pd':
    //Put ENTIRE DIRECTORY from pathA to pathB
    putAll(process.argv[3], process.argv[4]);
    break;
case 'ps':
    //Put one file from pathA to pathB
    putSingle(process.argv[3], process.argv[4]);
    break;


// case 'ge':
//     //Get file; localA from remoteB
//     get();
//     break;
// case 'ds':
//     // Delete single remote file by name
//     singleDelete(process.argv[3]);
//     break;
default:
    console.log(`Should never see this.` + process.argv[2] );// todo
}




/////////////////////////////////////////////////////////////

function listFilesRaw(){
    sftp.connect(connSettings).then(() => {
      return sftp.list(remotePathPrefix);  
    })
    .then(data => {
      console.log(data, 
        `\n::::::::\nRaw Array. Data Type is "${typeof data}"\n::::::::`, 
        `\nFirst filename is "${data[0].name}"`);
    })
    .then(() => {
        return sftp.end();
    })
    .catch(err => {
      console.log(err, 'catch error');
    });
}


function listFilesShow() {
    sftp.connect(connSettings).then(() => {
      return sftp.list(remotePathPrefix);   
    })
    .then(data => {
        const regex = /\w+\ \d+\ \d+\ \d+:\d+/i; 
        i = data.length -1, 
        d = new Date(),
        n = '';
        for (; i >= 0; i--){
            d =  new Date(data[i].modifyTime * 1000);
            d = regex.exec(d);
            s =  data[i].size;
            if (data[i].type === 'd') { s = 'dir'}
            n = data[i].name;
            console.log('\t' + d 
                + '\t' + s
                + '\t' + n);
        }
    })
    .then(() => {
        return sftp.end();
    })
    .catch(err => {
        console.log(err, 'catch error');
        return sftp.end();
    });
}



function putAll(localPath, remotePath = 'unnamed'){
// todo: needs to warn before overwrite at remote

        async function main() {
          // const client = new SftpClient(remotePathPrefix);
          // const src = path.join(__dirname, '..', 'data', 'upload-src');
          const src = localPath;
          // const dst = '/home/tim/upload-test';
          const dst = remotePathPrefix + remotePath;
          try {
            let success = await sftp.connect(connSettings);
            console.dir(success );
            sftp.on('upload', info => {
              console.log(`Listener: Uploaded ${localPath}`);
            });
            let rslt = await sftp.uploadDir(src, dst);
            return rslt;
          } finally {
            sftp.end();
          }
        }

        main()
          .then(msg => {
            console.log(msg);
          })
          .catch(err => {
            console.log(`main error: ${err.message}`);
          });

}




















function putSingle(src, remotePath='unnamed'){
    // options put(src, remotePath, options) ==> string   
    // todo: needs to warn before overwrite at remote
    async function main() {
      const dst = remotePathPrefix + remotePath;
      try {
        await sftp.connect(connSettings);
        sftp.on( info => {
          console.log(`Listener: Uploaded `);
        });
        let rslt = await sftp.put(src, remotePath, options={}); // returns a string
        return rslt;
      } finally {
        sftp.end();
      }
    }

    main()
      .then(msg => {
        console.log(msg);
      })
      .catch(err => {
        console.log(`main error: ${err.message}`);
      });

}




















function get(localPath, remotePath){

}

function singleDelete(filename){

}