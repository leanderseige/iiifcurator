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
      this.forceUpdate(); // FIXME

  }

  render() {
    const state = store.getState();
    if(state) {
        return (
          <form onSubmit={this.handleSubmit}>
            <label className={styles.inputlabel}>ID:</label>
            <input className={styles.textinput} type="text" defaultValue={state.uri} name="input_uri" /><br />
            <label className={styles.inputlabel}>Label:</label>
            <input className={styles.textinput} type="text" defaultValue={state.label} name="input_label" />
            <input type="submit" value="SET" />
          </form>
        );
    } else {
        return '';
    }
  }
}

// export default InputCollectionHead;
export default connect()(InputCollectionHead)
