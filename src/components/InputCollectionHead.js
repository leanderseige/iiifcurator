import React from 'react';
import { connect } from 'react-redux';
import styles from '../hard.module.css'
import store from '../store';

class InputCollectionHead extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        store.dispatch({
            type: 'SET_HEAD',
            uri: data.get('input_uri'),
            label: data.get('input_label')
        });
        this.props.updateCallback();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
            <label className={styles.inputlabel}>ID:</label>
            <input className={styles.textinput} type="text" defaultValue={this.props.uri} name="input_uri" /><br />
            <label className={styles.inputlabel}>Label:</label>
            <input className={styles.textinput} type="text" defaultValue={this.props.label} name="input_label" />
            <input type="submit" value="SET" />
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {
        uri: state.uri,
        label: state.label
    }
}

export default connect(mapStateToProps)(InputCollectionHead)
