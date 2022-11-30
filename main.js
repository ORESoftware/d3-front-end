document.turnOnPhysics = () => {
    alert('simulation not yet started.');
};

document.turnOffPhysics = () => {
    alert('simulation not yet started.');
};

document.restartSim = () => {
    alert('simulation not yet started.');
};

document.startSim = () => {
    alert('simulation not yet started.');
};

document.pauseSim = () => {
    alert('simulation not yet started.');
};

document.stopSim = () => {
    alert('simulation not yet started.');
};

const client = new WebSocket('ws://0.0.0.0:5900');

client.addEventListener('message', m => {
    console.log('change event:', m);
    location.reload(); // reload page
});

client.addEventListener('error', e => {
    console.log(e); // we don't want any unnecessary red crap in the browser console
    console.log('start the ws-server using live-reload.js in the project root to get live updates.')
});

// const program = {
//     ctrlKey: false,
//     metaKey: false
// };

// document.onkeydown = (event) => {
//     if (event.key === 'Control') {  // this doesn't really seem to work
//         program.ctrlKey = true;
//     }
//     if (event.key === 'Meta') {
//         program.metaKey = true;
//     }
//     // console.log({program});
// };

// document.onkeyup = (event) => {
//     if (event.key === 'Control') {  // this doesn't really seem to work
//         program.ctrlKey = false;
//     }
//     if (event.key === 'Meta') {
//         program.metaKey = true;
//     }
//     // console.log({program});
// };

const width = window.innerWidth;
const height = window.innerHeight;
const minRadius = 20;
// I just made up a formula, but radius should be a function of window size
// (and eventually number of nodes as well)
const nodeRadius = Math.max(minRadius, Math.floor(Math.min(width, height) / 25));

const displayStates = ["Metadata", "QueueLengthHistogram", "WaitTimeHistogram"];
const getNextDisplayState = function (currentState) {
    let idx = displayStates.findIndex((element) => element == currentState)
    return displayStates[(idx + 1) % displayStates.length];
};

const updateDisplayState = function(div, d) {
    if (d.displayState == "Metadata") {
        div.call(createMetadataText, d);
    }
    if (d.displayState == "QueueLengthHistogram") {
        div.call(createQueueLengthHistograms, d);
    }
    if (d.displayState == "WaitTimeHistogram") {
        div.call(createWaitTimeHistograms, d);
    }
};

const createGraph = function(svg, nodes, links, dragStart, drag, dragEnd) {
    // Create an arrowhead, used by the lines created to represent links.
    svg.append("defs").selectAll("marker")
        .data(["dominating"])
        .enter()
        .append("marker")
            .attr("id", d => d)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 0)
            .attr("refY", 0)
            .attr("markerWidth", 12)
            .attr("markerHeight", 12)
            .attr("orient", "auto")
            .append("path")
                .attr("d", "M0,-5L10,0L0,5");

    // Add lines representing links.
	svg.selectAll("line.link")
		.data(links)
		.enter()
		.append("line")
            .attr("class", "link")
			.attr("stroke", "black")
			.attr("stroke-width", 1)
			// add marker to line
			.attr("marker-end", d => "url(#dominating)");

	// Add groups representing nodes.
	let nodeGroups = svg.selectAll("g.gnode")
		.data(nodes, d => d.id)
		.enter()
		.append("g")
		.attr("class", "gnode");

	// Add circle to each node group.
	nodeGroups.append("circle")
		.attr("r", d => d.size)
		.attr("fill", d => d.color)
		.attr("img", d => d.icon)
		.call(
			d3
				.drag()
				.on("start", dragStart)
				.on("drag", drag)
				.on("end", dragEnd)
		)
        .on("mouseover", function(e, d) {
            // Make the corresponding histogram visible.
            histogramGroups
                .filter(function(d2, i) { return d.id == d2.id;})
                .attr("visibility", "visible");
        })
        .on("mouseout", function(e, d) {
            // Make the corresponding histogram hidden again.
            histogramGroups
                .filter(function(d2, i) { return d.id == d2.id;})
                .attr("visibility", "hidden");
        })
        .on("click", function(e, d) {
            d.displayState = getNextDisplayState(d.displayState);
            let div = histogramGroups
                .selectAll("foreignObject")
                .filter(function(d2, i) { return d.id == d2.id;})
                .select("div")
                .call(updateDisplayState, d);
        });

	// Add an image to each node group.
	nodeGroups.append("image")
		.attr("x", d => -d.size)
		.attr("y", d => -2 * d.size )
		.attr("width", d => d.size / 2)
		.attr("height", d => d.size / 2)
		.attr("href", d => d.iconUrl);

	// Add text to each node group.
	nodeGroups.append("text")
		.attr("x", 0)
		.attr("y", d => -1.5 * d.size)
		.attr("text-anchor", "left")
		.text(d => 'Name: ' + d.name);

    // Create a new group for each histogram.
    // Note: we use a new group (instead of appending to the
    // existing nodeGroups) because SVG elements are ordered based
    // on how they are added to the SVG, and we want the histograms
    // to show up over other nodes and labels.
    let histogramGroups = svg.selectAll("g.ghist")
        .data(nodes, d => d.id)
        .enter()
        .append("g")
            .attr("visibility", "hidden")
            .attr("class", "ghist");

    histogramGroups.append("foreignObject")
        .attr("x", -70)
        .attr("y", d => 1.1 * d.size)
        .attr("height", 100)
        .attr("width", 300)
        .style("overflow", "visible")
        .append("xhtml:div")
            .attr("height", 100)
            .attr("width", 200)
            .call(createMetadataText);
};

