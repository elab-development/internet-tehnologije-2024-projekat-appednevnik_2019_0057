import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';

import './styles/globals.css';
import './styles/theme.css';
import './styles/layout.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <BrowserRouter>
      <App />
     </BrowserRouter>
    
  </React.StrictMode>
);


