import React from 'react'
import { Link } from 'react-router-dom'

class SelectGameMode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      style: localStorage.getItem('style')
    }
  }

  render() {

    return (
    <div>
      <div className={"App" + this.state.style}>
        <div className={"grid-sub-faster" + this.state.style}>

        </div>
        <div className={"grid-faster" + this.state.style}>

        </div>
        <div className={"grid-flair" + this.state.style}>

        </div>
        <div className={"blinder" + this.state.style}>

        </div>
        <h2 className={"h2" + this.state.style + " toprow"}>Valitse</h2>
        <h2 className={"h2" + this.state.style + " secondrow"}>Luupelimuoto:</h2>
        <div className={"btn-group" + this.state.style}>
          <Link to='/settings'><button className="writinggame">Kirjoituspeli</button></Link>
          <button>...</button>
          <button>...</button>
        </div>
        </div>
        <div className={"App" + this.state.style}>
          <Link to='/'><button className={"gobackbutton" + this.state.style}>Takaisin</button></Link>
        </div>
      </div>
    )
  }
}

export default SelectGameMode