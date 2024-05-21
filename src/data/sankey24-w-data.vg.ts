export default
{
	"$schema": "https://vega.github.io/schema/vega/v5.json",
	"autosize": {
		"type": "fit",
		"contains": "padding"
	},
	"signals": [
		{
			"name": "width",
			"init": "isFinite(containerSize()[0]) ? containerSize()[0] : 800",
			"on": [
				{
					"update": "isFinite(containerSize()[0]) ? containerSize()[0] : 800",
					"events": "window:resize"
				}
			]
		},
		{
			"name": "height",
			"init": "isFinite(containerSize()[1]) ? containerSize()[1] : 400",
			"on": [
				{
					"update": "isFinite(containerSize()[1]) ? containerSize()[1] : 400",
					"events": "window:resize"
				}
			]
		},
		{
			"name": "fontSize",
			"init": "containerSize()[0]/70",
			"on": [
				{
					"events": "window:resize",
					"update": "containerSize()[0]/70"
				}
			]
		},
		{
			"name": "standardGap",
			"value": 14,
			"description": "Gap as a percentage of full domain"
		},
		{
			"name": "maxValue",
			"init": "data('maxValue')[0].value"
		},
		{
			"name": "spacer",
			"init": "maxValue/(100 * 1.)*standardGap"
		}
	],
	"data": [
		{
			"name": "entries",
			"format": {
				"type": "csv",
				"parse": {
					"category": "string",
					"stack": "number",
					"sort": "number",
					"labels": "string",
					"color": "string"
				}
			},
			"values": "name,category,stack,sort,labels,color\r\nTotal,budget,1,1,left,blue\r\nDirect aid to Ukraine,ukr_total,2,1,left,green\r\nAid for Ukraine or other allies,ally_total,2,2,left,#f2cf5b\r\nMiscellaneous,misc_total,2,3,left,grey\r\nHumanitarian & Economic Aid,ukr_human,3,1,right,#FF69B4\r\nMilitary Aid,ukr_military_total,3,2,left,green\r\nMilitary Aid,ally_military_total,3,3,left,#f2cf5b\r\nMilitary,misc_military_total,3,4,left,grey\r\nUkrainian refugees in US,misc_refugee,3,5,right,grey\r\nAssistance for Europe and Asia,misc_eurasia,3,6,right,grey\r\nOther,misc_other,3,7,right,grey\r\nDeferred aid (USAI & FMF),ukr_usai_total,4,2,right,green\r\nInstant aid (PDA),ally_pda_total,4,3,right,#f2cf5b\r\nDeferred aid (USAI & FMF),ally_fmf_total,4,4,right,#f2cf5b\r\nProcurement,misc_procurement,4,5,right,grey\r\nOperation and Maintenance,misc_operation,4,6,right,grey\r\nOther DoD needs,misc_military_other,4,7,right,grey"
		},
		{
			"name": "connections",
			"format": {
				"type": "csv",
				"parse": {
					"source": "string",
					"destination": "string",
					"value": "number"
				}
			},
			"values": "source,value,destination\r\nbudget,22.021,ukr_total\r\nbudget,9.395,ally_total\r\nbudget,29.360,misc_total\r\nukr_total,13.772,ukr_military_total\r\nukr_total,8.249,ukr_human\r\nally_total,9.395,ally_military_total\r\nmisc_total,26.865,misc_military_total\r\nmisc_total,0.481,misc_refugee\r\nmisc_total,1.575,misc_eurasia\r\nmisc_total,0.439,misc_other\r\nukr_military_total,13.772,ukr_usai_total\r\nally_military_total,7.800,ally_pda_total\r\nally_military_total,1.595,ally_fmf_total\r\nmisc_military_total,18.921,misc_procurement\r\nmisc_military_total,7.057,misc_operation\r\nmisc_military_total,0.887,misc_military_other"
		},
		{
			"name": "preStacks",
			"source": "connections",
			"transform": [
				{
					"type": "formula",
					"as": "end",
					"expr": "['source','destination']"
				},
				{
					"type": "formula",
					"as": "name",
					"expr": "[datum.source,datum.destination]"
				},
				{
					"type": "project",
					"fields": [
						"end",
						"name",
						"value"
					]
				},
				{
					"type": "flatten",
					"fields": [
						"end",
						"name"
					]
				},
				{
					"type": "aggregate",
					"fields": [
						"value"
					],
					"groupby": [
						"end",
						"name"
					],
					"ops": [
						"sum"
					],
					"as": [
						"value"
					]
				},
				{
					"type": "aggregate",
					"fields": [
						"value"
					],
					"groupby": [
						"name"
					],
					"ops": [
						"max"
					],
					"as": [
						"value"
					]
				}
			]
		},
		{
			"name": "stacks",
			"source": "preStacks",
			"transform": [
				{
					"type": "lookup",
					"from": "entries",
					"key": "category",
					"fields": [
						"name"
					],
					"values": [
						"stack",
						"sort",
						"gap",
						"labels",
						"color"
					],
					"as": [
						"stack",
						"sort",
						"gap",
						"labels",
						"color"
					]
				},
				{
					"type": "formula",
					"as": "gap",
					"expr": "datum.gap?datum.gap:0"
				}
			]
		},
		{
			"name": "maxValue",
			"source": [
				"stacks"
			],
			"transform": [
				{
					"type": "aggregate",
					"fields": [
						"value"
					],
					"groupby": [
						"stack"
					],
					"ops": [
						"sum"
					],
					"as": [
						"value"
					]
				},
				{
					"type": "aggregate",
					"fields": [
						"value"
					],
					"ops": [
						"max"
					],
					"as": [
						"value"
					]
				}
			]
		},
		{
			"name": "plottedStacks",
			"source": [
				"stacks"
			],
			"transform": [
				{
					"type": "formula",
					"as": "type",
					"expr": "['data','spacer']"
				},
				{
					"type": "formula",
					"as": "spacedValue",
					"expr": "[datum.value,spacer]"
				},
				{
					"type": "flatten",
					"fields": [
						"type",
						"spacedValue"
					]
				},
				{
					"type": "stack",
					"groupby": [
						"stack"
					],
					"sort": {
						"field": "sort",
						"order": "descending"
					},
					"field": "spacedValue",
					"offset": "center"
				},
				{
					"type": "formula",
					"expr": "((datum.value)/2)+datum.y0",
					"as": "yc"
				}
			]
		},
		{
			"name": "finalTable",
			"source": [
				"plottedStacks"
			],
			"transform": [
				{
					"type": "filter",
					"expr": "datum.type == 'data'"
				}
			]
		},
		{
			"name": "linkTable",
			"source": [
				"connections"
			],
			"transform": [
				{
					"type": "lookup",
					"from": "finalTable",
					"key": "name",
					"values": [
						"y0",
						"y1",
						"stack",
						"sort"
					],
					"fields": [
						"source"
					],
					"as": [
						"sourceStacky0",
						"sourceStacky1",
						"sourceStack",
						"sourceSort"
					]
				},
				{
					"type": "lookup",
					"from": "finalTable",
					"key": "name",
					"values": [
						"y0",
						"y1",
						"stack",
						"sort",
						"color"
					],
					"fields": [
						"destination"
					],
					"as": [
						"destinationStacky0",
						"destinationStacky1",
						"destinationStack",
						"destinationSort",
						"color"
					]
				},
				{
					"type": "stack",
					"groupby": [
						"source"
					],
					"sort": {
						"field": "destinationSort",
						"order": "descending"
					},
					"field": "value",
					"offset": "zero",
					"as": [
						"syi0",
						"syi1"
					]
				},
				{
					"type": "formula",
					"expr": "datum.syi0+datum.sourceStacky0",
					"as": "sy0"
				},
				{
					"type": "formula",
					"expr": "datum.sy0+datum.value",
					"as": "sy1"
				},
				{
					"type": "stack",
					"groupby": [
						"destination"
					],
					"sort": {
						"field": "sourceSort",
						"order": "descending"
					},
					"field": "value",
					"offset": "zero",
					"as": [
						"dyi0",
						"dyi1"
					]
				},
				{
					"type": "formula",
					"expr": "datum.dyi0+datum.destinationStacky0",
					"as": "dy0"
				},
				{
					"type": "formula",
					"expr": "(datum.dy0+datum.value)",
					"as": "dy1"
				},
				{
					"type": "formula",
					"expr": "((datum.value)/2)+datum.sy0",
					"as": "syc"
				},
				{
					"type": "formula",
					"expr": "((datum.value)/2)+datum.dy0",
					"as": "dyc"
				},
				{
					"type": "formula",
					"expr": "range('y')[0]-scale('y', datum.value)",
					"as": "sample"
				},
				{
					"type": "linkpath",
					"orient": "horizontal",
					"shape": "diagonal",
					"sourceY": {
						"expr": "scale('y', datum.syc)"
					},
					"sourceX": {
						"expr": "scale('x', toNumber(datum.sourceStack)) + bandwidth('x')"
					},
					"targetY": {
						"expr": "scale('y', datum.dyc)"
					},
					"targetX": {
						"expr": "scale('x', datum.destinationStack)"
					}
				},
				{
					"type": "formula",
					"expr": "(range('y')[0]-scale('y', datum.value)) / 1.",
					"as": "strokeWidth"
				}
			]
		}
	],
	"scales": [
		{
			"name": "x",
			"type": "band",
			"range": "width",
			"domain": {
				"data": "finalTable",
				"field": "stack"
			},
			"paddingInner": 0.9
		},
		{
			"name": "y",
			"type": "linear",
			"range": "height",
			"domain": {
				"data": "finalTable",
				"field": "y1"
			},
			"reverse": false
		}
	],
	"marks": [
		{
			"type": "rect",
			"from": {
				"data": "finalTable"
			},
			"encode": {
				"update": {
					"x": {
						"scale": "x",
						"field": "stack"
					},
					"width": {
						"scale": "x",
						"band": 1
					},
					"y": {
						"scale": "y",
						"field": "y0"
					},
					"y2": {
						"scale": "y",
						"field": "y1"
					},
					"fill": {
						"field": "color"
					},
					"fillOpacity": {
						"value": 0.75
					},
					"strokeWidth": {
						"value": 0
					},
					"stroke": {
						"field": "color"
					}
				},
				"hover": {
					"_tooltip": {
						"signal": "{'Name':datum.name, 'Value':format(datum.value, '$') + ' B'}"
					},
					"fillOpacity": {
						"value": 1
					}
				}
			}
		},
		{
			"type": "path",
			"name": "links",
			"from": {
				"data": "linkTable"
			},
			"clip": true,
			"encode": {
				"update": {
					"strokeWidth": {
						"field": "strokeWidth"
					},
					"path": {
						"field": "path"
					},
					"strokeOpacity": {
						"signal": "0.3"
					},
					"stroke": {
						"field": "color"
					}
				},
				"hover": {
					"strokeOpacity": {
						"value": 1
					},
					"tooltip": {
						"signal": "format(datum.value, '$') + ' B'"
					}
				}
			}
		},
		{
			"type": "group",
			"name": "labelText",
			"zindex": 1,
			"from": {
				"facet": {
					"data": "finalTable",
					"name": "labelFacet",
					"groupby": [
						"name",
						"stack",
						"yc",
						"value",
						"labels"
					]
				}
			},
			"clip": false,
			"encode": {
				"update": {
					"strokeWidth": {
						"value": 1
					},
					"stroke": {
						"value": "red"
					},
					"x": {
						"signal": "datum.labels=='left'?scale('x', datum.stack) - 8 : scale('x', datum.stack) + (bandwidth('x')) + 8"
					},
					"yc": {
						"scale": "y",
						"signal": "datum.yc"
					},
					"width": {
						"signal": "0"
					},
					"height": {
						"signal": "0"
					},
					"fillOpacity": {
						"signal": "0.1"
					}
				}
			},
			"marks": [
				{
					"type": "text",
					"name": "heading",
					"from": {
						"data": "labelFacet"
					},
					"encode": {
						"update": {
							"x": {
								"value": 0
							},
							"y": {
								"value": -2
							},
							"text": {
								"field": "name"
							},
							"align": {
								"signal": "datum.labels=='left'?'right':'left'"
							},
							"fontWeight": {
								"value": "normal"
							}
						}
					}
				},
				{
					"type": "text",
					"name": "amount",
					"from": {
						"data": "labelFacet"
					},
					"encode": {
						"update": {
							"x": {
								"value": 0
							},
							"y": {
								"signal": "fontSize"
							},
							"text": {
								"signal": " format(datum.value, '$.1f') + ' B'"
							},
							"align": {
								"signal": "datum.labels=='left'?'right':'left'"
							}
						}
					}
				}
			]
		},
		{
			"type": "rect",
			"from": {
				"data": "labelText"
			},
			"encode": {
				"update": {
					"x": {
						"field": "bounds.x1",
						"offset": -4
					},
					"x2": {
						"field": "bounds.x2",
						"offset": 4
					},
					"y": {
						"field": "bounds.y1",
						"offset": -4
					},
					"y2": {
						"field": "bounds.y2",
						"offset": 4
					},
					"fill": {
						"value": "white"
					},
					"opacity": {
						"value": 0.7
					},
					"cornerRadius": {
						"value": 4
					}
				}
			}
		}
	],
	"config": {
		"view": {
			"stroke": "transparent"
		},
		"text": {
			"fontSize": {
				"signal": "fontSize"
			},
			"fill": "#333333"
		}
	}
}