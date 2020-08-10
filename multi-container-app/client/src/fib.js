import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';

export const Fib = () => {
	const [index, setIndex] = useState('');
	const [fetchedIndex, setFetchedIndex] = useState([]);
	const [fetchedValues, setFetchedValues] = useState([]);

	useEffect(() => {
		const getIndexes = async () => {
			const value = await axios.get('/api/values/current');
			setFetchedValues(value.data);
		};
		const getValues = async () => {
			const value = await axios.get('/api/values/all');
			setFetchedIndex(value.data);
		};

		getIndexes();
		getValues();
	}, []);

	const renderValues = () => {
		console.log(fetchedValues);
		return Object.keys(fetchedValues)?.map((data) => {
			console.log(data)
			return (
				<div key={data}>
					For index {data} fibonacci value is {fetchedValues[data]}
				</div>
			);
		});
	};

	const renderSeenIndexes = () => {
		console.log(fetchedIndex);
		return fetchedIndex?.map(({ number }) => number).join(', ');
	};

	const handleInputChange = useCallback((e) => {
		setIndex(e.target.value);
	}, []);

	const handleSubmit = useCallback(() => {
		axios.post('/api/values', { index }).then(() => {
			setIndex('');
		});
	}, [index]);

	return (
		<div>
			<div>
				<p>Enter your index:</p>
				<input onChange={handleInputChange} />
				<button onClick={handleSubmit}>Submit</button>
			</div>

			<h3>Seen indexes:</h3>
			{renderSeenIndexes()}

			<h3>Calculated values:</h3>
			{renderValues()}
		</div>
	);
};
