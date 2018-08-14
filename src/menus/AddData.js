import React from 'react'
import XLSX from 'xlsjs'
import animalService from '../services/animals'
import bodyPartService from '../services/bodyParts'
import boneService from '../services/bones'
import imageService from '../services/images'

class AddData extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			bones: [],
			images: [],
			bodyParts: [],
			animals: [],
			newBones: [],
			newImages: [],
			newAnimals: [],
			newBodyParts: []
		}
		this.handleFile = this.handleFile.bind(this)
		this.handleData = this.handleData.bind(this)
		this.sendAnimalsAndBodyParts = this.sendAnimalsAndBodyParts.bind(this)
		this.sendBones = this.sendBones.bind(this)
		this.sendImages = this.sendImages.bind(this)

		window.onunload = function () { window.location.href = '/' }
	}

	async componentDidMount() {
		const bones = await boneService.getAll()
		const images = await imageService.getAll()
		const animals = await animalService.getAll()
		const bodyParts = await bodyPartService.getAll()

		this.setState({
			animals: animals.data,
			bodyParts: bodyParts.data,
			bones: bones.data,
			images: images.data
		})

		console.log(this.state)
	}

	handleFile(e) {
		const reader = new FileReader();
		reader.readAsArrayBuffer(e.target.files[0]);

		reader.onload = (e) => {
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, { type: 'array' });
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
			this.setState({ data: data });
		}
	}

	async sendAnimalsAndBodyParts() {
		for (let index = 0; index < this.state.newAnimals.length; index++) {
			await animalService.create({
				name: this.state.newAnimals[index]
			})
		}

		for (let index = 0; index < this.state.newBodyParts.length; index++) {
			await bodyPartService.create({
				name: this.state.newBodyParts[index]
			})
		}

		const animals = await animalService.getAll()
		const bodyParts = await bodyPartService.getAll()

		this.setState({
			animals: animals.data,
			bodyParts: bodyParts.data
		})
		console.log('Eläimet ja ruumiinosat valmiit!')
	}

	async sendBones() {
		for (let index = 0; index < this.state.newBones.length; index++) {
			const bodyPartInDatabase = this.state.bodyParts.filter(bp => bp.name === this.state.newBones[index].bodyPart)

			await boneService.create({
				name: this.state.newBones[index].name,
				nameLatin: this.state.newBones[index].nameLatin,
				bodyPart: bodyPartInDatabase[0].id
			})
		}

		const bones = await boneService.getAll()

		this.setState({
			bones: bones.data
		})
		console.log('Luut valmis!')
	}

	async sendImages() {
		for (let index = 0; index < this.state.newImages.length; index++) {
			const animalsInDatabase = this.state.animals.filter(animal => animal.name === this.state.newImages[index].animal)
			const boneInDatabase = this.state.bones.filter(bone => bone.nameLatin === this.state.newImages[index].nameLatin)

			let difficulty
			if (this.state.newImages[index].difficulty === 'H') {
				difficulty = 0
			} else {
				difficulty = 100
			}

			await imageService.create({
				handedness: this.state.newImages[index].handedness,
				difficulty: difficulty,
				animal: animalsInDatabase[0].id,
				url: this.state.newImages[index].url,
				bone: boneInDatabase[0].id
			})
		}

		const images = await imageService.getAll()

		this.setState({
			images: images.data
		})
		console.log('Kuvat valmis!')
	}

	handleData() {
		if (this.state.data.length !== 0) {
			let images = this.state.data.map(d => {
				if (d.length >= 9) {
					return {
						imageNumber: d[0] !== undefined ? d[0].trim() : null,
						bodyPart: d[1] !== undefined ? d[1].trim() : null,
						nameLatin: d[2] !== undefined ? d[2].trim() : null,
						name: d[3] !== undefined ? d[3].trim() : null,
						animal: d[4] !== undefined ? d[4].trim() : null,
						handedness: d[5] !== undefined ? d[5].trim() : null,
						imageType: d[6] !== undefined ? d[6].trim() : null,
						difficulty: d[7] !== undefined ? d[7].trim() : null,
						luuVaiRakenne: d[8] !== undefined ? d[8].trim() : null,
					}
				}
				return null
			})

			images = images.filter(img => img !== undefined)
			images.shift()

			let newBodyParts = images.map(i => i.bodyPart)
			newBodyParts = Array.from(new Set(newBodyParts))
			console.log(newBodyParts)

			let newAnimals = images.map(i => i.animal)
			newAnimals = Array.from(new Set(newAnimals))

			let newBones = images.map(i => {
				return ({
					nameLatin: i.nameLatin,
					name: i.name,
					bodyPart: i.bodyPart
				})
			})
			newBones = Array.from(new Set(newBones.map(JSON.stringify))).map(JSON.parse)
			console.log(newBones)

			const addingBodyParts = newBodyParts.filter(newbp => this.state.bodyParts.every(bp => newbp.toLowerCase() !== bp.name.toLowerCase()))
			console.log(addingBodyParts)

			const addingAnimals = newAnimals.filter(newAnimal => this.state.animals.every(animal => newAnimal.toLowerCase() !== animal.name.toLowerCase()))
			console.log(addingAnimals)

			const addingBones = newBones.filter(newBone => this.state.bones.every(bone => newBone.nameLatin.toLowerCase() !== bone.nameLatin.toLowerCase()))
			console.log(addingBones)

			const newImages = images.map(i => {
				let imageNumber
				if (i.imageNumber.length === 3) {
					imageNumber = i.imageNumber
				} else if (i.imageNumber.length === 2) {
					imageNumber = '0' + i.imageNumber
				} else {
					imageNumber = '00' + i.imageNumber
				}
				return ({
					url: imageNumber,
					animal: i.animal,
					handedness: i.handedness,
					difficulty: i.difficulty,
					nameLatin: i.nameLatin
				})
			})

			const addingImages = newImages.filter(newImage => this.state.images.every(image => !image.url.includes(newImage.url)))
			console.log(addingImages)

			this.setState({
				newBodyParts: addingBodyParts,
				newAnimals: addingAnimals,
				newBones: addingBones,
				newImages: addingImages
			})
		}
	}


	render() {
		console.log(this.state)
		return (
			<div>
				<form>
					<input type="file" className="form-control" id="file" accept="xlsx" onChange={this.handleFile} />
				</form>
				<div><b>HUOM! Käy kaikki vaiheet läpi oikeassa järjestyksessä - muutoin kaikki hajoaa! Odota ennen seuraavaa toimintoa, että consolissa lukee "valmis".</b></div>
				<button onClick={this.handleData}>1. Käsittele data</button>
				<button onClick={this.sendAnimalsAndBodyParts}>2. Lähetä eläimet ja ruumiinosat</button>
				<button onClick={this.sendBones}>3. Lähetä luut</button>
				<button onClick={this.sendImages}>4. Lähetä kuvat</button>
				<div>

				</div>
			</div>

		);
	};
};

export default AddData