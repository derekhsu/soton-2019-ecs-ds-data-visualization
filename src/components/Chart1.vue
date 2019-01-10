<template>              
    <b-container fluid id="v-step-0">
        <b-row id="top" class="mx-auto">
            <vue-c3 :handler="handler"></vue-c3>
        </b-row> 
        <b-row id="down" class="mx-auto">
            <vue-c3 :handler="handler2"></vue-c3>
        </b-row>  
        <v-tour name="page2" :steps="steps" :callbacks="tourCallbacks" :options="{startTimeout: 1000}"></v-tour>           
    </b-container>                            
</template>

<script>
import Vue from 'vue'
import * as d3 from "d3";
import VueC3 from 'vue-c3'
import { Layout } from 'bootstrap-vue/es/components';
import { Button } from 'bootstrap-vue/es/components';


Vue.use(Layout);
Vue.use(Button);


export default {
    name: "Chart1",
    components: {
        VueC3
    },
    data() {
        return {
            tourCallbacks: {
                onStop: this.tourStopCallback,
            },
            handler: new Vue(),
            handler2: new Vue(),
            steps: [
                {
                    'target': '#v-step-0',
                    'content': 'This chart will show you the quality of NBA players drafted from the schools in US.',
                    'params': {
						placement: 'bottom',
						enableScrolling: false
					}	
                },                
                {
                    'target': "#v-step-1",
                    'content': "First, these are top 30 schools where produced the most NBA players.",                    
                    'params': {
						'placement': 'bottom',
						'enableScrolling': false
					}	
                },
                {
                    'target': '.legendTitle',
                    "content": "This a measurement of average WS from all drafted players in each schools. <br/> <strong>WS</strong> is an accumulating measurement of contribution of winning to his team from a player in their career."
                },
                {
                    'target': '#v-step-3',
                    'content': 'High school players perform better then other players'
                },
                {
                    'target': '#u-kansas',
                    'content': "KU produced the fourth most players in this period, but the quality is not good as expected."
                },
                {
                    'target': '#u-syracuse',
                    'content': "Thinking about it before you picking players from Syracuse University. Their average WS is one of the worst team in the period."
                },
                {
                    'target': '#u-georgia-tech',
                    'content': "Geroge Tech is worth to play attention. Although they produced fewer players but their quality is really good."
                },
                {
                    'target': '#down-title',
                    'content': "Secondly, these are the average draft picks of all drafted students from the top 30 schools where produced the most NBA players.",
                    'params': {
						'placement': 'top',
						'enableScrolling': false
					}
                },
                {
                    'target': '#u-ut-austin',
                    'content': "UT Austin had very high average picks, and their players played very well as expected.",
                    'params': {
						'placement': 'top',
						'enableScrolling': false
					}
                },
                {
                    'target': '#u-florida',
                    'content': "If you need a high reward at low draft pick, University of Florida is the best choice!",
                    'params': {
						'placement': 'top',
						'enableScrolling': false
					}
                },
                {
                    'target': '#u-ucla',
                    'content': "UCLA is alternative good choice at the low picks as well. <br/> Now, the first section is end. You can freely move mouse on the bars to view the WS, or go to next section.",
                    'params': {
						'placement': 'top',
						'enableScrolling': false
					}
                }
            ]             
        }
    },
    mounted() {
        
        var $this = this;        
        
        d3.csv("https://derekhsu.github.io/soton-2019-ecs-ds-data-visualization/dist/top_30_number_college_ws.csv").then((data, error) => {
            
            var colleges;
            var numbers;
            var mean_ws;
            

            colleges = data.map((item) => {
                return item['College'];
            });
        
            numbers = data.map((item) => {                
                return item['count'];
            });
            
            mean_ws = data.map((item) => {
                return item['mean_ws'];
            });
            colleges.unshift("College");
            numbers.unshift("Number of Graduated Player");                        

            bindto(colleges, numbers, mean_ws, this.handler, "#top", "Number of Drafted Players from Top 30 Schools");
                        
            d3.selectAll('#top svg g.c3-event-rects rect:nth-child(2)').attr("id", "v-step-3");
            d3.selectAll('#top svg g.c3-event-rects rect:nth-child(5)').attr("id", "u-kansas");
            d3.selectAll('#top svg g.c3-event-rects rect:nth-child(8)').attr("id", "u-syracuse");
            d3.selectAll('#top svg g.c3-event-rects rect:nth-child(23)').attr("id", "u-georgia-tech");
            
        });     
        
        d3.csv("https://derekhsu.github.io/soton-2019-ecs-ds-data-visualization/dist/top_30_meanpk_college_ws.csv").then((data, error) => {
            var colleges;
            var picks;
            var mean_ws;

            colleges = data.map((item) => {
                return item['College'];
            });
            picks = data.map((item) => {
                return item['mean_pk'];
            });
            
            mean_ws = data.map((item) => {
                return item['mean_ws'];
            });
            colleges.unshift("College");
            picks.unshift("Average Picks");                        

            bindto(colleges, picks, mean_ws, this.handler2, "#down", "Average Picks of Drafted Players from Top 30 Schools");
            d3.selectAll('#down svg g.c3-event-rects rect:nth-child(2)').attr("id", "u-ut-austin");
            d3.selectAll('#down svg g.c3-event-rects rect:nth-child(3)').attr("id", "u-indiana");
            d3.selectAll('#down svg g.c3-event-rects rect:nth-child(23)').attr("id", "u-florida");
            d3.selectAll('#down svg g.c3-event-rects rect:nth-child(24)').attr("id", "u-ucla");
        });

        // this.$tours['page2'].start();
    }, 
    methods: {
        btnClick: function() {            
            this.$tours['page2'].start();
        },
        tourStopCallback: function(currentStep) {
            //this.$tours['page2'].start();
        }
    }
}

