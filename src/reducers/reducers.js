import {APPLY_DELTA} from '../actions/actions'

function MongoMuseum(state, action) {
    switch (action.type) {
        case APPLY_DELTA: //TODO: find the correct element
            return Object.assign(state, action.newState);
        default:
            return state;
    }
}

export default MongoMuseum