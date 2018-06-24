import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class BoneListing extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			bones:  []
		}
	}
	
	
	//GET list of bones from database and stuff it into this.state.bones for rendering
	componentDidMount() {
		const url = 'http://luupeli-backend.herokuapp.com/api/bones/'
		axios.get(url)
		.then((response) => {
			this.setState({ bones: response.data })
		})
		.catch((error) => {
			console.log(error)
		})
	}
	
	//Render bone listing by .mapping bones from this.state.bones array to Link elements.
	render() {
		return (
			<div className="App">
			<div>
				<div className="list-group">
				<span className="list-group-item list-group-item-info clearfix"><Link to='/add'><button className="btn btn-info pull-right">Lisää uusi</button></Link></span>
					{this.state.bones.map(bone => 
						<Link key={bone.id} to={{pathname: '/update/' + bone.boneId,
							state: {
								id: bone.id,
								boneId: bone.id,
								nameLatin: bone.nameLatin,
								altNameLatin: bone.altNameLatin,
								description: bone.description,
								name: bone.name,
								bodypart: bone.bodypart,
								attempts: bone.attempts,
								correctAttempts: bone.correctAttempts
							}
						}}>
							<button type="button" className="list-group-item list-group-item-action">{bone.nameLatin} ({bone.animal})</button>
						</Link>)}
				</div>
				</div>
			</div>
		);
	}
}

export default BoneListing		
