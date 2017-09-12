import React, {Component} from 'react';
import * as d3  from 'd3';
import 'd3-geo';
import * as topojson from 'topojson';
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

        svg.append('path')
            .datum(topojson.feature(us, us.objects.states))
            .attr('class', 'land')
            .attr('d', path);

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
