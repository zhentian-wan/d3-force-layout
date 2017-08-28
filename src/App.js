import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import ForceLayoutIntro from './components/ForceLayoutIntro';
import SimpleExample from './components/SimpleExample';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <section>
                    <h2>Simple Example</h2>
                    <SimpleExample width={960} height={600}></SimpleExample>
                </section>
                <section>
                    <h2>Force Layout intro</h2>
                    <ForceLayoutIntro width={960} height={600}></ForceLayoutIntro>
                </section>

            </div>
        );
    }
}

export default App;
