import React from 'react'
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
	
	render() {
		return (
			<div classname="App">
			<div>
				{/*<ul class="list-group">
				<li class="list-group-item clearfix"><Link to='/add'><button class="btn btn-info pull-right">Lisää uusi</button></Link></li>
					{this.state.bones.map(bone => 
						<li key={bone.id} class="list-group-item list-group-item-action">
						<Link to={{pathname: '/update/${bone.boneId}',
						state: {
							id: bone.id,
							boneId: bone.boneId,
							nameLatin: bone.nameLatin,
							name: bone.name,
							animal: bone.animal,
							bodypart: bone.bodypart
							}}
							}>
							<button type="button" class="list-group-item list-group-item-action">{bone.nameLatin}</button>
							</Link></li>)}
				</ul>*/}
				<div class="list-group">
				<span class="list-group-item clearfix"><Link to='/add'><button class="btn btn-info pull-right">Lisää uusi</button></Link></span>
					{this.state.bones.map(bone => 
						<Link key={bone.id} to={{pathname: '/update/${bone.boneId}',
						state: {
							id: bone.id,
							boneId: bone.boneId,
							nameLatin: bone.nameLatin,
							name: bone.name,
							animal: bone.animal,
							bodypart: bone.bodypart
							}}
							}>
							<button type="button" class="list-group-item list-group-item-action">{bone.nameLatin}</button>
							</Link>)}
				</div>
				</div>
			</div>
		);
	}
}

export default BoneListing		
