import {
	COURSES__COURSE_ENTERED,
	COURSES__UPDATED,
	COURSES__COURSE_LOAD,
	START, SUCCESS, FAIL,
} from '../consts/actions';

const initialCoursesState = {
	courseById: {},
	currentCourseId: undefined,
	fullCoursesInfo: {},
	courseLoading: false,
};

export default function courses(state = initialCoursesState, action) {
	switch (action.type) {
		case COURSES__UPDATED:
			return {
				...state,
				courseById: action.courseById
			};
		case COURSES__COURSE_ENTERED:
			return {
				...state,
				currentCourseId: action.courseId
			};
		case COURSES__COURSE_LOAD + START:
			return {
				...state,
				courseLoading: true,
			};
		case COURSES__COURSE_LOAD + SUCCESS:
			return {
				...state,
				courseLoading: false,
				fullCoursesInfo: {
					...state.fullCoursesInfo,
					[action.courseId]: action.result,
				}
			};
		case COURSES__COURSE_LOAD + FAIL:
			return {
				...state,
				courseLoading: false,
			};
		default:
			return state;
	}
}