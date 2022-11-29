### Remaining todos
* TODO: low priority task: render objects/nodes in the midpoint of edges/links!
* DONT NEED? TODO: scale drawing to 90% of viewport (vertically and horizontally)
* DONT NEED TODO: allow for triangle or rectangular shapes in nodes
* DONT KNOW TODO: change forces so the more force between nodes given more degrees of separation/freedom
* TODO: add dynamic images/drawings/animation along links (gets updated constantly from backend)
* TODO: create a control panel that can do the following:
   * button to toggle physics on/off for the graph
   * pause/unpause button (to pause a process on backend
   * button to slow-down or speed-up backend process (change timestep)
   * button to stop all sources (stop generating new consumables/movables on the backend)
* TODO: control panel at top: movable
* TODO: create generic JSON editor panel - show JSON blob and allow user to edit and save it (there should be ready-made solutions for this)
* TODO: fix viewport too tall(no scrolling !)

### Finished todos
* Cycle between 3 to 5 states for each node.
   * Histogram representing the input queue  (for items at node and waiting to be processed)
   * Histogram representing processing time (for items in process at node - not exactly a queue just time spent being processed)
   * Histogram representing the output queue (items at same node but waiting to leave - to be accepted by another node)
   * Note: these histograms should be updated node-by-node, so as not to re-render whole graph unnecessarily
* Add permanent labels to nodes
* Add permanent icons to nodes (any image url is fine for now)
* On-click node -> show histogram
* Code histogram into metadata toggle
* Add on-hover text (show metadata when hovering over)
* Allow user to toggle on/off nodes self-separating - default is on - if it's off: then user can drag nodes wherever they want 
* Make initial separating force a little stronger, so that nodes are further apart (more spaced out).
* Nodes will "float" outside of viewport, after turning physics on/off
* Efficiently re-render graph nodes/links without re-rendering whole graph.

### Backlog

* Avoid crossing links - https://stackoverflow.com/questions/74453071/avoid-crossing-links
* Rendering is optimization problem, roughly:
  * minimize link crossing/overlap.
  * maximize space between nodes.
  * but keep drawing within container.