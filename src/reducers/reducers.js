import {APPLY_DELTA} from '../actions/actions'

function MongoMuseum(state, action) {
    switch (action.type) {
        case APPLY_DELTA: //TODO: find the correct element
            return swapNode(state, action.change);
        default:
            return state;
    }
}

function swapNode(tree, delta) {
    tree.groups.map((group) => {
        if (group.name === delta.name) {
            Object.assign(group, delta);
            return tree;
        }
        group.processes.map((process) => {
            if (process.name === delta.name) {
                Object.assign(process, delta);
                return tree;
            }
            process.services.map((service) => {
                if (service.name === delta.name) {
                    Object.assign(service, delta);
                    return tree;
                }
                return tree;
            })
            return tree;
        });
        return tree;
    });
}

export default MongoMuseum