import sequelize from 'sequelize'
import connection from './index.js'

const { DataTypes } = sequelize

const Review = connection.define('Review', {
	content: {
		type: DataTypes.TEXT,
		allowNull: false
	},
})

await connection.sync({ force: true })

export default Review