import animalService from '../services/animals'

class ResponseMocks {
static twoBones = [
						{id: 1,
						nameLatin: "latin1",
						altNameLatin: "",
						description: "",
						name: "suomi1",
						bodyPart: {name: "Eturaaja"},
						attempts: 0,
						correctAttempts: 0,
						animals: [{name: "Koira", _id: "5b2b8c851867cd00142634e7"}, {name: "Hevonen", _id: "5b2b8c9b1867cd00142634ea"}, {name: "Nauta", _id: "5b2b8c951867cd00142634e9"}, {name: "Kissa", _id: "5b2b8c8d1867cd00142634e8"}]},
						{id: 2,
						nameLatin: "latin2",
						altNameLatin: "",
						description: "",
						name: "suomi2",
						bodyPart: {name: "Eturaaja"},
						attempts: 0,
						correctAttempts: 0,
						animals: [{name: "Hevonen", _id: "5b2b8c9b1867cd00142634ea"}]}
					]
}
export default ResponseMocks;
