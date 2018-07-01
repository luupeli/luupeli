import React from 'react'
import { Link } from 'react-router-dom'

<<<<<<< HEAD
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
=======
const SelectGameMode = () => (
	<div>
		<div className="App">
			<div className="grid-sub-faster">
			</div>
			<div className="grid-faster">
			</div>
			<div className="grid-flair">
    	</div>
  		<div className="blinder">
  		</div>
			<h2 className="h2 toprow">Valitse</h2>
			<h2 className="h2 secondrow">Luupelimuoto:</h2>
			<div className="btn-group">
				<Link to='/settings'><button className="writinggame">Kirjoituspeli</button></Link>
				<button>...</button>
				<button>...</button>
			</div>
		</div>
		<div className="App">
			<Link to='/'><button className="gobackbutton">Takaisin</button></Link>
		</div>
	</div>
)
>>>>>>> ccb6db5cec753ddced59e7dc8121f91da453c3a6

export default SelectGameMode