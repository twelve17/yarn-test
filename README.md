# yarn-test

POC of inconsistent development dependency resolution between NPM and Yarn.

**Note**: There is an apparent issue with `nock` and a particular version of one of its dependencies.  
This issue is being leveraged here to illustrate that the dependency is changing between NPM and Yarn.

## Test Case


- node v7.9.0
- npm 4.2.0
- yarn 0.23.2 (via homebrew)
- OS X 10.12.3 Sierra
- `yarn-test` as the main project
- `local-dep`: a local NPM dependency

When using `npm`, the test file in the `yarn-test` passes.  When using `yarn`, it fails. The test fails presumably 
because the way that yarn is resolving the dependencies is yielding a different version of a `nock` dependency, and 
thus it breaks.

### Steps to reproduce

- clone this repo
- run `npm install`
- run `npm test` to confirm the 1 test passes
- run `yarn`
- run `yarn test`

Test now fails with this error:

```
request with local nock
  /path/to/yarn-test/node_modules/local-dep/node_modules/nock/lib/request_overrider.js:260

  Error: Nock: No match for request {
    "method": "POST",
    "url": "http://localhost/",
    "headers": {
      "host": "localhost",
      "accept": "application/json",
      "content-length": 0
    }
  }
```

Doing `npm ls` before and after yarn shows these differences in my setup:

```
# diff good.txt bad.txt 
42a43
> │ │ │ ├── find-up@2.1.0
311,312d311
< │ │ │ ├─┬ find-up@1.1.2
< │ │ │ │ └── path-exists@2.1.0
327,328c326
< │ ├─┬ package-hash@1.2.0
< │ │ └── md5-hex@1.3.0
---
> │ ├── package-hash@1.2.0
397,398c395
< │   │   │   ├── ini@1.3.4
< │   │   │   └── minimist@1.2.0
---
> │   │   │   └── ini@1.3.4
595c592,593
< ├── local-dep@0.0.1
---
> ├─┬ local-dep@0.0.1 invalid
> │ └── nock@9.0.13 extraneous
601a600
> │ ├── changelog@1.0.7 extraneous
605a605
> ├── node-pre-gyp@0.6.34 extraneous
632d631
<   │   ├── assert-plus@1.0.0
634,635c633
<   │   ├─┬ dashdash@1.14.1
<   │   │ └── assert-plus@1.0.0
---
>   │   ├── dashdash@1.14.1
637,638c635
<   │   ├─┬ getpass@0.1.6
<   │   │ └── assert-plus@1.0.0
---
>   │   ├── getpass@0.1.6
```
