import sequelize from 'sequelize'

const connection = new sequelize.Sequelize('test', 'root', '1234', {
	host: 'localhost',
	dialect: 'mysql'
})

export default connection