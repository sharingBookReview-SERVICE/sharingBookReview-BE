import sequelize from 'sequelize'
import connection from './index.js'

const { DataTypes } = sequelize

const Review = connection.define('Review', {
	content: DataTypes.TEXT,
})

await connection.sync({ force: true })

export default Review