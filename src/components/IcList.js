import React, { Component } from 'react'
import { connect } from 'react-redux';
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import styles from '../hard.module.css'
import RemoveButton from './RemoveButton.js';
import store from '../store';

const SortableItem = sortableElement(({ title, imgsrc, manifesturi, removeCallback }) =>
    < li className={styles.sortitem} >
    <img src={ imgsrc } alt="" height="100"/> <br />
    { title } <br />
    <small> { manifesturi } </small>
    <RemoveButton uri= { manifesturi } removeCallback = { removeCallback } />
    </li >
);

const SortableContainer = sortableContainer(({ children }) => { return <ul > { children } < /ul>; });

class IcList extends Component {

    onSortEnd = ({
        oldIndex,
        newIndex
    }) => {
        const state = store.getState();
        var neu = arrayMove(state.items, oldIndex, newIndex);
        this.props.swapCallback( neu );
        store.dispatch({type: 'SET_ITEMS', items: neu});
        this.forceUpdate();
    };

    constructor(props) {
        super(props);
    }

    render() {
        const state = store.getState();
        // const state = this.props.dingdong;
        // console.log("dingdong")
        // console.log(state)
        // console.log(state.items.length)
        if(state && state.items && state.items.length>0) {
            return ( <>
                <SortableContainer onSortEnd = { this.onSortEnd } > {
                    state.items.map((uri, index) => ( <
                        SortableItem key = { `item-${uri}` }
                        index = { index }
                        title = { state.labels[uri] }
                        imgsrc = { state.thumbs[uri] }
                        manifesturi = { uri }
                        removeCallback = {this.props.removeCallback}
                        />
                    ))
                } </SortableContainer>
                </>
            );
        } else {
            return '';
        }
    }
}

// function mapStateToProps(state) {
//   return { dingdong: state }
// }
//
// export default connect(mapStateToProps)(IcList)

export default IcList
