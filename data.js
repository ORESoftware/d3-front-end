const data = {
    formation: [
        {
            "name": "A",
            "id": "A",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png",
            "label": "A",
            "connectionsOut": [
                "B", "C"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "F",
            "id": "F",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png",
            "label": "F",
            "connectionsOut": [
                "C"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "B",
            "id": "B",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "https://oyster.ignimgs.com/mediawiki/apis.ign.com/new-super-mario-bros-u/4/48/Yoshi.png",
            "label": "B",
            "connectionsOut": [
                "C"
            ],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
        {
            "name": "C",
            "id": "C",
            "entity": {
                "initialGraphData": true
            },
            "iconUrl": "./images/arrow-sink.svg",
            "label": "C",
            "connectionsOut": [
                "D"
            ],
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
            "iconUrl": "./images/arrow-source.svg",
            "label": "D",
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
            "iconUrl": "./images/noun-up-3815871.svg",
            "label": "E",
            "connectionsOut": [],
            "updateableFields": {
                inc: 1,
                serverUtilization: 1,
                queueHistogram: {},
            }
        },
    ]
};