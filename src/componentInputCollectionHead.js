import React from 'react';
import styles from './hard.module.css'

class InputCollectionHead extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeCollectionID = this.handleChangeCollectionID.bind(this);
    this.handleChangeCollectionLabel = this.handleChangeCollectionLabel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
      this.setState( { inputCollectionID: this.props.config.prefix } );
  }
  handleChangeCollectionID(event) {
      this.setState({inputCollectionID: event.target.value});
    }
  handleChangeCollectionLabel(event) {
    this.setState({inputCollectionLabel: event.target.value});
  }

  handleSubmit(event) {
      this.props.updateCallback({...this.state});
      event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label className={styles.inputlabel}>ID:</label><input className={styles.textinput} type="text" onChange={this.handleChangeCollectionID} defaultValue={this.props.config.prefix} /><br />
        <label className={styles.inputlabel}>Label:</label><input className={styles.textinput} type="text" onChange={this.handleChangeCollectionLabel} />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default InputCollectionHead;
