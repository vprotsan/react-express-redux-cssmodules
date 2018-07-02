// const express = require('express');
// const os = require('os');
//
// const app = express();
//
// app.use(express.static('dist'));
// app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
// app.listen(8080, () => console.log('Listening on port 8080!'));



//new----------------------

const path = require('path')
const express = require('express')
const React = require('react')
const { createStore } = require('redux')
const { Provider } = require('react-redux')
const counterApp = require('./reducers')
const App = require('./containers/App')
const { renderToString } = require('react-dom/server')
const axios = require('axios')

const app = express();
const port = 8080;
​
//Serve static files
app.use('/static', Express.static('static'))
​
// This is fired every time the server side receives a request
app.use(handleRender)
​
// We are going to fill these out in the sections to follow
function handleRender(req, res) {

    // Compile an initial state
    let preloadedState

    axios({
      method:'get',
      url:'https://hackathon-api.now.sh/products',
    })
    .then(data => {
      // console.log(data.data)
      preloadedState = { data.data }
    })
    .catch(error => {
      console.log(error);
    });

    // Create a new Redux store instance
    const store = createStore(counterApp, preloadedState)
  ​
    // Render the component to a string
    const html = renderToString(
      <Provider store={store}>
        <App />
      </Provider>
    )
  ​
    // Grab the initial state from our Redux store
    const finalState = store.getState()
  ​
    // Send the rendered page back to the client
    res.send(renderFullPage(html, finalState))
}

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}
​
app.listen(port)
