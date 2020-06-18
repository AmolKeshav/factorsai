# factorsai

- To execute server, run `npm start` on the command line.
- To execute test, run `npm test` on the command line.

- To change the parameters used to compute relevance score, change the corresponding field (`relevanceKeys`) in `config.js`

- Two APIs:
  - <host>/api/users/submitUser -- To add user using a background process
  - <host>/api/users/addUser -- To add user during API call