const createMetadataText = function(selection) {
    selection.text(data => [
        'Updates:', JSON.stringify(data.updateableFields),
        "\nID: ", data.id,
        "\nName:", data.name,
        '\nLabel:', data.label
    ].join(' '));
}

const getPlaceholderData = (id) => {
    return [9.5, 2, 2.5, 3, 3.3, 4, 5.6, 2.1, 1.7, 7];
};

// Creating a basic histogram: https://d3-graph-gallery.com/graph/histogram_basic.html
const createHistogram = (selection, data, title) => {
    // set the dimensions and margins of the graph
    const margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 200 - margin.left - margin.right,
        height = 120 - margin.top - margin.bottom;

    let histSvg = selection
        .append("svg")
            .attr("class", "histogram")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
    
    // Add a title.
    histSvg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top - 5)
        .text(title);

    // And apply this function to data to get the bins
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d })])
        .range([0, width]);
    histSvg.append("g")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    const histogram = d3.histogram()
        .value(function (d) {
            return d;
        })
        .domain(x.domain())
        .thresholds(x.ticks(5)); // number of bins

    const bins = histogram(data);

    // Y axis: scale and draw:
    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(bins, function (d) { return d.length; })]);
    histSvg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(d3.axisLeft(y).ticks(4));

    // append the bar rectangles to the svg element
    histSvg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function (d) {
                return "translate(" + x(d.x0) + "," + y(d.length) + ")";
            })
            .attr("width", function (d) {
                return Math.max(0, x(d.x1) - x(d.x0) - 1);
            })
            .attr("height", function (d) {
                return height - y(d.length);
            })
            .style("fill", "#69b3a2");
};

const createQueueLengthHistograms = function(selection, d) {
    selection.text("Queue lengths");
    selection.attr("height", 400);

    const data = getPlaceholderData(d.id);
    createHistogram(selection, data, "Input Queue");
    createHistogram(selection, data, "Processing Queue");
    createHistogram(selection, data, "Output Queue");
}

const createWaitTimeHistograms = function(selection, d) {
    if (d.inputQueueTimeWaiting) {
        selection.text("Wait times");
        selection.attr("height", 400);
        createHistogram(selection,  d.inputQueueTimeWaiting.dist, "Input Queue");
        createHistogram(selection,  d.processingQueueTimeWaiting.dist, "Processing Queue");
        createHistogram(selection, d.outputQueueTimeWaiting.dist, "Output Queue");
    } else {
        selection.text("Wait times (placeholder)");
        selection.attr("height", 400);
        const data = getPlaceholderData(d.id);
        createHistogram(selection, data, "Input Queue");
        createHistogram(selection, data, "Processing Queue");
        createHistogram(selection, data, "Output Queue");
    }
}

const updateGraph = function(svg, updatedNodes) {
    // Note: for now, we're assuming that the graph structure is fixed.
    // Eventually, when you add or remove nodes, you can define an
    // "enter" or "exit" function in join to handle those changes.
    // See example:
    // https://observablehq.com/@d3/modifying-a-force-directed-graph
    svg.selectAll("g.gnode")
		.data(updatedNodes, d => d.id)
        .join(
            enter => {},
            update => {
                update.select("text").text(
                    d => "Name: " + d.name + ", inc: " + d.updateableFields.inc
                );
            },
            exit => {}
        );
    svg.selectAll("g.ghist")
        .data(updatedNodes, d => d.id)
        .join(
            enter => {},
            update => {
                update.selectAll("foreignObject")
                    .select("div")
                    .each(function(d, i) {
                        d3.select(this).call(updateDisplayState, d)
                    });
            },
            exit => {}
        );
}

