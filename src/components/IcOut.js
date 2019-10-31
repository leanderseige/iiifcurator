import React, { Component } from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import styles from '../hard.module.css';
import store from '../store';


class IcOut extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const state = store.getState();
        console.log("kk"); console.log(state);
        // return ( <div><pre>{ this.props.collectionv2_json }</pre></div> );
        return ( <div className={styles.jsonout}> <JSONPretty id="json-pretty" data={state.v2json}></JSONPretty> </div> );
        // return ( <ReactJson src = { this.props.collectionv2_json } theme="monokai" /> );
    }

}

export default IcOut;
