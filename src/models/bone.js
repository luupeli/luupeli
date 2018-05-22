const sequelize = require('sequelize')

const Bone = sequelize.define('bone', {
  boneId: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  nameLat: {
    type: Sequelize.STRING
  },
  difficulty: {
    type: Sequelize.STRING
  },
  boneSize: {
    type: Sequelize.INTEGER
  },
  handedness: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  creationTime: {
    type: Sequelize.DATE
  },
  lastModified: {
    type: Sequelize.DATE
  },
  bodyPart: {
    type: Sequelize.STRING
  },
  attempts: {
    type: Sequelize.INTEGER
  },
  correctAttempts: {
    type: Sequelize.INTEGER
  },
  shape: {
    type: Sequelize.STRING
  },
  boneStructureid: {
    type: Sequelize.INTEGER
  },
  speciesAnatomyId: {
    type: Sequelize.INTEGER
  },
  boneImageId: {
    type: Sequelize.INTEGER
  }
})