const run = (nodes, links) => {
    setTimeout(() => {

        // TODO: dynamically add a new node/link
        // TODO: this doesn't work yet :/
        return;

        // dynamically add a new node
        nodes.push({
            color: colors[colorIndex++ % nodes.length],
            size: nodeRadius,
            label: 'Z',
            name: 'Z',
            id: 'Z',
            iconUrl: 'https://raw.githubusercontent.com/ORESoftware/d3-front-end/main/images/server-node.svg',
            histogramShowing: false
        });

        // dynamically add a new link
        links.push({
            source: 'Z',
            target: 'E'
        });

    }, 5000);

    setTimeout(() => {

        // list is coming from backend, list will always be about 10-20 objects in an array
        // the main idea is to update the histogram information
        // and to tell the graph how to animate objects going from node A --> node B
        const dataUpdate = [
            {
                "type": "GRAPH_DATA:PROCESSING",
                "m": {  // is just m for message, probably should give it a better name, but will keep it for now
                    "timeStepCount": 108,
                    "id": "D",
                    "rv": {
                        "lambda": 0.1
                    },
                    "queue": {
                        "size": 0
                    },
                    "maxQueueSize": -1,
                    "opts": {
                        "xx": true
                    },
                    "isProcessor": true,
                    "concurrency": 15,
                    "inputQueue": {
                        "size": 2
                    },
                    "processingQueue": {
                        "size": 1
                    },
                    "outQueue": {
                        "size": 0
                    },
                    "totalServerBusyTime": 135000,
                    "totalServerIdleTime": 675000,
                    "processedCount": 270,
                    "inputQueueHistogram": {
                        "0": 44500, // the value is the amount of time spent with queue size = 0
                        "4": 500,  // the value is the amount of time spent with queue size = 4
                        "11": 500, // // the value is the amount of time spent with queue size = 11
                        "15": 4000,
                        "19": 500,
                        "30": 4000
                    },
                    "processingQueueHistogram": {
                        "0": 44500,  // the value is the amount of time spent with queue size = 0
                        "4": 500,   // the value is the amount of time spent with queue size = 4
                        "11": 500,
                        "15": 8500  // interesting that the first 4 values mirror the input queue
                    }
                },
                // NOTE: connection information is fairly static (won't change much over time as simulation proceeds)
                // *however* to represent disconnects we can dynamically route movables and "turn off" a certain destination
                // but I don't see why we would ever need to dynamically *disconnect* nodes, however: we
                // may want to dynamically *connect* one node to another....TBD
                "connectionsIn": {
                    "size": 0,
                    "values": []
                },
                "connectionsOut": {
                    "size": 1,
                    "values": [
                        "A"
                    ]
                },
                // NOTE: movable items represents a count (group by origin) of items from a previous node
                // this is primarily for animating the graph, showing things moving from one node to another
                // this means the animation might be a half-second or full-second behind the simulation,
                // but that should be fine
                "movableItems": {
                    "from": {
                        "A": {
                            "count": 3
                        },
                        "B": {
                            "count": 7
                        },
                        "D": {
                            "count": 6
                        }
                    }
                }
            }
        ];
        let updatedNodes = nodes;
        dataUpdate.forEach(update => {
            let updateId = update.m.id;
            let updateNode = nodes.find(node => { return node.id == updateId });
            // Update (or add) the histogram data.
            updateNode.inputQueueHistogram = update.m.inputQueueHistogram;
            updateNode.processingQueueHistogram = update.m.processingQueueHistogram;
            updateNode.outputQueueHistogram = update.m.outputQueueHistogram;
    
            // Update (or add) the waiting time data.
            updateNode.inputQueueTimeWaiting = update.m.inputQueueTimeWaiting;
            updateNode.processingQueueTimeWaiting = update.m.processingQueueTimeWaiting;
            updateNode.outputQueueTimeWaiting = update.m.outputQueueTimeWaiting;
        });
        updateGraph(svg, updatedNodes);
    }, 3000);

    const svg = d3.select('div#container')
        .append('svg')
        .attr("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight);

    createGraph(svg, nodes, links, dragStart, drag, dragEnd);
    let simulation = d3.forceSimulation(nodes);

    let val = 0;
    setInterval(() => {
        nodes.map((n) => {
            n.updateableFields = {
                ...n.updateableFields,
                // increment some sh*t to force a re-render, or at least to test it out
                inc: ++n.updateableFields.inc
            }
        });
        updateGraph(svg, nodes);
        // Old attempt at updating and re-rendering nodes:
        //     // this doesn't really work to force a re-render
        //     const n = nodes[i];
        //     nodes[i] = Object.assign(n, { // assign new field(s) to *same objects*
        //         updateableFields: {
        //             ...n.updateableFields,
        //         }
        //     });
        // }

        // below is an attempt to update info manually (ideally, only when the data changes)
        // svg
        //     .selectAll("circle")
        //     // .data(nodes) // pass new data seems good idea
        //     .enter()
        //     // .attr("r", d => d.size)
        //     .attr(val++, val)
        //     .attr("fill", d => 'black')

        // simulation.alpha(0.5).restart()
        // placeLabelsAndIcons();
    }, 1000);

    const startSimulation = () => {
        simulation
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("nodes", d3.forceManyBody())
            .force("radial", d3.forceRadial(Math.min(height, width) * 0.35, width / 2, height / 2))
            .force("charge", d3.forceManyBody().strength(-30 * nodeRadius))
            .force("collision", d3.forceCollide().radius(nodeRadius / 2))
            .force(
                "links",
                d3
                    .forceLink(links)
                    .id(d => d.id)
                    // TODO idea - force should increase as degree of freedom between nodes increases
                    .distance((d, a, b) => {
                        // QUESTION: What does this do? seems buggy in my testing
                        // answer -> after turning off/on physics this keeps the nodes separated
                        // return 0.5 * Math.sqrt(
                        //     Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2)
                        // ); 
                        return 3 * (d.source.size + d.target.size)
                    })
            )
            .on("tick", ticked);
    }

    document.turnOnPhysics = () => {
        startSimulation();
    };

    document.turnOffPhysics = () => {
        simulation.stop();
        simulation
            .force("center", null)
            .force("nodes", null)
            .force("radial", null)
            .force("charge", null)
            .force("collision", null)
            .force("links", null);
    };

    document.startSim = () => {
        client.send({startSim: true});
    };

    document.stopSim = () => {
        client.send({stopSim: true});
    };

    document.pauseSim = () => {
        client.send({pauseSim: true});
    };

    document.restartSim = () => {
        client.send({restartSim: true});
    };

    startSimulation();

    function ticked() {
        var nodeGroups = svg.selectAll("g.gnode");
        var histogramGroups = svg.selectAll("g.ghist");
        var linkSelection = svg.selectAll("line.link");

        nodeGroups
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")";
            });

        histogramGroups
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")";
            });

        linkSelection
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        // recalculate and back off the distance
        linkSelection.each(function (d, i, n) {
            // current path length
            const pl = this.getTotalLength();
            // radius of marker head plus def constant
            const mrs = (d.source.size);
            const mrt = (d.target.size) + 12;
            // get new start and end points
            const m1 = this.getPointAtLength(mrs);
            const m2 = this.getPointAtLength(pl - mrt);
            // new line start and end
            d3.select(n[i])
                .attr("x1", m1.x)
                .attr("y1", m1.y)
                .attr("x2", m2.x)
                .attr("y2", m2.y);
        });
    }

    function dragStart(event, d) {
        simulation.alphaTarget(0.5).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function drag(event, d) {
        //prevents node from exceeding horizontal bound
        if (event.x > width - nodeRadius) {
            d.fx = width - nodeRadius
        } else if (event.x < nodeRadius) {
            d.fx = nodeRadius
        } else {
            d.fx = event.x
        }

        //prevents node from exceeding vertical bound
        if (event.y > height - nodeRadius) {
            d.fy = height - nodeRadius;
        } else if (event.y < nodeRadius) {
            d.fy = nodeRadius;
        } else {
            d.fy = event.y;
        }
    }

    function dragEnd(event, d) {
        simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

const nodes = new Map();
const links = new Map();
const linksBySource = new Map();
const linksByTarget = new Map();

if (data.formation) {
    let colorIndex = 0;
    colors = d3["schemeSet1"]
    for (const z of data.formation) {
        // TODO: are there are any pre-ordained fields for rendering images or labels in nodes?
        nodes.set(z.id, {
            color: colors[colorIndex++ % colors.length],
            size: nodeRadius,
            label: z.label,
            name: z.name,
            id: z.id,
            iconUrl: z.iconUrl,
            displayState: displayStates[0],
            updateableFields: z.updateableFields
        });

        // note: in order to complete graph, we only need-be concerned with connectionsOut, not connectionsIn
        for (const targetId of z.connectionsOut) {
            // TODO: are there are any pre-built fields for rendering images or labels in links?
            const linkValue = {source: z.id, target: targetId, ...{whatever: 'else'}};
            links.set([z.id, targetId].join('-'), linkValue);
            linksBySource.set(z.id, linkValue);
            linksByTarget.set(targetId, linkValue);
        }
    }

    run(Array.from(nodes.values()),
        Array.from(links.values())
    );
}