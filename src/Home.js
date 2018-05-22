import React from 'react'
import './styles/Home.css';
import { Link } from 'react-router-dom'

const Home = () => (
  <div className="Home" align="center">
    <h1 className="h1">Luupeli</h1>
    <div className="btn-group">
      <Link to='/writinggame'><button>Pelaa</button></Link>
      <button>Kirjaudu sisään</button>
      <button>Luo käyttäjätili</button>
    </div>
  </div>
)

export default Home