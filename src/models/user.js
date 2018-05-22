const User = sequelize.define('user', {
  userid :{
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
  creationtime :{
    type: Sequelize.DATE
  },
  lastmodified :{
    type: Sequelize.DATE
  },
  lastlogin :{
    type: Sequelize.DATE
  },
  logincount :{
    type: Sequelize.INTEGER
  },
  gamecount :{
    type: Sequelize.INTEGER
  }
})