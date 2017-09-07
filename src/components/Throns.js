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

            const hovercard = d3.select('body')
                .append('div')
                .attr('class', 'hovercard')
                .style('opacity', 0)
                .style('width', 400);


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

            // Create arrow pointer
            svg.append('defs').selectAll('marker')
                .data(['end']).enter()
                .append('marker')
                .attr('id', String)
                .attr('viewBox', '0 -5 10 10') // start at 0, -5, width 10, height 10
                .attr('refX', 24)
                .attr('refY', -1)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .attr('fill', '#404040')
                .append('path')
                .attr('d', "M0,5L10,0L0,-5");

            // create path
            const path = svg
                .append('g')
                .selectAll('path')
                .data(links)
                .enter().append('path')
                .attr('fill', 'none')
                .attr('stroke-width', '2px')
                .attr('marker-end', 'url(#end)') // link arrow marker to the path
                .attr('class', d => {
                    return 'link '+d.attacker_outcome; // add class 'link loss' or 'link win'
                });

            // Create container for the images
            const svgNodes = svg
                .append('g')
                .attr('class', 'nodes')
                .selectAll('circle')
                .data(d3.values(nodes))
                .enter().append('g');

            // Add image to the nodes
            svgNodes
                .append('image')
                .attr('xlink:href', d => `/static/media/${d.name.toLowerCase()}.png`)
                .attr('x', -25)
                .attr('y', -25)
                .attr('height', 50)
                .attr('width', 50);

            svgNodes
                .append("text")
                .attr('text-anchor', 'middle')
                .attr('dy', '.35em')
                .attr('y', -30)
                .attr('class', 'label')
                .text(d => d.name);

            // nodes
            simulation
                .nodes(d3.values(nodes))
                .on('tick', ticked);

            // links
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

                // adjust nodes containers position
                svgNodes
                    .attr('transform', d =>`translate(${d.x},${d.y})`)
                    .call(d3.drag()
                        .on('start', dragstarted)
                        .on('drag', dragged)
                        .on('end', dragended));


                // Curve paths
                path
                    .attr('d', (d) => {
                        const curve = d.battle_number * .5;
                        const dx = d.target.x - d.source.x;
                        const dy = d.target.y - d.source.y;
                        const dr = Math.sqrt(dx * dx * curve + dy * dy * curve);
                        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
                    });

                path.on('mouseover', d => {

                    hovercard
                        .transition()
                        .duration(300)
                        .delay(20)
                        .style('opacity', 1);

                    const tip =
                        '<h2>' + d.name + '</h2>' +
                        '<h4>' + d.source.name + ' attacked ' + d.target.name + ' and the outcome was a ' + d.attacker_outcome + '</h4>' +
                        '<h3>Details</h3>' +
                        '<strong> Attacker King: </strong>'+d.attacker_king + '<br/>'+
                        '<strong> Battle Type: </strong>'+d.battle_type + '<br/>'+
                        '<strong> Major Death?: </strong>'+d.major_death + '<br/>'+
                        '<strong> Major Capture?: </strong>'+d.major_capture + '<br/>'+
                        '<strong> Attacker Size: </strong>'+d.value + '<br/>'+
                        '<strong> Defender Size: </strong>'+d.defender_size + '<br/>'+
                        '<strong> Region / Location: </strong>'+d.region+ ' / ' + d.location + '<br/>'+
                        '<strong> Attacking Commander: </strong>'+d.attacker_commander + '<br/>'+
                        '<strong> Defending Commander: </strong>'+d.defender_commander;

                    hovercard
                        .html(tip)
                        .style('left', d3.event.pageX + 'px')
                        .style('top', d3.event.pageY + 'px');
                });

                path.on('mouseout', d => {
                    hovercard
                        .transition()
                        .duration(500)
                        .style('opacity', 0);
                });


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