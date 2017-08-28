import React, {Component} from 'react';
import * as d3  from 'd3';

const nodesData = [
    {name: 'Alice', id: 0},
    {name: 'Eve', id: 1},
    {name: 'Bob', id: 2}
];

const linksData = [
    {source: 0, target: 1},
    {source: 1, target: 2},
    {source: 2, target: 0}
];

export default class SimpleExample extends Component {

    componentDidMount() {

        const {width, height} = this.props;
        // Create svg inside container
        const svg = d3.select(this.refs.mountSvg)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        // Create Force layout
        const simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));



        // Create node
        const nodes = svg
            .append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(nodesData)
            .enter().append('circle')
            .attr('r', width * 0.05)
            .attr('fill', '#c3c3c3')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
        simulation
            .nodes(nodesData)
            .on('tick', ticked);

        // Create link
        const link = svg
            .append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(linksData)
            .enter().append('line')
            .attr('stroke', '#c2c2c2')
            .attr('stroke-width', d => Math.sqrt(d.value));


        simulation
            .force('link')
            .distance(height / 2)
            .links(linksData);

        function ticked() {
            link
                .attr('x1', (d) => d.source.x)
                .attr('y1', (d) => d.source.y)
                .attr('x2', (d) => d.target.x)
                .attr('y2', (d) => d.target.y);
            nodes
                .attr('cx',(d, i)=> d.x)
                .attr('cy',(d, i)=> d.y);
        }

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