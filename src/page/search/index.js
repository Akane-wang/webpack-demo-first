import React from 'react';
import ReactDOM from 'react-dom';
import '../../style/search.less';
import logo from '../../images/aligado.jpeg';

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
                    src={ logo }
                    onClick={ this.loadComponent.bind(this) }
                />
            </div>
        );
    }
}

ReactDOM.render(<Search />, document.getElementById('root'));
