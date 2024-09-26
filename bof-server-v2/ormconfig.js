const path = require('path') // eslint-disable-line

module.exports = {
	type: 'mssql',
	authentication: {
		type: 'default',
		options: {
			userName: process.env.MSSQL_USER,
			password: process.env.SA_PASSWORD
		}
	},
	host: process.env.MSSQL_HOST,
	port: Number(process.env.MSSQL_PORT),
	database: process.env.MSSQL_DATABASE,
	options: {
		encrypt: true
	},
	synchronize: false,
	entities: [path.resolve(__dirname, 'src/**/*.entity{.ts,.js}')],
	seeds: [path.resolve(__dirname, 'src/**/*.seed{.ts,.js}')]
}
