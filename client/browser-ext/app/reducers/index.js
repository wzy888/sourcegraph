import {combineReducers} from "redux";
import {keyFor} from "./helpers";
import * as ActionTypes from "../constants/ActionTypes";

const accessToken = function(state = null, action) {
	switch (action.type) {
	case ActionTypes.SET_ACCESS_TOKEN:
		return action.token ? action.token : null;
	default:
		return state;
	}
}

const resolvedRev = function(state = {content: {}}, action) {
	switch (action.type) {
	case ActionTypes.RESOLVED_REV:
		if (!state.content[keyFor(action.repo, action.rev)]) {
			if (!action.json) {
				// Assume any error is because the user is not
				// signed in or hasn't auth'd us. We know the
				// repo does exist because the user is viewing
				// it on GitHub.
				if (action.err) {
					return {
						...state,
						content: {
							...state.content,
							[keyFor(action.repo)]: {authRequired: true},
						}
					};
				}
				return state; // no meaningful update; avoid re-rendering components
			}

			return {
				...state,
				content: {
					...state.content,
					[keyFor(action.repo, action.rev)]: action.json ? action.json : null,
				}
			};
		}
	default:
		return state; // no update needed; avoid re-rending components
	}
}

const annotations = function(state = {content: {}}, action) {
	switch (action.type) {
	case ActionTypes.FETCHED_ANNOTATIONS:
		if (!action.json && !state.content[keyFor(action.repo, action.rev, action.path)]) return state; // no update needed; avoid re-rending components

		return {
			...state,
			content: {
				...state.content,
				[keyFor(action.repo, action.rev, action.path)]: action.json ? action.json : null,
			}
		};
	default:
		return state;
	}
}

export default combineReducers({accessToken, resolvedRev, annotations});
