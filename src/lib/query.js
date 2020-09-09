import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { split, HttpLink, ApolloLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({
	uri: 'http://stormy-sands-01102.herokuapp.com/'
});

const wsLink = new WebSocketLink({
	uri: `ws://stormy-sands-01102.herokuapp.com/`,
	options: {
		reconnect: true,
		timeout: 20000,
		lazy: true
	}
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	httpLink
);
const link = ApolloLink.from([ splitLink ]);
const client = new ApolloClient({
	link,
	cache: new InMemoryCache()
});
export function loginUser({ email, password }) {
	const variables = { email, password };
	const query = gql`
		query loginUser($email: String!, $password: String!) {
			Login(email: $email, password: $password) {
				_id
				token
				tokenExpiration
				name
				email
			}
		}
	`;
	const data = client.query({ query, variables });
	return data;
}

export function createUser({ email, password, name, userType, busId }) {
	//userType is enum type hence will only take "Customer" or "Driver"
	//busId is the route id for every driver
	const variables = { email, password, name, userType, busId };
	const query = gql`
		mutation createUser($email: String!, $password: String!, $name: String!, $userType: userType!, $busId: ID!) {
			createUser(email: $email, password: $password, name: $name, userType: $userType, bus: $busId) {
				_id
				token
				tokenExpiration
				email
				name
				userType
			}
		}
	`;
	const data = client.mutate({ query, variables });
	return data;
}

export function getAllRoutes() {
	const query = gql`
		{
			AllRoutes {
				_id
				name
				sequence {
					_id
					name
					latitude
					longitude
				}
				time
				busName
				currentLongitude
				currentLatitude
			}
		}
	`;
	const data = client.query({ query });
	return data;
}

export function getSpecificRoute(id) {
	const variables = { id };
	const query = gql`
		query getRoute($id: ID!) {
			getRoute(id: $id) {
				_id
				name
				sequence {
					_id
					name
					latitude
					longitude
				}
				time
				busName
				currentLongitude
				currentLatitude
			}
		}
	`;
	const data = client.query({ query, variables });
	return data;
}

export function getSpecificBusStop(id) {
	const variables = { id };
	const query = gql`
		query($id: ID!) {
			getBusStop(id: $id) {
				_id
				name
				latitude
				longitude
			}
		}
	`;
	const data = client.query({ query, variables });
	return data;
}
export function getAllBusStops() {
	const query = gql`
		{
			AllBusStops {
				_id
				name
				latitude
				longitude
			}
		}
	`;
	const data = client.query({ query }).then((response) => {
		return response;
	});
	return data;
}

export function changePassword({ email, newPassword }) {
	const query = gql`
		mutation changePassword($email: String!, $newPassword: String!) {
			updateUser(email: $email, password: $newPassword) {
				_id
				email
				name
				userType
			}
		}
	`;
	const variables = { email, newPassword };

	const data = client.mutate({ query, variables });
	return data;
}

export function busCoordinatesSubscription(callback) {
	const query = gql`
		subscription {
			busList {
				_id
				name
				sequence {
					_id
					name
					latitude
					longitude
				}
				time
				busName
				currentLongitude
				currentLatitude
			}
		}
	`;
	const data = client.subscribe({ query });
	return data;
}

export function updateBusCoordinates({ id, latitude, longitude }) {
	const query = gql`
		mutation updateBusCoordinates($id: ID!, $latitude: String!, $longitude: String!) {
			updateRoute(id: $id, currentLatitude: $latitude, currentLongitude: $longitude) {
				_id
				name
				sequence {
					_id
					name
					latitude
					longitude
				}
				time
				busName
				currentLongitude
				currentLatitude
			}
		}
	`;
	const data = client.mutate({ query, variables: { id, latitude, longitude } });
	return data;
}
