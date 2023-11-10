import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import {BrowserRouter} from 'react-router-dom'


const theme = extendTheme({
  colors: {
    blueGrey: {
      100: '#f6f8fb',
    },
    black: { 100: '#181E25' },
    darkblue: '#39364f',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

