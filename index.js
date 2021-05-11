const fs = require('fs');
const rp = require('request-promise');
const moment = require('moment');

/**
 * 下载
 * @param { string } uri 下载地址
 * @param { string } fileName 文件名
 */
async function download(uri, fileName) {
  const res = await rp({
    uri,
  })

  const u = uri.split('/');
  const domain = uri.replace(u[u.length - 1], '');

  const paths = res.split('\n');
  const day = moment().format('YYYYMMDD');
  const hour = moment().format('HHmmss');
  let videoPath = day + '/' + hour + '/';

  fs.mkdirSync('video/' + videoPath, {
    recursive: true,
  });
  let fileNo = 1;
  for (let i = 0; i < paths.length; i++) {
    let path = '';
    if (!(paths[i].indexOf('#') > -1) && paths[i].indexOf('.ts') > -1) {
      if (fileNo < 10) {
        path = videoPath + '0000' + fileNo + '.ts';
      }

      if (fileNo >= 10 && fileNo < 100) {
        path = videoPath + '000' + fileNo + '.ts';
      }

      if (fileNo >= 100 && fileNo < 1000) {
        path = videoPath + '00' + fileNo + '.ts';
      }

      if (fileNo >= 1000 && fileNo < 10000) {
        path = videoPath + '0' + fileNo + '.ts';
      }

      if (fileNo >= 10000) {
        path = videoPath + fileNo + '.ts';
      }

      const uri = domain + paths[i];
      await rp({ uri }).pipe(fs.createWriteStream('video/' + path));
      fileNo++;
      paths[i] = path;
    }
  }

  const m3u8Path = 'video/' + day + '_' + hour +'.m3u8';
  fs.writeFileSync(m3u8Path, new Uint8Array(Buffer.from(paths.join('\n'))));

  const db = fs.readFileSync('db.json', 'utf8');
  let data = [];
  if (db) {
    data = JSON.parse(db);
  }
  data.push({
    name: fileName || '',
    path: m3u8Path,
    time: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
  fs.writeFileSync('db.json', new Uint8Array(Buffer.from(JSON.stringify(data))));
}

module.exports = download;