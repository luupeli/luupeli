import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import '../styles/App.css';
//import styled from 'styled-components';
import { injectGlobal } from 'styled-components';

class Home extends React.Component {

 
  
  constructor(props) {
    super(props);

    this.state = {
      allStyles: [  {
        style:'blood-dragon',
        background:'background-blood-dragon',
        flairLayerD:'grid-sub',
        flairLayerC:'grid',
        flairLayerB:'grid-flair',
        flairLayerA:'blinder',
        primary:'#ff5db1',
        secondary:'#ff2596',
        tertiary:'#ef007c'
      },{
        style: 'fallout',
        background: 'background-fallout',
        flairLayerD: 'none',
        flairLayerC: 'none',
        flairLayerB: 'none',
        flairLayerA: 'none',
        primary: '#33BB33',
        secondary: '#229922',
        tertiary: '#115511'
      },{
        style: 'deep-blue',
        background: 'background-deep-blue',
        flairLayerD: 'none',
        flairLayerC: 'none',
        flairLayerB: 'none',
        flairLayerA: 'none',
        primary: '#0033BB',
        secondary: '#002299',
        tertiary: '#000055',
      }, {
        style: 'steel',
        background: 'background-steel',
        flairLayerD: 'none',
        flairLayerC: 'none',
        flairLayerB: 'none',
        flairLayerA: 'none',
        primary: '#BBBBFF',
        secondary: '9999DD',
        tertiary: '#555599',
      }],
      styleIndex:0,
      style:'blood-dragon',
      background:'background-blood-dragon',
      flairLayerD:'grid-sub',
      flairLayerC:'grid',
      flairLayerB:'grid-flair',
      flairLayerA:'blinder',
      primary:'#ff5db1',
      secondary:'#ff2596',
      tertiary:'#ef007c'
    }

    

    
   if (localStorage.getItem('styleIndex') === null) {
      localStorage.setItem('styleIndex', 0)
  }
    // localStorage.setItem('allStyles','');

    localStorage.setItem('allStyles', JSON.stringify(this.state.allStyles));   // Array must be converted to JSON before storing it into localStorage!
    this.setState({
      styleIndex: 0,
    })
    this.changeCss = this.changeCss.bind(this)
    this.proceedToSelect = this.proceedToSelect.bind(this)
    this.setThemeColors = this.setThemeColors.bind(this)
  }

  // componentWillMount() {
   
  //   const themeBloodDragon = {
  //     style:'blood-dragon',
  //     background:'background-blood-dragon',
  //     flairLayerD:'grid-sub',
  //     flairLayerC:'grid',
  //     flairLayerB:'grid-flair',
  //     flairLayerA:'blinder',
  //     primary:'#ff5db1',
  //     secondary:'#ff2596',
  //     tertiary:'#ef007c'
  //   };
  //   const themeFallout = {
  //     style: 'fallout',
  //     background: 'background-fallout',
  //     flairLayerD: 'none',
  //     flairLayerC: 'none',
  //     flairLayerB: 'none',
  //     flairLayerA: 'none',
  //     primary: '#33BB33',
  //     secondary: '#229922',
  //     tertiary: '#115511'
  //   };
  //   const themeDeepBlue = {
  //     style: 'deep-blue',
  //     background: 'background-deep-blue',
  //     flairLayerD: 'none',
  //     flairLayerC: 'none',
  //     flairLayerB: 'none',
  //     flairLayerA: 'none',
  //     primary: '#0033BB',
  //     secondary: '#002299',
  //     tertiary: '#000055',
  //   };
  //   const themeSteel = {
  //     style: 'steel',
  //     background: 'background-steel',
  //     flairLayerD: 'none',
  //     flairLayerC: 'none',
  //     flairLayerB: 'none',
  //     flairLayerA: 'none',
  //     primary: '#BBBBFF',
  //     secondary: '9999DD',
  //     tertiary: '#555599',
  //   };
  
  //   this.setState({allStyles: [themeDeepBlue,themeFallout,themeBloodDragon,themeSteel]});
  // }
  
  changeCss(event) {
   var next = parseInt(localStorage.getItem('styleIndex'))+1;
    
    
    if (this.state.allStyles[next]!=null) {
      localStorage.setItem('styleIndex', next);
      this.setState({
        styleIndex: next,
        style: 'placeholder-next-theme-name'
      })
        document.body.style.color = "#ffffff"
        document.body.style.background = "#000000"
      }
      else {
        localStorage.setItem('styleIndex', 0);
        this.setState({
          styleIndex: 0,
          style: 'placeholder-last-theme-name'
        })
          document.body.style.color = "#ffffff"
          document.body.style.background = "#000000"
        next=0;
        }
      console.log('new style index is now: '+next)
        // this.setState({

        //   style: this.state.allStyles[next].style,
        //   background: this.state.allStyles[next].background,
        //   flairLayerD: this.state.allStyles[next].flairLayerD,
        //   flairLayerC: this.state.allStyles[next].flairLayerC,
        //   flairLayerB: this.state.allStyles[next].flairLayerB,
        //   flairLayerA: this.state.allStyles[next].flairLayerA,
        //   primary: this.state.allStyles[next].primary,
        //   secondary: this.state.allStyles[next].secondary,
        //   tertiary: this.state.allStyles[next].tertiary
        // })
    
      

    
    window.location.reload();
  }

  proceedToSelect(event) {
    this.setState({ redirect: true })
    this.setState({ redirectTo: '/game' })
  }

  setThemeColors(i) {
    
 
    
    injectGlobal`
    :root {
      
      --primary: ${this.state.primary};
      --secondary: ${this.state.secondary};
      --tertiary: ${this.state.tertiary};
      }
    }`;

    if (this.state.styleIndex!=localStorage.styleIndex && this.state.allStyles[localStorage.styleIndex] !==undefined) {
      this.setState({
        styleIndex: localStorage.styleIndex,
        style: this.state.allStyles[localStorage.styleIndex].style,
        background: this.state.allStyles[localStorage.styleIndex].background,
        flairLayerD: this.state.allStyles[localStorage.styleIndex].flairLayerD,
        flairLayerC: this.state.allStyles[localStorage.styleIndex].flairLayerC,
        flairLayerB: this.state.allStyles[localStorage.styleIndex].flairLayerB,
        flairLayerA: this.state.allStyles[localStorage.styleIndex].flairLayerA,
        primary: this.state.allStyles[localStorage.styleIndex].primary,
        secondary: this.state.allStyles[localStorage.styleIndex].secondary,
        tertiary: this.state.allStyles[localStorage.styleIndex].tertiary
      })
    }


  }

  render() {
    console.log(localStorage.getItem("allStyles"))
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
    this.setThemeColors(i);

  
    return (


      <div>
        
      <div className={this.state.background}>
      <div className={this.state.style}> 
        <div className="App">
          <div className={this.state.flairLayerA}>
          </div>
          <div className={this.state.flairLayerB}>
          </div>
          <div className={this.state.flairLayerC}>
          </div>
          <div className={this.state.flairLayerD}>
          </div>
          <h1 className="gametitle">Luupeli</h1>
          <div id="btn-group" className="btn-group">
            
            <button className="gamelink" onClick={this.proceedToSelect}>Pelaa</button>
            <button >Kirjaudu sisään</button>
            <button>Luo käyttäjätili</button>
            <button className="theme" onClick={this.changeCss}>Vaihda css</button>
            <p>Teema: {this.state.style}</p>
            <div className={this.state.style}/>
          </div>
        </div>
        </div>
      </div>
      
      </div>
    )
  }
}
export default Home
