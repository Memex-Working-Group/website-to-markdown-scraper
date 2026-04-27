# ipld-hasher

#### Setup Instructions

``` bash

helium-browser --remote-debugging-port=9222 --disable-web-security

```

#### NPM Install Logs
``` bash

npm init -y
npm install playwright
npm install playwright-single-file
npm install js-yaml
npm install ipfs-only-hash

```
#### Websites to Test

``` bash

node run.js https://astralcodexten.com/p/the-dilbert-afterlife

node run.js https://gwern.net/fiction/craneyard

node run.js https://ipld.io/docs/codecs/known/dag-cbor/

```