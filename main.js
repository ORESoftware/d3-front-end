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


const colors = [
    'red',
    'blue',
    'brown',
    'indigo',
    '#B2B000',
    'purple',
    '#0000FF',
    '#F80F8F',
    // 'orange',
    // 'pink',
    // 'yellow',
    'maroon',
    '#00008B',
    'black',
    // 'magenta',
    'green',
    'gray',
    'violet'
];


const width = window.innerWidth;
const height = window.innerHeight;
const minRadius = 20;
// I just made up a formula, but radius should be a function of window size
// (and eventually number of nodes as well)
const nodeRadius = Math.max(minRadius, Math.floor(Math.min(width, height) / 25));
// console.log("node radius: " + nodeRadius);

let histogramShowing = false;

const placeLabelsAndIconsById = (id) => {
    // TODO: re-render single node/link just by id
};

const placeLabelsAndIcons = () => {

    // note this functionality updates all nodes/links
    // we want a way to update one-at-a-time for efficiency's sake

    const svg = d3.select("svg");

    if (!svg) {
        console.error('missing svg element.');
        return;
    }

    svg.selectAll("text").remove();
    svg.selectAll("image").remove();
    svg.selectAll("foreignObject").remove();

    const gs = svg.selectAll("g")
        .on('click', e => {
            //TODO: kind of a kludge here, there must be a way to access it cleaner?
            e.target.__data__.histogramShowing = !e.target.__data__.histogramShowing;
            if (e.target.__data__.histogramShowing) {
                e.target.parentElement.classList.add('show-histogram');
            } else {
                e.target.parentElement.classList.remove("show-histogram");
            }
        });

    // svg.selectAll("g").on("click", d => { console.log("Clicked " + d.histogramShowing); });

    gs.append("image")
        .attr("x", d => d.x - d.size)
        .attr("y", d => d.y - 1.8 * d.size)
        .attr("width", d => d.size / 2)
        .attr("height", d => d.size / 2)
        .attr("href", d => d.iconUrl);

    gs.append("text")
        .attr("x", d => d.x + d.size / 3)
        .attr("y", d => d.y - 1.5 * d.size)
        .attr("text-anchor", "middle")
        .attr("font-weight",function(d,i) {return i*100+100;})
        .text(d => 'Name: ' + d.name);

    let divs = gs.append("foreignObject")
        .attr("x", d => d.x - 70)
        .attr("y", d => d.y + 1.1 * d.size)
        .style("overflow", "visible")
        .append("xhtml:div")
        .text(d => d.histogramShowing ? "histogram" : [
            'Updates:', JSON.stringify(d.updateableFields),
            "\nID: ", d.id,
            "\nName:", d.name,
            '\nLabel:', d.label
        ].join(' '));

    for (const div of divs._groups[0]) {
        div.appendChild(getAndCacheHistogram(div.id));
    }
};

const histoCache = {};  // we can use a Set/Map if we want to get a fancy
const addToHistoCache = (id, value) => {
    histoCache[id] = value;
    return true;
};
const getHistoData = (id) => {
    return [{val: 9.5}, {val: 2}, {val: 2.5}, {val: 3}, {val: 3.3},
        {val: 4}, {val: 5.6}, {val: 2.1}, {val: 1.7}, {val: 7}];
};
const getAndCacheHistogram = (id) => {
    addToHistoCache(id, createHistogram(id));
    return histoCache[id];
};

// Creating a basic histogram: https://d3-graph-gallery.com/graph/histogram_basic.html
const createHistogram = (id) => {
    const data = getHistoData(id);

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 10, bottom: 10, left: 0},
        width = 120 - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom;

    let histSvg = d3.select("div#secret")
        .append("svg")
        .attr("class", "histogram")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    histSvg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // And apply this function to data to get the bins
    const x = d3.scaleLinear()
        .domain([0, 10])     // can use this instead of 10 to have the max of data: d3.max(data, function(d) { return +d.value })
        .range([0, width]);
    histSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    const histogram = d3.histogram()
        .value(function (d) {
            return d.val;
        })
        .domain(x.domain())
        .thresholds(x.ticks(10)); // number of bins

    const bins = histogram(data);

    // Y axis: scale and draw:
    const y = d3.scaleLinear()
        .range([height, 0]);
    y.domain([0, d3.max(bins, function (d) {
        return d.length;
    })]);
    histSvg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    histSvg.selectAll("rect")
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

    return histSvg.node();
};

