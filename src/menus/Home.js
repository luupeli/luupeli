import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/App.css';

<<<<<<< HEAD

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //style is fetched from localstorage
      style: localStorage.getItem('style')
    }
    this.changeCss = this.changeCss.bind(this)
  }

  //Temporary solution, changes css to "bl" (blank, doesn't exist), otherwise to "bd" (the main theme). Changing body doesn't work currently.
  changeCss(event) {
    if (this.state.style === 'bl') {
      localStorage.setItem('style', 'bd')
      this.state = {
        style: localStorage.getItem('style')
      }
      document.body.style.color = "#ffffff"
      document.body.style.background = "#000000"
    } else {
      localStorage.setItem('style', 'bl')
      this.state = {
        style: localStorage.getItem('style')
      }
      document.body.style.color = "#000000"
      document.body.style.background = "#ffffff"
    }
    console.log(this.state.style)
    window.location.reload();
  }


  render() {
    
    return (
      <div>
        <div className={"App" + this.state.style}>
        <div className={"grid-sub" + this.state.style}>

        </div> 
        <div className={"grid" + this.state.style}>
=======
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
>>>>>>> ccb6db5cec753ddced59e7dc8121f91da453c3a6

        </div>
        <div className={"grid-flair" + this.state.style}>

        </div>
        <div className={"blinder" + this.state.style}>

        </div>
        <h1 className={"h1" + this.state.style + " gametitle"}>Luupeli</h1>
        <div className={"btn-group" + this.state.style}>
          <Link className="gamelink" to='/game'><button>Pelaa</button></Link>
          <button>Kirjaudu sisään</button>
          <button>Luo käyttäjätili</button>
          <button onClick={this.changeCss}>Vaihda css</button>
          </div>
        </div>
      </div>
    )
  }
}
export default Home