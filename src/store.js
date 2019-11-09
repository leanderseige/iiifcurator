import { createStore, compose } from 'redux';

function reducer(state, action) {
    // console.log(action);
    switch(action.type) {
        case 'ADD_MANIFEST' : {
            var tempitems = state.items;
            tempitems.unshift(action.uri);
            state.items = tempitems;
            return Object.assign({}, state, {
                items: tempitems
            })
        }
        case 'REMOVE_MANIFEST' : {
            var tempitems = state.items;
            tempitems = tempitems.filter(function(item) {
                return item !== action.uri
            })
            state.items = tempitems;
            return state;
        }
        case 'LOAD_COLLECTION' : {
            var temp = {}
            for (var key in action.state) {
                if(key !== 'type') {
                    temp[key] = action.state[key];
                }
            }
            return Object.assign({}, state, temp)
        }
        case 'SET_IIIFJSON' : {
            return Object.assign({}, state, {
                v2json: action.v2json
            })
            // state.v2json = action.v2json;
            // return state;
        }
        case 'SET_IIIF' : {
            state.v2 = action.v2;
            return state;
        }
        case 'SET_ITEMS' : {
            state.items = action.items;
            return state;
        }
        case 'SET_HEAD': {
            state.uri = action.uri;
            state.label = action.label;
            state.v2['@id'] = action.uri;
            state.v2['label'] = action.label;
            return state;
        }
        case 'ENRICH_VIEW' : {
            state.labels[action.uri]=action.label;
            state.thumbs[action.uri]=action.thumb;
            return Object.assign({}, state, action)
            // return state;
        }
        default : {
            return state;
        }
    }
}

const initial_state = {
    items: [],
    thumbs: [],
    labels: [],
    label: '<initial label>',
    v2json: '',
    v2: {
        '@context' : 'http://iiif.io/api/presentation/2/context.json',
        '@id': '',
        '@type': 'sc:Collection',
        'manifests': []
    },
    v3: {
        '@context' : 'http://iiif.io/api/presentation/3/context.json',
        'type': "Collection",
        'items': []
    },
    v3json: '',
}

const enhancers = compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const store = createStore(reducer, initial_state, enhancers);

export default store;
