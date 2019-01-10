<template>
    <div>
        <full-page ref="fullpage" :options="options" id="fullpage">                
            <div class="section" data-anchor="page1" id="section0">
                <h1>Building Your Winning NBA team: <br/> Prepare for the Drafts <br/><small>Te-En Hsu, teh1n18@soton.ac.uk</small></h1>
                <h2>Comparison of Drafted Players in Top 30 Schools</h2>
                <p class="ml-auto">The purpose of this visualization is finding out the data contradicting to the assumptions: 
                    <ol>
                        <li>the higher the draft pick is the better the player's performance is</li>
                        <li>the more drafted players from a college, the better the performance they have</li>
                    </ol>                                        
                </p>
                <p class="ml-auto">Data Source: <a href="https://www.basketball-reference.com/draft/" target="_blank">basketball-refernce</a>, all drafted players from US Colleges (2000 to 2018)</p>
                <p class="small">Please use <a href="https://www.google.com/chrome/" target="_blank">Chrome browser <img src="http://www.iconarchive.com/download/i63349/cornmanthe3rd/plex/Internet-chrome.ico" width="36" height="36" /> </a> for obtaining the best quality.</p>
                <b-button variant="primary" size="small" @click="btnClickPage1">Start Tour</b-button>
            </div>
            <div class="section" data-anchor="page2" id="section1">                
                <Chart1/>
            </div>
            <div class="section" data-anchor="page3" id="section2">
                <h1>International Drafted Players from 2000 to 2018</h1>
                <p>
                    In this visualization, the focus is moved on the international players. <br/>
                    However, it is very difficult to collect their stats before they joined the league because they played for different countries and organizations. <br/>
                    Hence, an explorable feature is added to the visualization strategy of the international players. <br/>
                    At first, a world map is shown on the page and the countries with at least one player drafted by any team are marked with different colours: <br/>
                    red means the number of drafted players in this country is larger than the average number; <br/>
                    light blue means the number of drafted players is smaller than the average number; <br/>
                    and if there is no one in that country was drafted,  <br/>
                    it is coloured with gray. 
                </p>
                <p class="ml-auto">Data Source: <a href="https://www.basketball-reference.com/draft/" target="_blank">basketball-refernce</a>, all international players (2000 to 2018)</p>                
                <b-button variant="primary" size="small" @click="btnClickPage2">Start Tour</b-button>
            </div>
            <div class="section" data-anchor="page4" id="section3">                
                <Chart2 />
            </div>
            <div class="section" data-anchor="page5" id="section4">
                <div class="slide">
                    <h1>Comparison of Stats in the League and Schools </h1>
                    <div>
                        In this section, three basic stats: points, rebounds and assists of all players in the league and their colleges are going to be compared. Only the stats in the last year in the colleges will be considered as stats of college.
                        <h2>Data Sources</h2>
                        <div>
                            <ul>
                                <li><strong>Draft and stats in the league</strong>: <a href="https://www.basketball-refernce.com" target="_blank">Basketball Reference</a></li>
                                <li><strong>Stats in the schools</strong>: <a href="https://www.sports-reference.com/cbb/" target="_blank">College Basketball</a></li>
                            </ul>
                        </div>                        
                    </div>
                    <b-button variant="primary" size="small" @click="btnClickPage3">Start Tour</b-button>
                </div>
            </div>
            <div class="section" data-anchor="page6" id="section5">
               <Chart3 />
            </div>
            <div class="section" data-anchor="page7" id="section6">
               <h3>Source: [<a href="https://github.com/derekhsu/soton-2019-ecs-ds-data-visualization" target="_blank"><img src="http://www.download82.com/images/produse/iconuri/github-desktop.png" /></a>], Licence: <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">GPL <img src="https://upload.wikimedia.org/wikipedia/commons/8/8b/License_icon-gpl-2.svg" width="32" height="32"/></a></h3> 
               <h3>Author: Derek Hsu [<a href="https://github.com/derekhsu" taget="_blank">Github</a>], [<a href="http://blog.derekhsu.net">Blog</a>]</h3>               
            </div>
        </full-page>
    </div>
</template>

<script>

import * as d3 from "d3";
import Chart1 from './Chart1'
import Chart2 from './Chart2'
import Chart3 from './Chart3'
import "fullpage.js/dist/fullpage.min.css"

export default {
    name: "Report",
    components: {
        Chart1,
        Chart2,
        Chart3
    },
    data() {
        var $this=this;
        return {            
            options: {                
                navigation: true,
                anchors: ['page1', 'page2', 'page3', "page4", "page5", "page6", "page7"],
                sectionsColor: [d3.color("LightPink"), '#FFFFFF', d3.color("LightPink"), '#FFFFFF', d3.color("LightPink"), '#FFFFFF', d3.color("LightCyan")],
                continuous: false,
                autoScrolling: true,
                navigationPosition: 'right',
                navigationTooltips: ['Slide 1', 'Visualization 1', 'Slide 2', 'Visualization 2', 'Slide 3', 'Visualization 3', "Notes"],
                afterLoad: function(origin, destination, direction) {
                    // console.log("Origin:");
                    // console.log(origin);

                    // console.log("Destination:");                    
                    // console.log(destination);

                    // console.log("Direction:");
                    // console.log(direction);
                    // if (destination.anchor == "page2") {
                    //     console.log("Start" + $this.$tours);                        
                    //     $this.$tours['page2'].start();
                    // }
                }
            }
        };
    },
    methods: {
        btnClickPage1: function(element) {       
            // console.log(this.$tours);            
            fullpage_api.moveTo('page2');            
            this.$tours['page2'].start();
        },
        btnClickPage2: function(element) {       
            // console.log(this.$tours);            
            fullpage_api.moveTo('page4');            
            this.$tours['page4'].start();
        },        
        btnClickPage3: function(element) {       
            // console.log(this.$tours);            
            fullpage_api.moveTo('page6');            
            this.$tours['page6'].start();
        }
    }
}
</script>
