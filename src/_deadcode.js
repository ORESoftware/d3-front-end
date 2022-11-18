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
