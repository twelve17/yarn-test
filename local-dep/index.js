const nock = require("nock");

const nockRequest = (url, path) => {
  return nock(url)
    .log(console.log)
    .post(path)
    .reply(400, { message: "bad request" });
}

module.exports.nockRequest = nockRequest;
