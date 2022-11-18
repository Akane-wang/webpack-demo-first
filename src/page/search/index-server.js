const React = require('react');
require('../../style/search.less');
const logo = require('../../images/aligado.jpeg');

const { a } = require('./tree-shaking');
class Search extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            Text: null
        };
    }
    loadComponent() {
        require('./test.js').then((Text) => {
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
                <div className="search">
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

module.exports = <Search />;
