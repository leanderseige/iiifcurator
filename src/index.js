import React, { Component } from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/app.js';
import store from './store';

render(
    <Provider store={store}>

    < App config = { {
        '@id': 'https://iiif.manducus.net/collections/36c3/manifest.json',
        'label': 'The Collection Title',
    } } />
    
    </Provider>

    , document.getElementById('root'));
