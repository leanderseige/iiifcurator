import React, { Component } from 'react'
import { render } from 'react-dom'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import ReactJson from 'react-json-view'
import styles from './hard.module.css'

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
        return ( <div><pre>{JSON.stringify(this.props.object, null, 2) }</pre></div> );
        // return ( <ReactJson src = { this.props.object } theme="monokai" /> );
    }

}

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
        <label>
          URI:
          <input type="text" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
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
        collectionv2: {
            '@id': 'https://example.com/collection',
            '@context' : 'http://iiif.io/api/presentation/2/context.json',
            '@type': 'sc:Collection',
            'manifests': []
        },
        collectionv3: {
            '@context' : 'http://iiif.io/api/presentation/3/context.json',
            'type': "Collection",
            'items': []
        }


    };

    constructor(props) {
        super(props);
        this.state.m={};
        this.state.n={};
        for (const uri of this.state.items) {
            this.state.m[uri]="<title>";
            this.state.n[uri]="logo192.png";
        }
        this.rebuildCollectionV2 = this.rebuildCollectionV2.bind(this);
        this.rebuildCollectionV2(this.state.items);
    }

    componentDidMount() {
        for (const uri of this.state.items) {
            this.enrich_view(uri);
        }
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
        return(tc2);
    }

    callbackRemoveItem = (uri) => {
        console.log("remove click! "+uri);
        var ti = this.state.items;
        ti = ti.filter(function(item) {
            return item !== uri
        })
        var tc2 = this.rebuildCollectionV2(ti);
        console.log("NEW:");
        console.log(ti);
        console.log(tc2);
        this.setState( { items: ti, collectionv2: tc2 } );
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

    render() {
        return (
            <div className={styles.gridwrap}>
                <div className={styles.headleft}>
                    <InputManifest addCallback={this.callbackAddItem} />
                </div>
                <div className={styles.headright}>
                </div>
                <div className={styles.gridleft}>
                    <IcList m={this.state.m} n={this.state.n} items={this.state.items} swapCallback={this.callbackSwapItems} removeCallback={this.callbackRemoveItem} />
                </div>
                <div className={styles.gridright}>
                    <IcOut object={this.state.collectionv2} />
                </div>
            </div>
        );
    }
}

render( < App / > , document.getElementById('root'));
