import sequelize from 'sequelize'

const connection = new sequelize.Sequelize('test', 'root', '1234', {
	host: 'localhost',
	dialect: 'mysql'
})

try {
	await connection.authenticate()
	console.log('Connection has been established successfully.')
} catch (e) {
	console.error(e)
}

export default connection