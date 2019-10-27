import React, { Component } from 'react'
import { render } from 'react-dom'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import ReactJson from 'react-json-view'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import styles from './hard.module.css'
import InputManifest from './componentInputManifest.js'
import InputCollection from './componentInputCollection.js'
import InputCollectionHead from './componentInputCollectionHead.js'

class Button extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(uri) {
        console.log("click! ");
        console.log("deleting "+this.props.uri);
        this.props.removeCallback(this.props.uri);
    }

    render() {
        return ( < button onClick={this.handleClick}> REMOVE < /button> )
    }
}

const SortableItem = sortableElement(({ title, imgsrc, manifesturi, removeCallback }) => < li className={styles.sortitem} ><img src={ imgsrc } alt="" height="100"/> <br /> { title } <br /> <small> { manifesturi } </small> <Button uri= { manifesturi } removeCallback = { removeCallback } /> </li > );

const SortableContainer = sortableContainer(({ children }) => { return <ul > { children } < /ul>; });

class IcList extends Component {

    onSortEnd = ({
        oldIndex,
        newIndex
    }) => {
        this.props.swapCallback( arrayMove(this.props.items, oldIndex, newIndex) );
    };

    render() {
        const {
            items
        } = this.props;

        return ( <>
            <SortableContainer onSortEnd = { this.onSortEnd } > {
                items.map((value, index) => ( <
                    SortableItem key = { `item-${value}` }
                    index = { index }
                    title = { this.props.m[value] }
                    imgsrc = { this.props.n[value] }
                    manifesturi = { value }
                    removeCallback = {this.props.removeCallback}
                    />
                ))
            } </SortableContainer>
            </>
        );
    }
}

class IcOut extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return ( <div><pre>{ this.props.collectionv2_json }</pre></div> );
        // return ( <ReactJson src = { this.props.object } theme="monokai" /> );
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
        collectionv2_json: '',
        collectionv2: {
            '@context' : 'http://iiif.io/api/presentation/2/context.json',
            '@id': '',
            '@type': 'sc:Collection',
            'manifests': []
        },
        collectionv3: {
            '@context' : 'http://iiif.io/api/presentation/3/context.json',
            'type': "Collection",
            'items': []
        },
        collectionv3_json: '',

    };

    constructor(props) {
        super(props);
        this.state.m={};
        this.state.n={};
        for (const uri of this.state.items) {
            this.state.m[uri]="<title>";
            this.state.n[uri]="logo192.png";
        }
        this.state.collectionv2['@id']=this.props.config['prefix'];
        this.setState( { config: this.props.config } );
        this.setState( { inputCollectionID: this.props.config['prefix'] } );
        this.rebuildCollectionV2 = this.rebuildCollectionV2.bind(this);
        this.rebuildCollectionV2(this.state.items);
    }

    componentDidMount() {
        for (const uri of this.state.items) {
            this.enrich_view(uri);
        }
        this.rebuildCollectionV2(this.state.items);
    }

    enrich_view(uri) {
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

    callbackSwapItems = (childData) => {
        this.rebuildCollectionV2(childData);
      this.setState( { items: childData } );
    }

    rebuildCollectionV2(ti) {
        console.log("rebuildCollectionV2");
        var tc2 = this.state.collectionv2;
        tc2['manifests'] = []
        for(const key in ti) {
            let tm = {};
            tm['@id']=ti[key];
            tm['@type']='sc:Manifest';
            tc2['manifests'].push(tm);
        }
        var tc2_json = JSON.stringify(tc2, null, 2);
        this.setState( { collectionv2_json: tc2_json, collectionv2: tc2 } );
        return(tc2);
    }

    callbackUpdateCollection = (headData) => {
        console.log(headData);
        var tc = {...this.state.collectionv2};
        tc['@id']=headData.inputCollectionID;
        tc['label']=headData.inputCollectionLabel;
        const ordered = {};
        Object.keys(tc).sort().forEach(function(key) {
            ordered[key] = tc[key];
        });
        this.setState( { collectionv2: ordered });
    }

    callbackRemoveItem = (uri) => {
        console.log("remove click! "+uri);
        var ti = this.state.items;
        ti = ti.filter(function(item) {
            return item !== uri
        })
        // var tc2 = this.rebuildCollectionV2(ti);
        // console.log("NEW:");
        // console.log(ti);
        // console.log(tc2);
        this.setState( { items: ti } );
    }

    callbackAddItem = (uri) => {
        if(this.state.items.includes(uri)) {
            alert("already there");
            return;
        }
        var ti = this.state.items;
        ti.unshift(uri);
        this.setState( { items: ti}  );
        this.enrich_view(uri);
        this.rebuildCollectionV2(ti);
    }

    callbackLoadCollection = (uri) => {
        fetch(uri)
            .then(res => res.json())
            .then((data) => {
                var items = [];
                for(const m of data['manifests']) {
                    items.push(m['@id']);
                    this.enrich_view(m['@id']);
                }
                this.setState( { items: items } );
                this.rebuildCollectionV2(items);
            })
            .catch(console.log);
    }

    render() {
        return (
            <div className={styles.gridwrap}>
                <div className={styles.headleft}>
                    <InputCollection loadCallback={this.callbackLoadCollection} />
                    <InputManifest addCallback={this.callbackAddItem} />
                </div>
                <div className={styles.headright}>
                    <InputCollectionHead updateCallback={this.callbackUpdateCollection} config={this.props.config} />
                    <CopyToClipboard text={this.state.collectionv2_json}
                      onCopy={() => this.setState({copied: true})}>
                      <button>COPY</button>
                    </CopyToClipboard>
                </div>
                <div className={styles.gridleft}>
                    <IcList m={this.state.m} n={this.state.n} items={this.state.items} swapCallback={this.callbackSwapItems} removeCallback={this.callbackRemoveItem} />
                </div>
                <div className={styles.gridright}>
                    <IcOut collectionv2_json={this.state.collectionv2_json} />
                </div>
            </div>
        );
    }
}

render( < App config = { {'prefix': 'https://iiif.manducus.net/collections/36c3/manifest.json'} } /> , document.getElementById('root'));
