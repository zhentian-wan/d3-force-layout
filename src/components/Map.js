import React, {Component} from 'react';
import * as d3  from 'd3';
import 'd3-geo';
import * as topojson from 'topojson';
import * as colorbrewer from 'colorbrewer';
const us = require('./us.json');


const width = 960;
const height = 600;

class Map extends Component {
    componentDidMount() {
        const svg = d3.select(this.refs.mountSvg)
            .append('svg')
            .attr('height', height)
            .attr('width', width);


        const path = d3.geoPath();
        var color = d3.scaleLinear()
            .domain([-100000, 500000])
            .range(colorbrewer.Greens[6]);

        svg.append('path')
            .datum(topojson.feature(us, us.objects.nation))
            .attr('class', 'land')
            .attr('d', path);

        svg.append('path')
            .datum(topojson.mesh(us, us.objects.states), (a,b) => a!==b)
            .attr('class', 'border state')
            .attr('d', path);

        svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("class", "county")
            .attr("d", path)
            //add color
            .attr("fill", function(d) {
                const profit = d.properties.profit;
                if(profit) {
                    return color(d.properties.profit);
                }
            })

    }

    render() {
        const style = {
            width,
            height,
            border: '1px solid black',
            margin: '10px auto'
        };
        return (
            <div style={style} ref="mountSvg"></div>
        );
    }
}

export default Map;