const run = (nodes, links) => {

    // setTimeout(() => {

    //     // TODO: dynamically add a new node/link
    //     // TODO: this doesn't work yet :/
    //     return;

    //     // dynamically add a new node
    //     nodes.push({
    //         color: colors[colorIndex++ % nodes.length],
    //         size: nodeRadius,
    //         label: 'Z',
    //         name: 'Z',
    //         id: 'Z',
    //         iconUrl: 'https://raw.githubusercontent.com/ORESoftware/d3-front-end/main/images/server-node.svg',
    //         histogramShowing: false
    //     });

    //     // dynamically add a new link
    //     links.push({
    //         source: 'Z',
    //         target: 'E'
    //     });

    // }, 5000);

    const updateGraph = (list) => {
        // list is array of objects
    };

    setTimeout(() => {

        // list is coming from backend, list will always be about 10-20 objects in an array
        // the main idea is to update the histogram information
        // and to tell the graph how to animate objects going from node A --> node B

        updateGraph([
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
        ])

    }, 3000);

    const svg = d3.select('div#container')
        .append('svg')
        .attr("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight)
    // .classed("svg-content", true);


    // append a path marker to svg defs
    svg.append("defs").selectAll("marker")
        .data(["dominating"])
        .enter().append("marker")
        .attr("id", d => d)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 0)
        .attr("refY", 0)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    let linkSelection = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        // add marker to line
        .attr("marker-end", d => "url(#dominating)");


    let nodeSelection = svg
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("g")
        .append("circle")
        .attr("r", d => d.size)
        .attr("fill", d => d.color)
        .attr("img", d => d.icon)
        .call(
            d3
                .drag()
                .on("start", dragStart)
                .on("drag", drag)
                .on("end", dragEnd)
        );

    let simulation = d3.forceSimulation(nodes);

    let val = 0;
    setInterval(() => {

        // console.log('udpating A...');

        for (let i = 0; i < nodes.length; i++) {
            // this doesn't really work to force a re-render
            const n = nodes[i];
            nodes[i] = Object.assign(n, { // assign new field(s) to *same objects*
                updateableFields: {
                    ...n.updateableFields,
                    // increment some sh*t to force a re-render, or at least to test it out
                    inc: ++n.updateableFields.inc
                }
            });
        }

        // below is an attempt to update info manually (ideally, only when the data changes)
        svg
            .selectAll("circle")
            // .data(nodes) // pass new data seems good idea
            .enter()
            // .attr("r", d => d.size)
            .attr(val++, val)
            .attr("fill", d => 'black')

        // simulation.alpha(0.5).restart()
        // placeLabelsAndIcons();
    }, 1000);

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

    document.turnOnPhysics = () => {
        startSimulation();
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

    startSimulation();

    // data.nodes contains all nodes
    // for(let i = 0; i < nodes.length - 1; i++) {
    //     for(let j = i + 1; j < nodes.length; j++) {
    //         simulation.force();
    //     }
    // }

    function ticked() {
        // console.log(simulation.alpha());

        nodeSelection.attr("cx", d => d.x).attr("cy", d => d.y);

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

        placeLabelsAndIcons();
    }

    function dragStart(event, d) {
        // console.log('drag start');
        simulation.alphaTarget(0.5).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function drag(event, d) {
        // console.log('dragging', event, d);
        // simulation.alpha(0.5).restart()

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
        // console.log('drag end');
        simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        placeLabelsAndIcons();
    }
}


const nodes = new Map();
const links = new Map();
const linksBySource = new Map();
const linksByTarget = new Map();

const data = {
    formation: [
        {
            "name": "main-source",
            "id": "main-source",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png",
            "label": "main-source",
            "connectionsOut": [
                "S"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "S",
            "id": "S",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png",
            "label": "S",
            "connectionsOut": [
                "E"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "E",
            "id": "E",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png",
            "label": "E",
            "connectionsOut": [
                "I-P"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "I-P",
            "id": "I-P",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png",
            "label": "I-P",
            "connectionsOut": [
                "I-P-Decision"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "I-P-Decision",
            "id": "I-P-Decision",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/arrow-sink.svg",
            "label": "I-P-Decision",
            "connectionsOut": [
                "I-A","I-S"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "I-A",
            "id": "I-A",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/arrow-source.svg",
            "label": "I-A",
            "connectionsOut": [
                "R"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "I-S",
            "id": "I-S",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/arrow-source.svg",
            "label": "I-S",
            "connectionsOut": [
                "I-S-Decision"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "I-S-Decision",
            "id": "I-S-Decision",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/arrow-source.svg",
            "label": "I-S",
            "connectionsOut": [
                "R","I-H"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "I-H",
            "id": "I-H",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/arrow-source.svg",
            "label": "I-H",
            "connectionsOut": [
                "I-H-Decision"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "I-H-Decision",
            "id": "I-H-Decision",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/arrow-source.svg",
            "label": "I-H-Decision",
            "connectionsOut": [
                "R","D"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "R",
            "id": "R",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/noun-up-3815871.svg",
            "label": "R",
            "connectionsOut": [
                "Delay-Process"
            ]
            ,
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "Delay-Process",
            "id": "Delay-Process",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/noun-up-3815871.svg",
            "label": "Delay-Process",
            "connectionsOut": [
                "S"
            ]
            ,
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "D",
            "id": "D",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/noun-up-3815871.svg",
            "label": "D",
            "connectionsOut": [
                "main-sink"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "main-sink",
            "id": "main-sink",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/noun-up-3815871.svg",
            "label": "main-sink",
            "connectionsOut": [],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },

    ]
};


let colorIndex = nodes.size - 1;


if (data.formation) {

    let linknum = 0;
    let linkindex = 0;

    for (const z of data.formation) {

        // TODO: are there are any pre-ordained fields for rendering images or labels in nodes?
        nodes.set(z.id, {
            color: colors[colorIndex++ % nodes.size],
            size: nodeRadius,
            label: z.label,
            name: z.name,
            id: z.id,
            iconUrl: z.iconUrl,
            histogramShowing: false,
            updateableFields: z.updateableFields
        });

        // note: in order to complete graph, we only need-be concerned with connectionsOut, not connectionsIn
        for (const targetId of z.connectionsOut) {
            // TODO: are there are any pre-built fields for rendering images or labels in links?
            const linkValue = {
                source: z.id,
                target: targetId,
                linkindex: linkindex++, // linkindex / linknum seem advisable according to:
                linknum: linknum++,  //https://itecnote.com/tecnote/javascript-how-to-add-an-arrow-links-in-d3-js/
                ...{whatever: 'else'}
            };

            links.set([z.id, targetId].join('-'), linkValue);
            linksBySource.set(z.id, linkValue);
            linksByTarget.set(targetId, linkValue);
        }
    }

    run(
        Array.from(nodes.values()),
        Array.from(links.values())
    );
}