import React from 'react';
import './App.css';
import { getAllRoutes } from './lib/query';

function App() {
	setInterval(() => {
		const response = getAllRoutes().finally((value) => {
			return value;
		});
		console.log(response);
	}, 60 * 1000);

	return <h1>Hello</h1>;
}

export default App;
