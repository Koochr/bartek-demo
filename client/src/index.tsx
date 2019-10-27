import React, {FunctionComponent} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import client from './client'
import {ApolloProvider} from '@apollo/react-hooks'
import './styles/index.scss'
import 'antd/dist/antd.css'

const Root: FunctionComponent = () => (
	<ApolloProvider client={client}>
		<App/>
	</ApolloProvider>
)

ReactDOM.render(<Root />, document.getElementById('root'))
