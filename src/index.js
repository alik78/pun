import { Router } from 'preact-router'
import { Provider } from '@preact/prerender-data-provider'
// import Header from './header'

// Code-splitting is automated for routes
import Home from './routes/home'
import Report from './routes/report'
import NotFoundPage from './routes/notfound'

export default function App(props) {
	// console.log('App', props)
	return (
		<Provider value={props}>
			<div id="app">
				{/* <Header /> */}
				<Router>
					<Home path="/" />
					<Report path="/report/:date" />
					<NotFoundPage type="404" default />
				</Router>
			</div>
		</Provider>
	)
}
