import React from 'react'
import '../styles/App.css';
import { Link } from 'react-router-dom'

const Home = () => (
  
  <div className="App">
  
  
  <div className="grid-sub">
  </div> 
    <div className="grid">
  </div>
  <div className="grid-flair">
  </div>
  <div className="blinder">
  </div>
    <h1 className="h1 gametitle">Luupeli</h1>
    <div className="btn-group">
      <Link className="gamelink" to='/game'><button>Pelaa</button></Link>
      <button>Kirjaudu sisään</button>
      <button>Luo käyttäjätili</button>
      </div>
      </div>
    
  
)

export default Home