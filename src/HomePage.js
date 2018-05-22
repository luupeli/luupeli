import React, { Component } from 'react';
import './styles/HomePage.css';

class HomePage extends Component {
    render() {
        return (
            <div className="HomePage" align="center">
                <h1 className="h1">Luupeli</h1>
                <div className="btn-group">
                    <button>Pelaa</button>
                    <button>Kirjaudu sisään</button>
                    <button>Luo käyttäjätili</button>
                </div>
            </div>
        );
    }
}

export default HomePage;