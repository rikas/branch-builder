import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { defaultTheme, Flex, Provider } from '@adobe/react-spectrum';
import { ToastContainer } from '@react-spectrum/toast';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider theme={defaultTheme}>
      <Flex flexGrow={1} direction="column">
        <App />
      </Flex>
      <ToastContainer />
    </Provider>
  </React.StrictMode>,
);
