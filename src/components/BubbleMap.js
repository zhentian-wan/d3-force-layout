import React, {Component} from 'react';
import * as d3  from 'd3';
import 'd3-geo';
import './light.css';
import * as topojson from 'topojson';
import * as colorbrewer from 'colorbrewer';
const us = require('./us.json');



const width = 960;
const height = 600;

class BubbleMap extends Component {
    componentDidMount() {
        const svg = d3.select(this.refs.mountSvg)
            .append('svg')
            .attr('height', height)
            .attr('width', width);

        const radius = d3.scaleSqrt()
            .domain([0, 1000000])
            .range([0, 15]);

        const path = d3.geoPath();

        svg.append('path')
            .datum(topojson.feature(us, us.objects.nation))
            .attr('class', 'land')
            .attr('d', path);

        svg.append('path')
            .datum(topojson.mesh(us, us.objects.states), (a,b) => a!==b)
            .attr('class', 'border state')
            .attr('d', path);

        svg.append("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(
                topojson.feature(us, us.objects.counties)
                    .features
                    // put small bubble on top
                    .sort(function(a, b) {return b.properties.profit - a.properties.profit})
            )
            .enter().append("circle")
            .attr("transform", function(d) {return "translate(" + path.centroid(d) + ")"; })
            .attr("r", d => radius(d.properties.profit))
            .append("title")
            .text(d => `name: ${d.properties.name}, 
            profit: ${parseFloat(d.properties.profit).toFixed(2)}`);
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

export default BubbleMap;
