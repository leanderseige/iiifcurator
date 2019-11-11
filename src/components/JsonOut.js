import React, { Component } from 'react';
import { connect } from 'react-redux';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import styles from '../hard.module.css';

class JsonOut extends Component {
    render() {
        return (
            <div className={styles.jsonout}>
                <JSONPretty id="json-pretty" data={this.props.v2json}></JSONPretty>
            </div> );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        v2json: state.v2json,
        v2: state.v2,
    };
}

export default connect(mapStateToProps)(JsonOut)
