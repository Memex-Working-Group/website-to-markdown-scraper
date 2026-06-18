# ipld-hasher

#### Setup Instructions

``` bash

helium-browser --remote-debugging-port=9222 --disable-web-security

# MacOS
# Remember to Quit Brave
open -a "Brave Browser" --args --remote-debugging-port=9222 --disable-web-security

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

node run.js https://slatestarcodex.com/2020/03/30/legal-systems-very-different-from-ours-because-i-just-made-them-up/

node run.js https://x.com/rohit4verse/status/2033945654377283643

node run.js https://www.personfamiliar.com/p/ai-humanity-and-dr-manhattan-syndrome

node run.js https://joshblais.com/blog/using-the-internet-like-its-1999/

```