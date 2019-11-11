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

class ItemList extends Component {

    onSortEnd = ({
        oldIndex,
        newIndex
    }) => {
        var neu = arrayMove(this.props.items, oldIndex, newIndex);
        this.props.swapCallback( neu );
        store.dispatch({type: 'SET_ITEMS', items: neu});
        this.forceUpdate();
    };

    render() {
        if(this.props.items && this.props.items.length>0) {
            return ( <>
                <SortableContainer onSortEnd = { this.onSortEnd } > {
                    this.props.items.map((uri, index) => ( <
                        SortableItem key = { `item-${uri}` }
                        index = { index }
                        title = { this.props.labels[uri] }
                        imgsrc = { this.props.thumbs[uri] }
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

function mapStateToProps(state) {
    return {
        items: state.items,
        labels: state.labels,
        thumbs: state.thumbs
    }
}

export default connect(mapStateToProps)(ItemList)
