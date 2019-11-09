import { createStore, compose } from 'redux'

function reducer(state, action) {
    switch(action.type) {
        case 'ADD_MANIFEST' : {
            var tempitems = state.items
            tempitems.unshift(action.uri)
            return Object.assign({}, state, {
                items: tempitems
            })
        }
        case 'REMOVE_MANIFEST' : {
            var tempitems = state.items
            tempitems = tempitems.filter(function(item) {
                return item !== action.uri
            })
            return Object.assign({}, state, {
                items: tempitems
            })
        }
        case 'LOAD_COLLECTION' : {
            var temp = {}
            for (var key in action.data) {
                if(key !== 'type') {
                    temp[key] = action.data[key]
                }
            }
            return Object.assign({}, state, temp)
        }
        case 'SET_IIIFJSON' : {
            return Object.assign({}, state, {
                v2json: action.v2json
            })
        }
        case 'SET_IIIF' : {
            return Object.assign({}, state, {
                v2: action.v2
            })
        }
        case 'SET_ITEMS' : {
            return Object.assign({}, state, {
                items: action.items
            })
        }
        case 'SET_HEAD': {
            var temp = {}
            temp.v2 = Object.assign({}, state.v2)
            temp.uri = action.uri
            temp.label = action.label
            temp.v2['@id'] = action.uri
            temp.v2['label'] = action.label
            return Object.assign({}, state, temp)
        }
        case 'ENRICH_VIEW' : {
            var temp = {}
            temp.labels = Object.assign({},state.labels)
            temp.thumbs = Object.assign({},state.thumbs)
            temp.labels[action.uri]=action.label
            temp.thumbs[action.uri]=action.thumb
            return Object.assign({}, state, temp)
        }
        default : {
            return state
        }
    }
}

const initial_state = {
    items: [],
    thumbs: [],
    labels: [],
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
)

const store = createStore(reducer, initial_state, enhancers)

export default store
