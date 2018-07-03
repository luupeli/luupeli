import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import '../styles/App.css';
//import styled from 'styled-components';
import { injectGlobal } from 'styled-components';

class Home extends React.Component {


  
  constructor(props) {
    super(props);

 

  

   if (localStorage.getItem('styleIndex') === null) {
     localStorage.setItem('styleIndex', 0)
  }

    this.state = {
      allStyles: [],
      styleIndex:0,
      background:'',
      flairLayerD:'',
      flairLayerC:'',
      flairLayerB:'',
      flairLayerA:'',
      primary:'',
      secondary:'',
      tertiary:'',
      style:'',
    }
    // localStorage.setItem('allStyles','');

    // localStorage.setItem('allStyles', JSON.stringify(this.state.allStyles));   // Array must be converted to JSON before storing it into localStorage!
    
    // this.setState({

    //   styleIndex: 0,
   
      
    // })
    this.changeCss = this.changeCss.bind(this)
    this.proceedToSelect = this.proceedToSelect.bind(this)
  }

  componentWillMount() {
    const themeBloodDragon = {
      style:'blood-dragon',
      background:'background-blood-dragon',
      flairLayerD:'grid-sub',
      flairLayerC:'grid',
      flairLayerB:'grid-flair',
      flairLayerA:'blinder',
      primary:'#ff5db1',
      secondary:'#ff2596',
      tertiary:'#ef007c'
    };
    const themeFallout = {
      style: 'fallout',
      background: 'background-fallout',
      flairLayerD: 'none',
      flairLayerC: 'none',
      flairLayerB: 'none',
      flairLayerA: 'none',
      primary: '#33BB33',
      secondary: '#229922',
      tertiary: '#115511'
    };
    const themeDeepBlue = {
      style: 'deep-blue',
      background: 'background-deep-blue',
      flairLayerD: 'none',
      flairLayerC: 'none',
      flairLayerB: 'none',
      flairLayerA: 'none',
      primary: '#0033BB',
      secondary: '#002299',
      tertiary: '#000055',
    };
    const themeSteel = {
      style: 'steel',
      background: 'background-steel',
      flairLayerD: 'none',
      flairLayerC: 'none',
      flairLayerB: 'none',
      flairLayerA: 'none',
      primary: '#BBBBFF',
      secondary: '9999DD',
      tertiary: '#555599',
    };
  
    this.setState({allStyles: [themeDeepBlue,themeFallout,themeBloodDragon,themeSteel],
      styleIndex:0});
  }
  
  changeCss(event) {
   var next = parseInt(localStorage.getItem('styleIndex'))+1;
    
    
    if (this.state.allStyles[next]!=null) {
      localStorage.setItem('styleIndex', next);
      this.setState({
        styleIndex: next})
        document.body.style.color = "#ffffff"
        document.body.style.background = "#000000"
      }
      else {
        localStorage.setItem('styleIndex', 0);
        this.setState({
          styleIndex: 0})
          document.body.style.color = "#ffffff"
          document.body.style.background = "#000000"
        
        }
      
     
    


    
    window.location.reload();
  }

  proceedToSelect(event) {
    this.setState({ redirect: true })
    this.setState({ redirectTo: '/game' })
  }

  render() {
    if (this.state.redirect) {
			return (
				<Redirect to={{
					pathname: this.state.redirectTo,
					state: {
            allStyles:this.state.allStyles,
            styleIndex:this.state.styleIndex
      		}
				}} />
			)
		}
    

    let i = parseInt(localStorage.getItem('styleIndex'));
 
    
    injectGlobal`
    :root {
      
      --primary: ${this.state.allStyles[i].primary};
      --secondary: ${this.state.allStyles[i].secondary};
      --tertiary: ${this.state.allStyles[i].tertiary};
      }
    }`;

  
    return (


      <div>
        
      <div className={this.state.allStyles[i].background}>
      <div className={this.state.allStyles[i].style}> 
        <div className="App">
          <div className={this.state.allStyles[i].flairLayerA}>
          </div>
          <div className={this.state.allStyles[i].flairLayerB}>
          </div>
          <div className={this.state.allStyles[i].flairLayerC}>
          </div>
          <div className={this.state.allStyles[i].flairLayerD}>
          </div>
          <h1 className="gametitle">Luupeli</h1>
          <div className="btn-group">
            
            <button className="gamelink" onClick={this.proceedToSelect}>Pelaa</button>
            <button >Kirjaudu sisään</button>
            <button>Luo käyttäjätili</button>
            <button onClick={this.changeCss}>Vaihda css</button>
          </div>
        </div>
        </div>
      </div>
      
      </div>
    )
  }
}
export default Home
