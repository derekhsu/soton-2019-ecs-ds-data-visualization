<template>
	<b-container id="container" fluid>		
		<b-row>
			<b-col>
				<h1 class="title my-0" id="title">International Drafted Players from 2000 to 2018</h1>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<div id="map"></div>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<h2 class="title my-0">WS of the Players in Specified Country</h2>
				<div id="list" class="ml-auto">  
					<vue-c3 :handler="handler"></vue-c3>
				</div>
			</b-col>
			<b-col>
				<span>{{selectedPlayer}}</span>
				<div id="player">
					
				</div>
			</b-col>
		</b-row>
		<v-tour name="page4" :steps="steps" :options="{startTimeout: 1000}">            
		</v-tour>
	</b-container> 
</template>

<script>
import Vue from 'vue'
import * as d3 from "d3";
import VueC3 from 'vue-c3'
import { Layout } from 'bootstrap-vue/es/components';
import { Button } from 'bootstrap-vue/es/components';
import Datamap from 'datamaps';
import legend from 'd3-svg-legend';

export default {
    name: "Chart2",
    components: {
        VueC3
    },
    data() {
        return {
            player: {},
            handler: new Vue(),
            linearMp: d3.scaleLinear().domain([0, 33.9]).range([0, 1]),            
            linearPts: d3.scaleLinear().domain([0, 19,1]).range([0, 1]),
            linearTrb: d3.scaleLinear().domain([0, 10.1]).range([0, 1]),
            linearAst: d3.scaleLinear().domain([0, 7.9]).range([0, 1]),
            linear3pp: d3.scaleLinear().domain([0, 0.5]).range([0, 1]),
			linearfgp: d3.scaleLinear().domain([0, 0.6]).range([0, 1]),
			selectedPlayer: null,
			steps: [
                {
                    'target': '#title',
					'content': 'Welcome to the second section. We are going to review the international players from 2000 to 2018',
					'params': {
						'placement': 'down',
						'enableScrolling': false
					}				
				}, {
					'target': "#map",
					"content": "Select a country colored with red or blue, and view all drafted players from the country and stats",
					'params': {
						'placement': 'top',
						'enableScrolling': false
					}		
				}, {
					"target": "#list",
					"content": "This is a comparsion of all drafted players from these country. If there is a red bar, it means the contribution of this player is minus!<br/>Click any bar to see their stats ranking",
					'params': {
						'placement': 'top',
						'enableScrolling': false
					}	
				}, {
					"target": "#player",
					"content": "Six basic stats, MP/G, AST, 3P%, PTS, FG% and TRB were shown as a radar diagram where number is percentiles of the selected player ranked in all international players.",
					'params': {
						'placement': 'top',
						'enableScrolling': false
					}	
				}
			]
        }
    },
    methods: {       
        getCountryPlayers: function(country) {                        
            return Object.keys(this.player[country]);
        },
        getCountryPlayerWS: function(country) {            
            return this.getCountryPlayers(country).map(name=> {                
                return Object.values(this.player[country][name]['WS'])[0];
            });
		},
		btnClick: function() {
			this.$tours['page2'].start();
		}
    },
    mounted() {      
        var $this = this;

        d3.json("https://derekhsu.github.io/soton-2019-ecs-ds-data-visualization/dist/country_player.json").then((data, error) => {
            $this.player = data;                        
        });
        
        d3.csv("https://derekhsu.github.io/soton-2019-ecs-ds-data-visualization/dist/grouped_international_players.csv").then((data, error) => {
           
            var mean = d3.mean(data, (d)=> {return parseInt(d.count)});

            var result = data.reduce((acc, cur, i) => {               
                acc[cur.country_code] = {
                    "count": cur.count,
                    "fillKey": cur.count >= mean? "gt50": "lt50",
                    "country": cur.Country
                };
                return acc;
            }, {});
                        
            var map = new Datamap({
                scope: 'world',                
                element: document.getElementById('map'),
                projection: 'mercator',
                height: window.innerHeight/2 - 50,
                width: 400,
                fills: {
                    defaultFill: d3.color("gray"),
                    lt50: 'rgba(0,244,244,0.9)',
                    gt50: 'red'
                },
                data: result,
                done: (datamap) => {                    
                    datamap.svg.selectAll('.datamaps-subunit').on('click', (geography) => {
                        // console.log(datamap.options.data[geography.id]);
                        var country = datamap.options.data[geography.id]['country'];                        
                        var players = $this.getCountryPlayers(country);
                        var ws = $this.getCountryPlayerWS(country);
                        
                        players.unshift("Player");
                        ws.unshift("WS");

						// $this.handler.$emit("dispatch", (chart) => {
						// 	chart.load({
						// 		columns: [
						// 			players,
						// 			ws
						// 		]
						// 	});
						// });
                        const options = {
                            size: {
                                width: 700,
                                height: 200
                            },
                            data: {
                                x: 'Player',
                                columns: [
                                    players,
                                    ws
                                ],
								type: 'bar',
								color: (color, d) => {
									if (d.value <= 0) {
										return d3.color("Red");
									} else {
										return color;
									}
								},
                                onclick: (d, element) => {
                                    var name = players[d.x+1];
                                    $this.selectedPlayer = name;
                                    var player = $this.player[country][name];
                                    var pts = Object.values(player['PTS.1'])[0];  
                                    var trb = Object.values(player['TRB.1'])[0];
                                    var ast = Object.values(player['AST.1'])[0];
                                    var threep = Object.values(player['3P%'])[0];
                                    var mp = Object.values(player['MP.1'])[0];
                                    var fgp = Object.values(player['FG%'])[0];

                                    var player_data = [
                                        [                                        
                                            {axis: "PTS", value: $this.linearPts(pts)},
                                            {axis: "TRB", value: $this.linearTrb(trb)},
                                            {axis: "AST", value: $this.linearAst(ast)},
                                            {axis: "3P%", value: $this.linear3pp(threep)},
                                            {axis: "MP", value: $this.linearMp(mp)},
                                            {axis: "FG%", value: $this.linearfgp(fgp)}                                            
                                        ]
                                    ];                                    
                                    
                                    RadarChart("#player", player_data, {
                                        w: 140,
                                        h: 140,
                                        levels: 4,
                                        labelFactor: 1.1,
                                        maxValue: 1
                                    });
                                    
								}								
                            },
                            axis: {
								rotated: true, 
                                x: {
                                    type: 'category',
                                    tick: {
										multiline: true,
										multilineMax: 2,
                                        culling: false,
										outer: false,									
										fit: false						
                                    }
								},
								y: {
									max: 130,
									min: -5,
									tick: {
										values: [0,20,40,60,80,100,120]
									},
									padding: {
										top:0,
										bottom: 0					
									},
									default: [-10, 70]
								}
							},				
							legend: {
								position: 'right'
							}
                        };
                        
                        this.handler.$emit("init", options);
                    });
                }
			});
			
			const options = {
				size: {
					width: 750,
					height: 200
				},
				data: {
					x: 'Player',
					columns: [
						
					],
					type: 'bar',					
				},
				axis: {
					rotated: true,
					x: {
						type: 'category',
						tick: {
							rotate: 10,
							multiline: true,
							culling: false,
							outer: false,
							fit: true
						}
					},
					y: {
						max: 120,
						min: -5,
						tick: {
                            values: [0,20,40,60,80,100,120]
						},
						padding: {
							top:0,
							bottom: 0					
						},
						default: [-5, 100]
					}
				},
				legend: {
					position: 'right'
				}
			};
			
			this.handler.$emit("init", options);

            var ordinal = d3.scaleOrdinal()
                .domain(['Above Average', 'Below Average'])
                .range(['red', 'rgba(0,244,244,0.9)']);

            var svg = d3.select("#map svg");

            svg.append("g")
                .attr("class", "legendOrdinal")
                .attr("transform", "translate(20, 20)");
                        
            var legendOrdinal = legend.legendColor()
                 .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
                 .title("Number of Players")
				 .shapePadding(10)
				 .classPrefix("nba-")
                 .cellFilter(function(d) { return d.label !== "e"})
                 .scale(ordinal);
            
            svg.select('.legendOrdinal')
				.call(legendOrdinal);
						
        });                        
    }
}

function RadarChart(id, data, options) {
	var cfg = {
        w: 600,				//Width of the circle
        h: 600,				//Height of the circle
        margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
        levels: 3,				//How many levels or inner circles should there be drawn
        maxValue: 0, 			//What is the value that the biggest circle will represent
        labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 2, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('.0%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.radialLine()
		.curve(d3.curveCardinalClosed)
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}//RadarChart
</script>

<style lang="sass">
h1.title 
    font-size: 1em
h2.title
    font-size: 0.7em
h3.title
    font-size: 0.5em
.c3-axis-y-label
    font-size: 12px    
.nba-legendTitle
    font-size: 12px
.nba-label
    font-size: 12px   
.c3-axis-y
	.tick
		font-size: 12px
</style>

