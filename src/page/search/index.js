import React from 'react';
import ReactDOM from 'react-dom';
import '../../style/search.less';
import logo from '../../images/aligado.jpeg';
import hotUpdate from '../../images/热更新原理示意图.png';

import { a } from './tree-shaking';
class Search extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            Text: null
        };
    }
    loadComponent() {
        import('./test.js').then((Text) => {
            this.setState({
                Text: Text.default
            });
        });
    }
    render() {
        const {Text } = this.state;
        const textA = a();
        return (
            <div>
                <div class="search">
                    { Text ? <Text /> : null }
                    { textA }
                    消灭黄品超
                </div>
                <img
                    // className="unused-css"
                    src={ logo }
                    onClick={ this.loadComponent.bind(this) }
                />
                <img src={ hotUpdate } />

            </div>
        );
    }
}

ReactDOM.render(<Search />, document.getElementById('root'));
