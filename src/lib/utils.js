export let dummyNodes = {
	"nodes": [
		{
			"id": "A", "group": 1, "out": [4],
			"data": [
				{ "label": "Status", "value": true },
				{ "label": "In", "value": 12 },
				{ "label": "Processing", "value": "starting" },
				{ "label": "Out", "value": 15 },
				// ...
				{ "label": "foo", "value": "bar" },
				{ "label": "hello", "value": "world" }
			]
		},
		{
			"id": "B", "group": 2, "out": [3, 5],
			"data": [
				{ "label": "Status", "value": false },
				{ "label": "In", "value": 32 },
				{ "label": "Processing", "value": "finished" },
				{ "label": "Out", "value": 47 },
				// ...
				{ "label": "foo", "value": "bar" },
				{ "label": "hello", "value": "world" }
			]
		},
		{
			"id": "C", "group": 3, "out": [1, 2],
			"data": [
				{ "label": "Status", "value": true },
				{ "label": "In", "value": 5 },
				{ "label": "Processing", "value": "starting" },
				{ "label": "Out", "value": 2 },
				// ...
				{ "label": "foo", "value": "bar" },
				{ "label": "hello", "value": "world" }
			]
		},
		{
			"id": "D", "group": 4, "out": [6],
			"data": [
				{ "label": "Status", "value": true },
				{ "label": "In", "value": 90 },
				{ "label": "Processing", "value": "in progress" },
				{ "label": "Out", "value": 64 },
				// ...
				{ "label": "foo", "value": "bar" },
				{ "label": "hello", "value": "world" }
			]
		},
		{ "id": "E", "group": 4 },
		{ "id": "F", "group": 4 },
		{ "id": "G", "group": 4 },
		{
			"id": "H", "group": 5, "out": [2, 7],
			"data": [
				{ "label": "Status", "value": false },
				{ "label": "In", "value": 17 },
				{ "label": "Processing", "value": "starting" },
				{ "label": "Out", "value": 74 },
				// ...
				{ "label": "foo", "value": "bar" },
				{ "label": "hello", "value": "world" }
			]
		},
		{ "id": "I", "group": 5 },
		{ "id": "J", "group": 5 },
		{ "id": "K", "group": 6 },
		{ "id": "L", "group": 6 },
		{ "id": "M", "group": 7 },
		{ "id": "N", "group": 7 },
		{ "id": "O", "group": 7 },
	]
}
export let lesMis = {
	"nodes": [
		{
			"id": "Myriel",
			"group": 1,
			"out": [1]
		},
		{
			"id": "Napoleon",
			"group": 1
		},
		{
			"id": "Mlle.Baptistine",
			"group": 1
		},
		{
			"id": "Mme.Magloire",
			"group": 1,
			"out": [
				"Mlle.Baptistine"
			]
		},
		{
			"id": "CountessdeLo",
			"group": 1
		},
		{
			"id": "Geborand",
			"group": 1
		},
		{
			"id": "Champtercier",
			"group": 1
		},
		{
			"id": "Cravatte",
			"group": 1
		},
		{
			"id": "Count",
			"group": 1
		},
		{
			"id": "OldMan",
			"group": 1
		},
		{
			"id": "Labarre",
			"group": 2
		},
		{
			"id": "Valjean",
			"group": 2,
			"out": [
				"Labarre",
				"Mme.Magloire",
				"Mlle.Baptistine"
			]
		},
		{
			"id": "Marguerite",
			"group": 3,
			"out": [
				"Valjean"
			]
		},
		{
			"id": "Mme.deR",
			"group": 2,
			"out": [
				"Valjean"
			]
		},
		{
			"id": "Isabeau",
			"group": 2,
			"out": [
				"Valjean"
			]
		},
		{
			"id": "Gervais",
			"group": 2,
			"out": [
				"Valjean"
			]
		},
		{
			"id": "Tholomyes",
			"group": 3
		},
		{
			"id": "Listolier",
			"group": 3,
			"out": [
				"Tholomyes"
			]
		},
		{
			"id": "Fameuil",
			"group": 3,
			"out": [
				"Tholomyes",
				"Listolier"
			]
		},
		{
			"id": "Blacheville",
			"group": 3,
			"out": [
				"Tholomyes",
				"Listolier",
				"Fameuil"
			]
		},
		{
			"id": "Favourite",
			"group": 3,
			"out": [
				"Tholomyes",
				"Listolier",
				"Fameuil",
				"Blacheville"
			]
		},
		{
			"id": "Dahlia",
			"group": 3,
			"out": [
				"Tholomyes",
				"Listolier",
				"Fameuil",
				"Blacheville",
				"Favourite"
			]
		},
		{
			"id": "Zephine",
			"group": 3,
			"out": [
				"Tholomyes",
				"Listolier",
				"Fameuil",
				"Blacheville",
				"Favourite",
				"Dahlia"
			]
		},
		{
			"id": "Fantine",
			"group": 3,
			"out": [
				"Tholomyes",
				"Listolier",
				"Fameuil",
				"Blacheville",
				"Favourite",
				"Dahlia",
				"Zephine",
				"Marguerite",
				"Valjean"
			]
		},
		{
			"id": "Mme.Thenardier",
			"group": 4,
			"out": [
				"Fantine",
				"Valjean"
			]
		},
		{
			"id": "Thenardier",
			"group": 4,
			"out": [
				"Mme.Thenardier",
				"Fantine",
				"Valjean"
			]
		},
		{
			"id": "Cosette",
			"group": 5,
			"out": [
				"Mme.Thenardier",
				"Valjean",
				"Tholomyes",
				"Thenardier"
			]
		},
		{
			"id": "Javert",
			"group": 4,
			"out": [
				"Valjean",
				"Fantine",
				"Thenardier",
				"Mme.Thenardier",
				"Cosette"
			]
		},
		{
			"id": "Fauchelevent",
			"group": 0,
			"out": [
				"Valjean",
				"Javert"
			]
		},
		{
			"id": "Bamatabois",
			"group": 2,
			"out": [
				"Fantine",
				"Javert",
				"Valjean"
			]
		},
		{
			"id": "Perpetue",
			"group": 3,
			"out": [
				"Fantine"
			]
		},
		{
			"id": "Simplice",
			"group": 2,
			"out": [
				"Perpetue",
				"Valjean",
				"Fantine",
				"Javert"
			]
		},
		{
			"id": "Scaufflaire",
			"group": 2,
			"out": [
				"Valjean"
			]
		},
		{
			"id": "Woman1",
			"group": 2,
			"out": [
				"Valjean",
				"Javert"
			]
		},
		{
			"id": "Judge",
			"group": 2,
			"out": [
				"Valjean",
				"Bamatabois"
			]
		},
		{
			"id": "Champmathieu",
			"group": 2,
			"out": [
				"Valjean",
				"Judge",
				"Bamatabois"
			]
		},
		{
			"id": "Brevet",
			"group": 2,
			"out": [
				"Judge",
				"Champmathieu",
				"Valjean",
				"Bamatabois"
			]
		},
		{
			"id": "Chenildieu",
			"group": 2,
			"out": [
				"Judge",
				"Champmathieu",
				"Brevet",
				"Valjean",
				"Bamatabois"
			]
		},
		{
			"id": "Cochepaille",
			"group": 2,
			"out": [
				"Judge",
				"Champmathieu",
				"Brevet",
				"Chenildieu",
				"Valjean",
				"Bamatabois"
			]
		},
		{
			"id": "Pontmercy",
			"group": 4,
			"out": [
				"Thenardier"
			]
		},
		{
			"id": "Boulatruelle",
			"group": 6,
			"out": [
				"Thenardier"
			]
		},
		{
			"id": "Eponine",
			"group": 4,
			"out": [
				"Mme.Thenardier",
				"Thenardier"
			]
		},
		{
			"id": "Anzelma",
			"group": 4,
			"out": [
				"Eponine",
				"Thenardier",
				"Mme.Thenardier"
			]
		},
		{
			"id": "Woman2",
			"group": 5,
			"out": [
				"Valjean",
				"Cosette",
				"Javert"
			]
		},
		{
			"id": "MotherInnocent",
			"group": 0,
			"out": [
				"Fauchelevent",
				"Valjean"
			]
		},
		{
			"id": "Gribier",
			"group": 0,
			"out": [
				"Fauchelevent"
			]
		},
		{
			"id": "Jondrette",
			"group": 7
		},
		{
			"id": "Mme.Burgon",
			"group": 7,
			"out": [
				"Jondrette"
			]
		},
		{
			"id": "Gavroche",
			"group": 8,
			"out": [
				"Mme.Burgon",
				"Thenardier",
				"Javert",
				"Valjean"
			]
		},
		{
			"id": "Gillenormand",
			"group": 5,
			"out": [
				"Cosette",
				"Valjean"
			]
		},
		{
			"id": "Magnon",
			"group": 5,
			"out": [
				"Gillenormand",
				"Mme.Thenardier"
			]
		},
		{
			"id": "Mlle.Gillenormand",
			"group": 5,
			"out": [
				"Gillenormand",
				"Cosette",
				"Valjean"
			]
		},
		{
			"id": "Mme.Pontmercy",
			"group": 5,
			"out": [
				"Mlle.Gillenormand",
				"Pontmercy"
			]
		},
		{
			"id": "Mlle.Vaubois",
			"group": 5,
			"out": [
				"Mlle.Gillenormand"
			]
		},
		{
			"id": "Lt.Gillenormand",
			"group": 5,
			"out": [
				"Mlle.Gillenormand",
				"Gillenormand",
				"Cosette"
			]
		},
		{
			"id": "Marius",
			"group": 8,
			"out": [
				"Mlle.Gillenormand",
				"Gillenormand",
				"Pontmercy",
				"Lt.Gillenormand",
				"Cosette",
				"Valjean",
				"Tholomyes",
				"Thenardier",
				"Eponine",
				"Gavroche"
			]
		},
		{
			"id": "BaronessT",
			"group": 5,
			"out": [
				"Gillenormand",
				"Marius"
			]
		},
		{
			"id": "Mabeuf",
			"group": 8,
			"out": [
				"Marius",
				"Eponine",
				"Gavroche"
			]
		},
		{
			"id": "Enjolras",
			"group": 8,
			"out": [
				"Marius",
				"Gavroche",
				"Javert",
				"Mabeuf",
				"Valjean"
			]
		},
		{
			"id": "Combeferre",
			"group": 8,
			"out": [
				"Enjolras",
				"Marius",
				"Gavroche",
				"Mabeuf"
			]
		},
		{
			"id": "Prouvaire",
			"group": 8,
			"out": [
				"Gavroche",
				"Enjolras",
				"Combeferre"
			]
		},
		{
			"id": "Feuilly",
			"group": 8,
			"out": [
				"Gavroche",
				"Enjolras",
				"Prouvaire",
				"Combeferre",
				"Mabeuf",
				"Marius"
			]
		},
		{
			"id": "Courfeyrac",
			"group": 8,
			"out": [
				"Marius",
				"Enjolras",
				"Combeferre",
				"Gavroche",
				"Mabeuf",
				"Eponine",
				"Feuilly",
				"Prouvaire"
			]
		},
		{
			"id": "Bahorel",
			"group": 8,
			"out": [
				"Combeferre",
				"Gavroche",
				"Courfeyrac",
				"Mabeuf",
				"Enjolras",
				"Feuilly",
				"Prouvaire",
				"Marius"
			]
		},
		{
			"id": "Bossuet",
			"group": 8,
			"out": [
				"Marius",
				"Courfeyrac",
				"Gavroche",
				"Bahorel",
				"Enjolras",
				"Feuilly",
				"Prouvaire",
				"Combeferre",
				"Mabeuf",
				"Valjean"
			]
		},
		{
			"id": "Joly",
			"group": 8,
			"out": [
				"Bahorel",
				"Bossuet",
				"Gavroche",
				"Courfeyrac",
				"Enjolras",
				"Feuilly",
				"Prouvaire",
				"Combeferre",
				"Mabeuf",
				"Marius"
			]
		},
		{
			"id": "Grantaire",
			"group": 8,
			"out": [
				"Bossuet",
				"Enjolras",
				"Combeferre",
				"Courfeyrac",
				"Joly",
				"Gavroche",
				"Bahorel",
				"Feuilly",
				"Prouvaire"
			]
		},
		{
			"id": "MotherPlutarch",
			"group": 9,
			"out": [
				"Mabeuf"
			]
		},
		{
			"id": "Gueulemer",
			"group": 4,
			"out": [
				"Thenardier",
				"Valjean",
				"Mme.Thenardier",
				"Javert",
				"Gavroche",
				"Eponine"
			]
		},
		{
			"id": "Babet",
			"group": 4,
			"out": [
				"Thenardier",
				"Gueulemer",
				"Valjean",
				"Mme.Thenardier",
				"Javert",
				"Gavroche",
				"Eponine"
			]
		},
		{
			"id": "Claquesous",
			"group": 4,
			"out": [
				"Thenardier",
				"Babet",
				"Gueulemer",
				"Valjean",
				"Mme.Thenardier",
				"Javert",
				"Eponine",
				"Enjolras"
			]
		},
		{
			"id": "Montparnasse",
			"group": 4,
			"out": [
				"Javert",
				"Babet",
				"Gueulemer",
				"Claquesous",
				"Valjean",
				"Gavroche",
				"Eponine",
				"Thenardier"
			]
		},
		{
			"id": "Toussaint",
			"group": 5,
			"out": [
				"Cosette",
				"Javert",
				"Valjean"
			]
		},
		{
			"id": "Child1",
			"group": 10,
			"out": [
				"Gavroche"
			]
		},
		{
			"id": "Child2",
			"group": 10,
			"out": [
				"Gavroche",
				"Child1"
			]
		},
		{
			"id": "Brujon",
			"group": 4,
			"out": [
				"Babet",
				"Gueulemer",
				"Thenardier",
				"Gavroche",
				"Eponine",
				"Claquesous",
				"Montparnasse"
			]
		},
		{
			"id": "Mme.Hucheloup",
			"group": 8,
			"out": [
				"Bossuet",
				"Joly",
				"Grantaire",
				"Bahorel",
				"Courfeyrac",
				"Gavroche",
				"Enjolras"
			]
		}
	]
}