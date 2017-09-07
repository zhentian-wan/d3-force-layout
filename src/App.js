import React, {Component} from 'react';
import logo from './logo.svg';

import './App.css';

import ForceLayoutIntro from './components/ForceLayoutIntro';
import SimpleExample from './components/SimpleExample';
import Throns from './components/Throns';

class App extends Component {
    render() {
        return (
            <div className="App">
                <section>
                    <h2>Game of thrones</h2>
                    <Throns width={960} height={600}/>
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
