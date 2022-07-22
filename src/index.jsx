import React from 'react';
import { BrowserRouter } from "react-router-dom"
import { createRoot} from 'react-dom/client';
import "./index.scss"
import {App} from './components/App.jsx'
const root = createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);


