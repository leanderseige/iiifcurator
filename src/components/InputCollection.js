import React from 'react';
import { connect } from 'react-redux';
import styles from '../hard.module.css'
import store from '../store';


class InputCollection extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        this.props.loadCallback(data.get('input_load_collection'));
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label className={styles.inputlabel}>Collection URI:</label>
                <input className={styles.textinput} type="text" name="input_load_collection" />
                <input type="submit" value="LOAD" />
            </form>
        );
    }
}

// export default InputCollection;
export default connect()(InputCollection)
