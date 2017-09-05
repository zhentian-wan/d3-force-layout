import React, {Component} from 'react';
import * as d3  from 'd3';
const url = require('../battles.csv');

export default class Throns extends Component {

    componentDidMount() {

        d3.csv(url, function (links) {

            // create empty nodes array
            var nodes = {};

            // compute nodes from links data
            links.forEach(function(link) {
                link.source = nodes[link.source] ||
                    (nodes[link.source] = {name: link.source});
                link.target = nodes[link.target] ||
                    (nodes[link.target] = {name: link.target});
                link.value = +link.value;
            });


            // log to console for debugging
            console.log(JSON.stringify(links, null, 4));
            console.log('nodes:');
            console.log(JSON.stringify(nodes, null, 4));
        });

    }


    render() {
        const {width, height} = this.props;
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