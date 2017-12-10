const http = require('http')
const https = require('https')

const options = (hostname, path, headers = {}, method='GET') => {
  return {
    hostname,
    path,
    headers,
    method
  };
}

const handleResponse = (callback, error) => {
  return (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];
    console.log(statusCode);
    let err;
    if (statusCode !== 200) {
      err = new Error(`Request Failed.\n` +
        `Status Code: ${statusCode}`);
    }
    if (err) {
      console.log(error.message);
      // consume response data to free up memory
      res.resume();
      error();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      console.log('end', rawData);
      callback(rawData);
    });
  }
}

const handleJSONResponse = (callback, err) => {
  return (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200 && statusCode !== 201) {
      console.log('Status Error:', statusCode);
      res.resume();
      err();
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\n` +
        `Expected application/json but received ${contentType}`);
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
    console.log(hostname, path);
    const handler = isHttps ? https : http;
    const req = handler.request(
      options(hostname, path, headers),
      handleJSONResponse(done)
    );

    req.on('error', (e) => {
      err(e)
    });

    req.end()
  },

  post(hostname, path, data, done, err, headers={}, isHttps=true) {
    //console.log(hostname, path, data, headers, isHttps);
    const opts = options(hostname, path, headers, 'POST');
    const handler = isHttps ? https : http;
    const req = handler.request(
      opts,
      handleJSONResponse(done, err)
    );

    const postData = JSON.stringify(data);

    req.on('error', (e) => {
      console.log('error', e);
      err(e);
    });

    req.write(postData);
    req.end()
  }
}

module.exports = RequestWrapper;
