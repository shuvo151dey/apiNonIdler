import React from 'react';
import './App.css';
import { busCoordinatesSubscription, getAllRoutes } from './lib/query';

function App() {
	const initializer = getAllRoutes();
	const response = busCoordinatesSubscription();
	// const response = fetch('https://stormy-sands-01102.herokuapp.com/', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify({
	// 		query: `{
	// 		AllBusStops {
	// 			_id
	// 			name
	// 			latitude
	// 			longitude
	// 		}
	// 	}`
	// 	})
	// });
	console.log(initializer);
	response.subscribe({
		next({ data }) {
			console.log(data);
		}
	});

	return <h1>Hello</h1>;
}

export default App;
