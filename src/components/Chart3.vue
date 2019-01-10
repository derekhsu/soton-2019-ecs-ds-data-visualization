<template>
    <b-container fluid id="container-chart3">        
        <b-row>
            <b-col class="mx-auto">
                <h1 class="title">The Comparison of Player Stats in the Colleges and the League</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col id="title-points">
                <h2 class="title my-0" >Points</h2>
                <div id="scatter-plot-pts">                    
                    <vue-c3 :handler="handlerPts"></vue-c3>
                </div>
            </b-col><b-col id="title-rebounds">
                <h2 class="title my-0" >Total Rebounds</h2>
                <div id="scatter-plot-trb">
                    <vue-c3 :handler="handlerTrb"></vue-c3>
                </div>
            </b-col>
            <b-col id="title-assists">
                <h2 class="title my-0">Assists</h2>
                <div id="scatter-plot-ast">
                    <vue-c3 :handler="handlerAst"></vue-c3>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <div id="bar-compare" class="my-3">
                    <h2 class="title my-0">Basic Stats</h2>
                    <vue-c3 :handler="handlerComp"></vue-c3>
                </div>
            </b-col>
            <b-col>
                <div id="bar-compare-2" class="my-3">
                    <h2 class="title my-0">Shooting Stats</h2>
                    <vue-c3 :handler="handlerComp2"></vue-c3>                    
                </div>
            </b-col>
            <b-col>                
                <div id="profile" class="my-3" v-if="profile">
                    <h2 class="title my-0">Player Profile</h2>
                    <table>
                        <tr>
                            <th class="text-left">
                                Player Name
                            </th>
                            <td colspan="3">
                                {{profile.Player}}
                            </td>
                        </tr>
                        <tr>
                            <th class="text-left">
                                Conference
                            </th>
                            <td>
                                {{profile.Conf}}
                            </td>                        
                            <th class="text-left">
                                School
                            </th>
                            <td>
                                {{profile.School}}
                            </td>
                        </tr>
                        <tr>
                            <th class="text-left">
                                Draft Pick
                            </th>
                            <td>
                                {{profile.Pk}}
                            </td>
                            <th class="text-left">
                                SOS
                            </th>
                            <td>
                                {{profile.SOS}}
                            </td>
                        </tr>
                        <tr>
                            <th class="text-left">
                                Draft Year
                            </th>
                            <td>
                                {{profile['DRAFT_YEAR']}}
                            </td>
                            <th class="text-left">
                                Years Pro
                            </th>
                            <td>
                                {{profile.Yrs}}
                            </td>
                        </tr>
                    </table>
                </div>
            </b-col>
        </b-row>
        <v-tour name="page6" :steps="steps" :options="{startTimeout: 1000}"></v-tour>
    </b-container>   
</template>

<script>

import Vue from 'vue'
import * as d3 from "d3";
import VueC3 from 'vue-c3';
import { Layout } from 'bootstrap-vue/es/components';
import { Button } from 'bootstrap-vue/es/components';
import legend from 'd3-svg-legend';

