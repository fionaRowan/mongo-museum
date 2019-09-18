export default function generateBoundingForce({ boundingWidth, boundingHeight, boundingRadius, itemRadius }) {
  let cachedNodes;

  function boundingForce(alpha) {
    cachedNodes.forEach(function(node) {
      if (boundingHeight && boundingWidth) {
        node.x = Math.max(itemRadius, Math.min(boundingWidth - itemRadius, node.x));
        node.y = Math.max(itemRadius, Math.min(boundingHeight - itemRadius, node.y));
      } else {
        const p = Math.sqrt(node.x * node.x + node.y * node.y);
        const r = boundingRadius - itemRadius;
        if (p > r) {
          node.x = r / p * node.x;
          node.y = r / p * node.y;
        }
      }
    });
  }

  boundingForce.initialize = function(nodes) {
    if (nodes === undefined) {
      return cachedNodes;
    }

    cachedNodes = nodes;
    return boundingForce;
  }

  return boundingForce;
}