function bindto(colleges, v, mean_ws, handler, bindto, title) {
    const options = {
        "bindto": bindto,
        size: {
            width: 1024,
            height: window.innerHeight / 2 - 50
        },
        padding: {
            top: 20
        },
        data: {
            x: 'College',
            columns: [
                colleges,
                v
            ],
            type: 'bar'
        },
        legend: {
            show: false,
        },
        bar: {
            width: {
                ratio: 0.6
            }
        },
        axis: {
            x: {
                type: 'category',
                tick: {
                    rotate: 90,    
                    fit: true,  
                    multiline: true,
                    multilineMax: 2,                
                    culling: false,
                    outer: false,
                    width: 150
                },
                height: 150
            },
            y: {
                tick: {
                    outer: true,
                    values: [0, 10, 20, 30, 40]
                }
            }
        },
        onrendered: () => {
            
            var min = d3.min(mean_ws, function(d) {return parseFloat(d)});
            var max = d3.max(mean_ws, function(d) {return parseFloat(d)});
            

            var color1 = d3.scaleLinear()
                .domain([min, min+(max-min)/2, max])
                .range([d3.color("DarkBlue"), d3.color("LightBlue"), d3.color("#e0f3db")])
                .interpolate(d3.interpolateRgb);

            var x = d3.select(bindto + " svg g.c3-chart-bars")
                .selectAll("path")
                .data(mean_ws)
                .style("fill", function(d, i) {                         
                    return color1(d);
                });                                    

            var svgLegend = d3.select(bindto + " svg");            
            
            var defs = svgLegend.append('defs');

            var linearGradient = defs.append('linearGradient')
                .attr('id', "linear-gradient");

            linearGradient
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");

            linearGradient.selectAll("stop")
                .data([
                    {offset: "0%", color: d3.color("DarkBlue")},    
                    {offset: "50%", color: d3.color("LightBlue")},                                        
                    {offset: "100%", color: "#e0f3db"}
                ])
                .enter().append("stop")
                .attr("offset", function(d) { 
                    return d.offset; 
                })
                .attr("stop-color", function(d) { 
                    return d.color; 
                });
            
            svgLegend.append("text")
                .attr("class", "legendTitle")
                .attr("x", 820)
                .attr("y", 25)
                .style("text-anchor", "left")                
                .text("Average WS");

            svgLegend.append("text")
                .attr("class", "chartTitle")
                .attr("x", 70)
                .attr("y", 20)
                .attr('id', bindto == "#top"? 'v-step-1': 'down-title')
                .style("text-anchor", "left")                
                .text(title);

            svgLegend.append("rect")
                .attr("x", 820)
                .attr("y", 30)
                .attr("width", 150)
                .attr("height", 10)
                .style("fill", "url(#linear-gradient)");
                      
            var xLeg = d3.scaleLinear()
                .domain([min, max])
                .range([0, 150]);

            var axisLeg = d3.axisBottom(xLeg)
                .tickValues(color1.domain())

            svgLegend
                .attr("class", "axis")
                .append("g")
                .attr("transform", "translate(820, 30)")
                .call(axisLeg);
        }
    };    
    
    handler.$emit("init", options);
}

</script>

<style lang="sass">

.c3-axis-x   
    text
        font-size: 9pt
.legendTitle
    font-size: 12pt
.chartTitle    
    font-size: 2em    
.v-step
    font-size: 1em    
.v-step__button
    font-size: 1em
</style>

