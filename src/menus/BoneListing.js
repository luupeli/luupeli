import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class BoneListing extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			bones:  [
        {
          id: 1,
          boneId: 1,
          nameLatin: "Lorem ipsum", 
          name: "luupää",
          animal: "eq",
          bodypart: "frontleg"
        },
        {
          id: 2,
          boneId: 2,
          nameLatin: "dolor sit", 
          name: "luunkova",
          animal: "eq",
          bodypart: "backleg"
        },
        {
          id: 3,
          boneId: 3,
          nameLatin: "amet", 
          name: "luuvalo",
          animal: "fe",
          bodypart: "head"
        },
        {
          id: 4,
          boneId: 4,
          nameLatin: "consectetur", 
          name: "luunappi",
          animal: "bo",
          bodypart: "body"
        },
        {
          id: 5,
          boneId: 5,
          nameLatin: "adipiscing elit", 
          name: "luuvitonen",
          animal: "ca",
          bodypart: "body"
        }
      ]
		}
	}
	
	
	//GET list of bones from database and stuff it into this.state.bones for rendering
	componentDidMount() {
		const url = 'http://luupeli-backend.herokuapp.com/api/bones/'
		axios.get(url)
		.then((response) => {
			var newBones = []
			for(var i = 0; i < response.data.length; i++) {
				newBones = newBones.concat({id: response.data[i].id,
					boneId: response.data[i].id,
					nameLatin: response.data[i].nameLatin,
					name: response.data[i].name,
					animal: response.data[i].animal.name,
					bodypart: response.data[i].bodypart.name
				})
			}
			this.setState({ bones: newBones })
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
								boneId: bone.boneId,
								nameLatin: bone.nameLatin,
								name: bone.name,
								animal: bone.animal,
								bodypart: bone.bodypart
							}
						}}>
							<button type="button" className="list-group-item list-group-item-action">{bone.nameLatin}</button>
						</Link>)}
				</div>
				</div>
			</div>
		);
	}
}

export default BoneListing		
