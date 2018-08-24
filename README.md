# luupeli-backend
[![Build Status](https://travis-ci.org/luupeli/luupeli-backend.svg?branch=master)](https://travis-ci.org/luupeli/luupeli-backend)

### Endpoints

`http://luupeli-backend.herokuapp.com/api`

Path | Method | Description
-----|------|------------
`/bones/` | GET | Returns an array of all bones.
`/bones/` | POST | Creates a new bone.
`/bones/:boneId` | GET | Gets a specific bone.
`/bones/:boneId` | PUT | Edits a Latin name and name. Images cannot be edited, because images add and delete by own methods.
`/bones/:boneId` | DELETE | Removes a specific bone and all images which are connected with it.
`/images/` | GET | Returns an array of all images.
`/images/` | POST | Creates a new image.
`/images/:imageId` | GET | Gets a specific image.
`/images/:imageId` | PUT | Edits difficulty. The bone and url cannot be edited.
`/images/:imageId` | DELETE | Removes a specific image and removes connect if the image is connected with bone.
`/animals/` | GET | Returns an array of all animals.
`/animals/` | POST | Creates a new animal.
`/bodyparts/` | GET | Returns an array of all body parts.
`/bodyparts/` | POST | Creates a new body part.

#### Bone
##### Example
```
{
    "id": "5b15d89a6ffw192a471571fe",
    "name": "reisiluu",
    "nameLatin": "ossis femoris",
    "bodypart": "5b1696776319da662a7ab535",
    "animal": "5b16961f9aaa4765f8ec6a75",
    "images": ["5b15674e6ff3192a471571fa", "5b156d2af4d39b2db027f191"]
}
```

#### Image
##### Example
```
{
    "id": "5b15689a6ff3192a471571fe",
    "difficulty": "1",
    "url": "public/images/ossisfemoris.jpg",
    "bone": "5b152f647053790f4be55bc4"
}
```
