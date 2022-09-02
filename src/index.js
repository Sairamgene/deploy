import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App';
import store from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Firebase, { FirebaseContext } from './firebase';
// import { Provider as SpectrumProvider, defaultTheme } from '@adobe/react-spectrum'
import Loading from './components/loading/Loading';

ReactDOM.render(

  <FirebaseContext.Provider value={new Firebase()}>
    {/* <SpectrumProvider theme={defaultTheme}> */}
      <Provider store={store}>
        <Router>
        <Suspense fallback={Loading}>
          <App/>
        </Suspense>
        </Router>
      </Provider>
      {/* </SpectrumProvider> */}
  </FirebaseContext.Provider>

  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
