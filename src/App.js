import * as d3 from 'd3';

const App = function _App() {
  const fisherYatesShuffle = function* (deck) {
    for (let i = deck.length - 1; i >= 0; i--) {
      const swapIndex = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[swapIndex]] = [deck[swapIndex], deck[i]];
      yield deck[i];
    }
  };
  const placeLabelsAndIcons = () => {
    const svg = d3.select('svg');

    if (svg) {
      svg.selectAll('text').remove();
      svg.selectAll('image').remove();
      svg.selectAll('foreignObject').remove();

      const gs = svg.selectAll('g').on('click', (d) => {
        histogramShowing = !histogramShowing;
        // console.log(d3.select(this).histogramShowing)
        // d3.select(this).histogramShowing = true
        // d3.select(this)
        //     .style('background', '#ddd')
      });

      // svg.selectAll("g").on("click", d => { console.log("Clicked " + d.histogramShowing); });

      gs.append('image')
        .attr('x', (d) => d.x - d.size)
        .attr('y', (d) => d.y - 1.8 * d.size)
        .attr('width', (d) => d.size / 2)
        .attr('height', (d) => d.size / 2)
        .attr('href', (d) => d.iconUrl);

      // gs.append("text")
      // 	.attr("x", d => d.x + d.size / 2)
      // 	.attr("y", d => d.y - 1.9 * d.size)
      // 	.attr("text-anchor", "middle")
      // 	.text(d => 'ID: ' + d.id);

      gs.append('text')
        .attr('x', (d) => d.x + d.size / 3)
        .attr('y', (d) => d.y - 1.5 * d.size)
        .attr('text-anchor', 'middle')
        .text((d) => 'Name: ' + d.name);

      // gs.append("text")
      // 	.attr("x", d => d.x + d.size / 2)
      // 	.attr("y", d => d.y - 1.1 * d.size)
      //     .attr("text-anchor", "middle")
      // 	.text(d => 'Label: ' + d.label);

      gs.append('foreignObject')
        .attr('x', (d) => d.x - 70)
        .attr('y', (d) => d.y + 1.1 * d.size)
        .style('overflow', 'visible')
        .append('xhtml:div')
        .text((d) =>
          histogramShowing
            ? 'histogram'
            : 'ID: ' + d.id + '\nName: ' + d.name + '\nLabel: ' + d.label
        );
    }
  };
  const colors = [
    'red',
    'blue',
    'indigo',
    'violet',
    'purple',
    'orange',
    'pink',
    'yellow',
    'maroon',
    'black',
  ];

  const width = window.innerWidth;
  const height = window.innerHeight;
  const minRadius = 20;
  // I just made up a formula, but radius should be a function of window size
  // (and eventually number of nodes as well)
  const nodeRadius = Math.max(
    minRadius,
    Math.floor(Math.min(width, height) / 25)
  );
  // console.log("node radius: " + nodeRadius);

  let histogramShowing = false;

  const initialState = {
    colors: [
      'red',
      'blue',
      'indigo',
      'violet',
      'purple',
      'orange',
      'pink',
      'yellow',
      'maroon',
      'black',
    ],
    width: window.innerWidth,
    height: window.innerHeight,
    minRadius: 20,
    nodeRadius: Math.max(minRadius, Math.floor(Math.min(width, height) / 25)),
    histogramShowing: false,
  };

  const run = (nodes, links) => {
    setInterval(() => {
      for (const n of fisherYatesShuffle(nodes)) {
        // update node with id = n.id
        // TODO: dynamically update nodes in network here
        // TODO: down the line, will be updated with websocket conn
      }

      // placeLabelsAndIcons();
    }, 2000);

    d3.select('div#App')
      .append('div')
      // Container class to make it responsive.
      .classed('svg-container', true)
      .append('svg')
      // Responsive SVG needs these 2 attributes and no width and height attr.
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 600 400')
      // Class to make it responsive.
      .classed('svg-content-responsive', true);

    let svg = d3
      .select('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    // append a path marker to svg defs
    svg
      .append('defs')
      .selectAll('marker')
      .data(['dominating'])
      .enter()
      .append('marker')
      .attr('id', (d) => d)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 0)
      .attr('refY', 0)
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5');

    let linkSelection = svg
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      // add marker to line
      .attr('marker-end', (d) => 'url(#dominating)');

    let nodeSelection = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('g')
      .append('circle')
      .attr('r', (d) => d.size)
      .attr('fill', (d) => d.color)
      .attr('img', (d) => d.icon)
      .call(
        d3.drag().on('start', dragStart).on('drag', drag).on('end', dragEnd)
      );

    let simulation = d3.forceSimulation(nodes);

    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('nodes', d3.forceManyBody())
      .force('radial', d3.forceRadial(240, width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(-20 * nodeRadius)) // repulsion should scale with node size
      // .force("collision", d3.forceCollide().radius(100))
      // .force('collide', d3.forceCollide().radius(function(d) {
      //     return d.radius + 150;
      // }))
      // .linkDistance(1)
      .force(
        'links',
        d3
          .forceLink(links)
          .id((d) => d.id)
          // .distance(d => 5 * (d.source.size + d.target.size))
          // TODO force distance between all elements, not just connected ones
          // TODO in fact, force should be greater amongst non-connected elements
          // TODO idea - force should increase as degree of freedom between nodes increases
          .distance((d, a, b) => {
            console.log({ d, a, b });
            return 3 * (d.source.size + d.target.size);
          })
      )
      .on('tick', ticked);

    // function isolate(force, nodeA, nodeB) {
    //     let initialize = force.initialize;
    //     force.initialize = function() {
    //         initialize.call(force, [nodeA, nodeB]);
    //     };
    //     return force;
    // }

    // data.nodes contains all nodes
    // for(let i = 0; i < nodes.length - 1; i++) {
    //     for(let j = i + 1; j < nodes.length; j++) {
    //         simulation.force();
    //     }
    // }

    function ticked() {
      // console.log(simulation.alpha());

      nodeSelection.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

      linkSelection
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      // recalculate and back off the distance
      linkSelection.each(function (d, i, n) {
        // current path length
        const pl = this.getTotalLength();
        // radius of marker head plus def constant
        const mrs = d.source.size;
        const mrt = d.target.size + 12;
        // get new start and end points
        const m1 = this.getPointAtLength(mrs);
        const m2 = this.getPointAtLength(pl - mrt);
        // new line start and end
        d3.select(n[i])
          .attr('x1', m1.x)
          .attr('y1', m1.y)
          .attr('x2', m2.x)
          .attr('y2', m2.y);
      });

      placeLabelsAndIcons();
    }

    function dragStart(event, d) {
      // console.log('drag start');
      simulation.alphaTarget(0.5).restart();
      d.fx = d.x;
      d.fy = d.y;
      placeLabelsAndIcons();
    }

    function drag(event, d) {
      // console.log('dragging', event, d);
      // simulation.alpha(0.5).restart()
      d.fx = event.x;
      d.fy = event.y;
      placeLabelsAndIcons();
      // d.fx = d3.event.x;
      // d.fy = d3.event.y;
    }

    function dragEnd(event, d) {
      // console.log('drag end');
      placeLabelsAndIcons();
      simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      placeLabelsAndIcons();
    }

    d3.select(window).on('resize', resize);

    function resize() {
      let newHeight = window.innerHeight;
      let newWidth = window.innerHeight;

      // There is still a small bug when you resize back up, need to dig in deeper.
      // I think the viewBox has something to do with it.

      d3.select('svg')
        // .attr('viewBox',`0 0 ${newWidth} ${newHeight}`)
        .attr('width', newWidth)
        .attr('height', newHeight);
    }
  };

  const nodes = [];
  const links = [];

  const data = {
    formation: [
      {
        name: 'A',
        id: 'A',
        entity: {
          initialGraphData: true,
        },
        iconUrl:
          'https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png',
        label: 'A',
        connectionsOut: ['B', 'C'],
      },
      {
        name: 'F',
        id: 'F',
        entity: {
          initialGraphData: true,
        },
        iconUrl:
          'https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png',
        label: 'F',
        connectionsOut: ['C'],
      },
      {
        name: 'B',
        id: 'B',
        entity: {
          initialGraphData: true,
        },
        iconUrl:
          'https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png',
        label: 'B',
        connectionsOut: ['C'],
      },
      {
        name: 'C',
        id: 'C',
        entity: {
          initialGraphData: true,
        },
        iconUrl:
          'https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png',
        label: 'C',
        connectionsOut: ['D'],
      },
      {
        name: 'D',
        id: 'D',
        entity: {
          initialGraphData: true,
        },
        iconUrl:
          'https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png',
        label: 'D',
        connectionsOut: ['E'],
      },
      {
        name: 'E',
        id: 'E',
        entity: {
          initialGraphData: true,
        },
        iconUrl:
          'https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png',
        label: 'E',
        connectionsOut: [],
      },
    ],
  };

  if (data.formation) {
    for (const z of data.formation) {
      nodes.push({
        color: colors.shift(),
        size: nodeRadius, // TODO: size should be dynamic/scaled, but with a minimum and maximum size
        label: z.label,
        name: z.name,
        id: z.id,
        iconUrl: z.iconUrl,
        histogram: new Map(),
        // histogramShowing: false
      });

      // we only need-be concerned with connectionsOut, not connectionsIn, in order to complete graph
      for (const targetId of z.connectionsOut) {
        links.push({ source: z.id, target: targetId, ...{ whatever: 'else' } });
      }
    }
  }
  run(nodes, links);
};

export default App;
