import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
	return (
		<div>
			This is an other page
			<Link to='/'>Go to home</Link>
		</div>
	);
};
