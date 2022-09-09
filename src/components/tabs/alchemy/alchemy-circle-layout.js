class AlchemyOrbitLayout {
  constructor(tier, radius, angleOffset = 0) {
    this._resources = AlchemyResources.all
      .filter(y => y.config.tier === tier)
      .sort((x, y) => x.config.uiOrder - y.config.uiOrder);
    this._radius = radius;
    this._angleOffset = angleOffset;
  }

  get radius() {
    return this._radius;
  }

  get nodes() {
    const nodes = [];
    const step = Math.PI_2 / this._resources.length;
    let angle = this._angleOffset;
    for (const resource of this._resources) {
      nodes.push({
        resource,
        x: this._radius * Math.sin(angle),
        y: this._radius * Math.cos(angle)
      });
      angle += step;
    }
    return nodes;
  }
}

export class AlchemyCircleLayout {
  constructor() {
    this.orbits = [
      new AlchemyOrbitLayout(1, 4, -Math.PI / 3),
      new AlchemyOrbitLayout(2, 3),
      new AlchemyOrbitLayout(3, 2, Math.PI / 3),
      new AlchemyOrbitLayout(4, 1, -Math.PI / 6),
      new AlchemyOrbitLayout(5, 0)
    ];
    const nodes = [];
    for (const orbitNodes of this.orbits.map(o => o.nodes)) {
      nodes.push(...orbitNodes);
    }
    const size = Math.max(
      nodes.map(p => Math.abs(p.x)).max(),
      nodes.map(p => Math.abs(p.y)).max()
    ) * 2;
    for (const node of nodes) {
      node.x = (node.x / size + 0.5) * 100;
      node.y = (node.y / size + 0.5) * 100;
    }
    const reactionArrows = [];
    for (const reaction of AlchemyReactions.all.compact()) {
      const productNode = nodes
        .find(n => n.resource === reaction.product);
      const reagentNodes = reaction.reagents
        .map(r => nodes.find(n => n.resource === r.resource));
      for (const reagentNode of reagentNodes) {
        reactionArrows.push({
          reaction,
          reagent: reagentNode,
          product: productNode,
        });
      }
    }
    this.reactionArrows = reactionArrows;
    this.nodes = nodes;
    this.size = size;
  }
}
