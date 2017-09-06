import React, {Component} from 'react';
import * as d3  from 'd3';
const url = require('../battles.csv');

export default class Throns extends Component {

    componentDidMount() {
        const {
            width,
            height
        } = this.props;

        d3.csv(url, (links) => {

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

            const simulation = d3.forceSimulation()
                .force('link', d3.forceLink().id(function (d) {
                    return d.name;
                }))
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(width / 2, height / 2));

            const svg = d3.select(this.refs.mountSvg)
                .append('svg')
                .attr('height', height)
                .attr('width', width);

            const path = svg
                .append('g')
                .selectAll('path')
                .data(links)
                .enter().append('path')
                .attr('fill', 'none')
                .attr('stroke', '#777')
                .attr('stroke-width', '2px')
                .attr('class', 'link');

            const svgNodes = svg
                .append('g')
                .attr('class', 'nodes')
                .selectAll('circle')
                .data(d3.values(nodes))
                .enter().append('g');

            svgNodes
                .append('image')
                .attr('xlink:href', d => `/static/media/${d.name.toLowerCase()}.png`)
                .attr('x', -25)
                .attr('y', -25)
                .attr('height', 50)
                .attr('width', 50);

            simulation
                .nodes(d3.values(nodes))
                .on('tick', ticked);

            simulation
                .force('link')
                .distance(100) //lineDistance in v3
                .links(links);

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            function ticked() {
                svgNodes
                    .attr('transform', d =>`translate(${d.x},${d.y})`)
                    .call(d3.drag()
                        .on('start', dragstarted)
                        .on('drag', dragged)
                        .on('end', dragended));

                path
                    .attr('d', (d, i) => {
                        const dx = d.target.x - d.source.x;
                        const dy = d.target.y - d.source.y;
                        const dr = Math.sqrt(dx * dx + dy * dy);
                        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
                    })
            }
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