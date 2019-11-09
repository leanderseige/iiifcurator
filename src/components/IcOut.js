import React, { Component } from 'react';
import { connect } from 'react-redux';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import styles from '../hard.module.css';
import store from '../store';


class IcOut extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("aaa")
        // const state = store.getState();
        // console.log("kk"); console.log(state);
        // return ( <div><pre>{ this.props.collectionv2_json }</pre></div> );
        return ( <div className={styles.jsonout}> <JSONPretty id="json-pretty" data={this.props.v2json}></JSONPretty> </div> );
        // return ( <ReactJson src = { this.props.collectionv2_json } theme="monokai" /> );
    }

}

function mapStateToProps(state, ownProps) {
    return {
        v2json: state.v2json
    };
}

// function mapStateToProps(state) {
//   return { state: state }
// }

// export default IcOut;
export default connect(mapStateToProps)(IcOut)
