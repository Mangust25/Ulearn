import { combineReducers } from "redux";
import courseReducer from "./course";
import userReducer from "./user";

const initialAccountState = {
	isAuthenticated: false,
	isSystemAdministrator: false,
	accountProblems: [],
	systemAccesses: [],
	roleByCourse: {},
	accessesByCourse: {}
};

function account(state = initialAccountState, action) {
	switch (action.type) {
		case 'ACCOUNT__USER_INFO_UPDATED':
			let newState = {...state};
			newState.isAuthenticated = action.isAuthenticated;
			if (newState.isAuthenticated) {
				newState.id = action.id;
				newState.login = action.login;
				newState.firstName = action.firstName;
				newState.lastName = action.lastName;
				newState.visibleName = action.visibleName;
				newState.avatarUrl = action.avatarUrl;
				newState.accountProblems = action.accountProblems;
				newState.systemAccesses = action.systemAccesses;
			}
			return newState;
		case 'ACCOUNT__USER_ROLES_UPDATED':
			return {
				...state,
				isSystemAdministrator: action.isSystemAdministrator,
				roleByCourse: action.roleByCourse,
				accessesByCourse: action.accessesByCourse
			};
		default:
			return state;
	}
}

const initialNotificationsState = {
	count: 0,
	lastTimestamp: ""
};

function notifications(state = initialNotificationsState, action) {
	switch (action.type) {
		case 'NOTIFICATIONS__COUNT_UPDATED':
			return {
				...state,
				count: state.count + action.count,
				lastTimestamp: action.lastTimestamp
			};
		case 'NOTIFICATIONS__COUNT_RESETED':
			return {
				...state,
				count: 0
			};
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	account,
	courses: courseReducer,
	user: userReducer,
	notifications
});

export default rootReducer;