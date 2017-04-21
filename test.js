import test from "ava";
import nock from "nock";
import request from "request";
import { nockRequest } from "local-dep";

const HOST = "localhost";
const URL = `http://${HOST}`;
const PATH = "/";

test.beforeEach(t => {
  nock.disableNetConnect();
  nock.enableNetConnect(HOST);
});

test.afterEach(t => {
  nock.cleanAll();
  nock.enableNetConnect();
});

test.cb("request with local nock", t => {
  nockRequest(URL, PATH);
  request({
    url: URL,
    method: "POST",
    json: true
  }, (error, response, body) => {
    if (error) {
      t.end(error);
    } else {
      t.truthy(body);
      t.is(400, response.statusCode);
      t.end();
    }
  });
});


