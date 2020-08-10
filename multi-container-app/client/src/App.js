import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Fib } from './fib';
import otherPage from './otherPage';
import './App.css';

function App() {
	return (
		<Router>
			<div className='App'>
				<header style={{...styles.displayRow, ...styles.justifySpaceAround}}>
					<Link to='/'>Home</Link>
					<Link to='/otherpage'>To other page</Link>
				</header>
				<div>
					<Route exact path='/' component={Fib} />
					<Route path='/otherpage' component={otherPage} />
				</div>
			</div>
		</Router>
	);
}

const styles = {
	displayRow: {
		display: 'flex',
		flexDirection: 'row',
	},
	justifySpaceAround: {
		justifyContent: 'space-around'
	}
};

export default App;
