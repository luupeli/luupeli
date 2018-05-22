const User = sequelize.define('user', {
  userId :{
    type: Sequelize.INTEGER
  },
  username :{
    type: Sequelize.STRING
  },
  password :{
    type: Sequelize.STRING
  },
  email :{
    type: Sequelize.STRING
  },
  admin :{
    type: Sequelize.BOOLEAN
  },
  creationTime :{
    type: Sequelize.DATE
  },
  lastModified :{
    type: Sequelize.DATE
  },
  lastLogin :{
    type: Sequelize.DATE
  },
  loginCount :{
    type: Sequelize.INTEGER
  },
  gameCount :{
    type: Sequelize.INTEGER
  }
})