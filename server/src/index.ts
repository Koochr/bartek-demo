import fs = require('fs')
import path = require('path')
import {ApolloServer, makeExecutableSchema} from 'apollo-server'
import {sendInvitations} from './routes/sendInvitations'
import {init} from './sendMail'
const {PORT} = process.env

const schema = fs.readFileSync(path.join(__dirname, '../datamodel.graphql')).toString()
const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers: {
		Query: {
			hello: (): string => 'hello'
		},
		Mutation: {
			sendInvitations
		}
	}
})

const server = new ApolloServer({schema: executableSchema})

const options = {
	port: PORT,
	endpoint: '/'
}

init().then(() => {
	// eslint-disable-next-line no-console
	server.listen(options).then(() => {console.log(`Server started, listening on port ${PORT}`)})
})
