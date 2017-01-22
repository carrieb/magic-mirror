const http = require('http')
const https = require('https')

const options = (hostname, path, headers = {}) => {
  return {
    hostname,
    path,
    headers
  };
}

const handleJSONResponse = (callback) => {
  return (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\n` +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.log(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        let parsedData = JSON.parse(rawData);
        //console.log(parsedData);
        callback(parsedData);
      } catch (e) {
        console.log(e.message);
      }
    });
  }
}

const RequestWrapper = {
  getJSON(hostname, path, done, err, isHttps=true, headers={}) {
    const handler = isHttps ? https : http;
    const req = handler.request(
      options(hostname, path, headers),
      handleJSONResponse(done)
    );

    req.on('error', (e) => {
      err(e)
    });

    req.end()
  }
}

module.exports = RequestWrapper;
