import React, {Component} from 'react';
import * as d3  from 'd3';

export default class Throns extends Component {

    componentDidMount() {

        d3.csv('../battles.csv', function (data) {
            console.log("error", data);
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