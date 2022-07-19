import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import DayNight from './component/daynight/DayNight';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="background"></div>
    <App />
    <DayNight />
  </React.StrictMode>
);
