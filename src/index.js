import React, { Component } from 'react'
import { render } from 'react-dom'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import ReactJson from 'react-json-view'
import styles from './hard.module.css'

const SortableItem = sortableElement(({ v1, v2, v3 }) => < li className={styles.sortitem} ><img src={ v2 } alt="" height="100"/> <br /> { v1 } <br /> <small> { v3 } </small> < button > - < /button></li > );

const SortableContainer = sortableContainer(({ children }) => { return <ul > { children } < /ul>; });

class IcList extends Component {

    onSortEnd = ({
        oldIndex,
        newIndex
    }) => {
        this.props.parentCallback( arrayMove(this.props.items, oldIndex, newIndex) );
        console.log(this.props.items);
    };

    render() {
        const {
            items
        } = this.props;

        return ( <>
            <SortableContainer onSortEnd = { this.onSortEnd } > {
                items.map((value, index) => ( <
                    SortableItem key = {
                        `item-${value}`
                    }
                    index = {
                        index
                    }
                    v1  = {
                        this.props.m[value]
                    }
                    v2 = {
                        this.props.n[value]
                    }
                    v3 = {
                        value
                    }
                    />
                ))
            } </SortableContainer>
            </>
        );
    }
}

class IcOut extends Component {
    render() {
        return (
            <ReactJson src = { this.props.items } theme="monokai" />
        );
    }
}

class App extends Component {

    state = {
        items: [
            'https://ids.si.edu/ids/manifest/CHSDM-126197_01',
            'https://ids.si.edu/ids/manifest/SAAM-1913.7.1_2',
            'https://ids.si.edu/ids/manifest/SAAM-1969.53.2_1',
            'https://ids.si.edu/ids/manifest/SAAM-1967.56.28_1',
            'https://ids.si.edu/ids/manifest/SAAM-LC002278',
            'https://ids.si.edu/ids/manifest/FS-7513_23',
            'https://ids.si.edu/ids/manifest/SAAM-1968.9.100_1',
            'https://ids.si.edu/ids/manifest/SAAM-1970.355.780_2',
            'https://ids.si.edu/ids/manifest/FS-7812_01',
            'https://ids.si.edu/ids/manifest/CHSDM-23415_01',
            'https://iiif.manducus.net/manifests/0009/7dd9cb5e72e1f8bc77eae8c913b9ac22a3ef7cb3/manifest.json',
            'https://iiif.manducus.net/manifests/0009/269c6143297887a9733b129577b9f4b5b705f3e3/manifest.json'
        ],
        collection: []
    };

    constructor(props) {
        super(props);
        this.state.m={};
        this.state.n={};
        for (const uri of this.state.items) {
            this.state.m[uri]="abc";
            this.state.n[uri]="logo192.png";
        }
    }

    componentDidMount() {
        for (const uri of this.state.items) {
            fetch(uri)
                .then(res => res.json())
                .then((data) => {
                    let tm = this.state.m;
                    let tn = this.state.n;
                    tm[uri] = data.label;
                    tn[uri] = data['sequences'][0]['canvases'][0]['images'][0]['resource']['service']['@id']+"/full/200,/0/default.jpg";
                    this.setState({m:tm,n:tn});
                })
                .catch(console.log);
        }
    }

    callbackFunction = (childData) => {
      this.setState( { items: childData } )
    }

    render() {
        return (
            <div className={styles.gridwrap}>
            <div className={styles.gridleft}>
            <IcList m={this.state.m} n={this.state.n} items={this.state.items} parentCallback = {this.callbackFunction} />
            </div>
            <div className={styles.gridright}>
            <IcOut items={this.state.items} />
            </div>
            </div>
        );
    }
}

render( < App / > , document.getElementById('root'));