export default {
    name: "Chart3",
    components: {
        VueC3
    },
    props: ['showGuide'],
    data() {
        return {
            players: [],
            handlerPts: new Vue(),
            handlerTrb: new Vue(),
            handlerAst: new Vue(),
            handlerComp: new Vue(),
            handlerComp2: new Vue(),
            profile: false,            
            steps: [
                {
                    target: "#section5",
                    content: "Finally, let's compare the stats of the drafted players in the league and schools. ",
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: "#title-points",
                    content: "You can compare their points per game in the colleges and league, you will find it not easy to duplicate their college's stats to the league.",
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: "#title-rebounds",
                    content: "In the stats of total rebounds per game, you will find there is a much obvious trend. In general, high draft picks player can bring their stats into the league",
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: "#title-assists",
                    content: "In the stats of assists per game, you will find that good guards are diffcult to find. Now, you can freely click any point on the plots and see detailed information! Thanks for your browsing, cheers.",
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                }
            ]
        };
    },
    mounted() {

        var $this = this;        

        // $this.preDrawScatter(this.handlerPts, "#scatter-plot-pts", "PTS/G in College", "PTS/G in League", 30, [0,5,10,15,20,25,30]);
        // $this.preDrawScatter(this.handlerTrb, "#scatter-plot-trb", "TRB/G in College", "TRB/G in League", 15, [0,3,6,9,12,15]);
        // $this.preDrawScatter(this.handlerAst, "#scatter-plot-ast", "AST/G in College", "AST/G in League", 10, [0,2,4,6,8,10]);

        const optionsCompare = {
            bindto: "#bar-compare",
            size: {
                width: 350,
                height: 300
            },
            data: {
                x: "Category",
                columns: [

                ],                    
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        fit: true                                                                                
                    },
                    width: 120
                },
                y: {
                    label: "Stats",
                    fit: false,
                    max: 30,
                    tick: {
                        outer: true,
                        values: [0, 5, 10, 15, 20, 25, 30]
                    }
                }
            }
        }

        this.handlerComp.$emit('init', optionsCompare);

        const optionsCompare2 = {
            bindto: "#bar-compare-2",
            size: {
                width: 350,
                height: 300
            },
            data: {
                x: "Category",
                columns: [

                ],                                        
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        fit: true
                    },
                    width: 120                   
                },
                y: {
                    label: "Percentage(%)",                    
                    fit: true,
                    outer: true,
                    max: 100,
                    tick: {
                        outer: true,
                        values: [0, 20, 40, 60, 80, 100]
                    }
                }
            }
        }

        this.handlerComp2.$emit('init', optionsCompare2);

        d3.csv("https://derekhsu.github.io/soton-2019-ecs-ds-data-visualization/dist/nba_college_stats.csv").then((data, error) => {
            
            $this.players = data;

            $this.drawScatter(this.handlerPts, "#scatter-plot-pts", "PTS_C", "PTS.1", "PTS/G in College", "PTS/G in League", 30, [0,5,10,15,20,25,30]);
            $this.drawScatter(this.handlerTrb, "#scatter-plot-trb", "TRB_C", "TRB.1", "TRB/G in College", "TRB/G in League", 15, [0,3,6,9,12,15]);
            $this.drawScatter(this.handlerAst, "#scatter-plot-ast", "AST_C", "AST.1", "AST/G in College", "AST/G in League", 10, [0,2,4,6,8,10]);                        
            
        });
    },
    methods: {
        btnClick: function() {
            this.$tours['page6'].start();
        },
        compareChart: function(name) {            
            var columns;            
            var columnsPercentage;

            this.players.forEach((player)=>{                
                if (player['Player'] == name) {                    
                    this.profile = player;
                    columns = [
                        ['Category', 'PTS/G', 'TRB/G', 'AST/G', 'MP(MIN)/G'],
                        ['College Stats', 
                        parseFloat(player["PTS_C"]), 
                        parseFloat(player['TRB_C']),
                        parseFloat(player['AST_C']),
                        parseFloat(player['MP_C'])],
                        ['League Stats', 
                        parseFloat(player['PTS.1']), 
                        parseFloat(player['TRB.1']),
                        parseFloat(player['AST.1']),
                        parseFloat(player['MP.1'])]
                    ];

                    columnsPercentage = [
                        ['Category', 'FG%', '3PT%', 'FT%'],
                        ['College Stats', 
                        (Number.parseFloat(player['FG%_C'])*100).toFixed(1).toString(), 
                        (Number.parseFloat(player['3P%_C'])*100).toFixed(1).toString(), 
                        (Number.parseFloat(player['FT%_C'])*100).toFixed(1).toString()],
                        ['League Stats', 
                        (Number.parseFloat(player['FG%'])*100).toFixed(1).toString(), 
                        (Number.parseFloat(player['3P%'])*100).toFixed(1).toString(), 
                        (Number.parseFloat(player['FT%'])*100).toFixed(1).toString()]
                    ]
                }
            });
            
            this.handlerComp.$emit("dispatch", (chart) => {
                chart.load({
                    "columns": columns
                });                
                //chart.groups(['College Stats', 'League Stats']);
            });

            this.handlerComp2.$emit("dispatch", (chart) => {
                chart.load({
                    "columns": columnsPercentage
                });
                //chart.groups(['College Stats', 'League Stats']);
            });
            
        },
        
        drawScatter: function(handler, bindto, collegeStatsKey, leagueStatsKey, xlabel, ylabel, ymax, yValues) {
            var $this = this;

            var names = this.players.map((player) => player["Player"]);
            var nameMap = {};
            names.forEach((name) => nameMap[name] = name + "_x");

            var colorScale = d3.scaleLinear()
                .domain([1,16,30,60])
                .range([0, 0.2, 0.4, 0.8]);                           
            
            var columns = [];
            var colors = {};
            this.players.forEach((player) => {
                columns.push([player["Player"] + "_x", player[collegeStatsKey]]);
                columns.push([player["Player"], player[leagueStatsKey]]);
                colors[player['Player']] = d3.interpolateRdYlGn(colorScale(parseInt(player['Pk'])));                
            });                                    
            
            
            const options = {
                "bindto": bindto,
                size: {
                    width: 300,
                    height: 300
                },
                data: {
                    xs: nameMap,
                    "columns": columns,
                    type: 'scatter',
                    onclick: (d, element) => {
                        var columns = $this.compareChart(d.name);                        
                    }, 
                    colors: colors
                },
                axis: {
                    x: {
                        label: xlabel,
                        tick: {
                            fit: false
                        }                        
                    },
                    y: {
                        label: ylabel,     
                        max: ymax,                   
                        min: 0,
                        tick: {
                            values: yValues
                        },
                        padding: {
                            top: 25,
                            bottom: 0
                        }                        
                    }
                },              
                tooltip: {                    
                    contents: (d, defaultTitleFormat, defaultValueFormat, color) => {
                        var name = d[0].name;
                        var college_stats = d[0].x;
                        var league_stats = d[0].value;

                        return "<div class=\"tooltip_points\">" + 
                            name + 
                            "<table>" +
                                "<tr><th>League</th><td>"+ league_stats +"</td></tr>"+
                                "<tr><th>College</th><td>" + college_stats+ "</td></tr>"+
                            "</table>" +
                            "</div>";
                    }
                },
                legend: {
                    show: false
                }                
            }
            
            handler.$emit('init', options);                

            var colorScaleLegend = d3.scaleLinear()
                .domain([1,16,30,60])
                .range([d3.interpolateRdYlGn(0), d3.interpolateRdYlGn(0.2), d3.interpolateRdYlGn(0.4), d3.interpolateRdYlGn(0.8)]);

            var svg = d3.select(bindto+" svg")
                .attr('width', 380)
                .attr("hidth", 380)

            svg.append('g')
                .attr('class', 'legendLinear')
                .attr('transform', 'translate(290, 20)');
            
            var legendLinear = legend.legendColor()
                .labelFormat(d3.format("0d"))
                .shapeWidth(20)
                .orient('horizontal')
                .cells(4)
                .shapeHeight(5)
                .shapeWidth(15)
                .labels([1, 16, 30, 60])
                .scale(colorScaleLegend)
                .classPrefix("nba-")
                .title("Draft Pick");
            
            svg.select(".legendLinear")
                .call(legendLinear);
        }
    }
}
</script>


<style lang="sass">
h1.title 
    font-size: 1.4em
h2.title
    font-size: 1.0em
h3.title
    font-size: 0.5em
.c3-axis-y-label
    font-size: 14px
.c3-axis-x-label
	font-size: 14pt    
.c3-legend-item
    font-size: 12px    
.nba-legendTitle
    font-size: 12pt
.nba-label
    font-size: 10pt
#container-chart3
    min-height: 100%;
    height: 100%;    
.tooltip_points
    background-color: rgba(140, 183, 178, 0.5);
.c3-tooltip
    background-color: rgba(140, 183, 178, 0.5);
</style>
