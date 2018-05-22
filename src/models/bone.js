const Bone = sequelize.define('bone', {
  boneid: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  name_lat: {
    type: Sequelize.STRING
  },
  difficulty: {
    type: Sequelize.STRING
  },
  bonesize: {
    type: Sequelize.INTEGER
  },
  handedness: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  creationtime: {
    type: Sequelize.DATE
  },
  lastmodified: {
    type: Sequelize.DATE
  },
  bodypart: {
    type: Sequelize.STRING
  },
  attempts: {
    type: Sequelize.INTEGER
  },
  correctattempts: {
    type: Sequelize.INTEGER
  },
  shape: {
    type: Sequelize.STRING
  },
  bonestructureid: {
    type: Sequelize.INTEGER
  },
  speciesanatomyid: {
    type: Sequelize.INTEGER
  },
  boneimageid: {
    type: Sequelize.INTEGER
  }
})