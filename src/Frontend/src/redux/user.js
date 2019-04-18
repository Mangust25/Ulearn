import {
	USER__PROGRESS_LOAD,
	START, SUCCESS, FAIL,
} from '../consts/actions';

const initialState = {
	progress: {},
	loading: false,
};

export default function user(state = initialState, action) {
	switch (action.type) {
		case USER__PROGRESS_LOAD + START:
			return {
				...state,
				loading: true,
			};
		case USER__PROGRESS_LOAD + SUCCESS:
			return {
				...state,
				loading: false,
				progress: {
					...state.progress,
					[action.courseId]: action.result,
				}
			};
		case USER__PROGRESS_LOAD + FAIL:
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
}