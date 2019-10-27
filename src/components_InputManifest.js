import React from 'react';
import styles from './hard.module.css'

class InputManifest extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({inputManifest: event.target.value});
    }

  handleSubmit(event) {
      this.props.addCallback(this.state.inputManifest);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label className={styles.inputlabel}>Manifest URI:</label>
        <input className={styles.textinput} type="text" onChange={this.handleChange} />
        <input type="submit" value="ADD" />
      </form>
    );
  }
}

export default InputManifest;
