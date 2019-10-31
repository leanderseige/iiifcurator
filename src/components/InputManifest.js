import React from 'react';
import styles from '../hard.module.css'
import store from '../store';


class InputManifest extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        this.props.addCallback(data.get('input_add'));
    }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label className={styles.inputlabel}>Manifest URI:</label>
        <input className={styles.textinput} type="text" name="input_add" />
        <input type="submit" value="ADD" />
      </form>
    );
  }
}

export default InputManifest;
