import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';

class RemoveButton extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("click! ");
        console.log("deleting "+this.props.uri);
        this.props.removeCallback(this.props.uri);
        this.forceUpdate();
    }

    render() {
        return ( < button onClick={this.handleClick}> REMOVE < /button> )
    }
}

export default connect()(RemoveButton)
