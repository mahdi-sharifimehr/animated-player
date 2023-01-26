import React from 'react';
import Screens from './navigation/screens';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import Store from './redux/store';

function App() {
  return (
    //Provider of redux to have a global store in app
    <Provider store={Store}>
      {/* All the screens defined in navigation */}
      <Screens />
    </Provider>
  )
};

export default App;
