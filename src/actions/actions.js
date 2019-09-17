export const APPLY_DELTA = "APPLY_DELTA";

export function applyDelta(componentName, newState) {
    return { name: componentName, change: newState};
}