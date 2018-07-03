import React from 'react'
import boneService from '../services/bones'
import { Link } from 'react-router-dom'

class BoneListing extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			bones: []
		}
	}


	//GET list of bones from database and stuff it into this.state.bones for rendering
	componentDidMount() {
		boneService.getAll()
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
			<div className="scrolling-menu">
				<div className="App">
					<div>
						<div className="list-group">
							<span className="list-group-item list-group-item-info clearfix"><Link to='/add'><button id="addNewBoneButton" className="btn btn-info pull-right">Lisää uusi</button></Link></span>
							{this.state.bones.map(bone =>
								<Link key={bone.id} to={{
									pathname: '/update/' + bone.id,
									state: {
										id: bone.id,
										boneId: bone.id,
										nameLatin: bone.nameLatin,
										altNameLatin: bone.altNameLatin,
										description: bone.description,
										name: bone.name,
										bodyPart: bone.bodyPart.name,
										attempts: bone.attempts,
										correctAttempts: bone.correctAttempts,
										boneAnimals: bone.animals
									}
								}}>
									<button type="button" className="list-group-item list-group-item-action">{bone.nameLatin} ({bone.animal})</button>
								</Link>)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default BoneListing		
