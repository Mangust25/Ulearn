import {
	USER__PROGRESS_LOAD,
	START, SUCCESS, FAIL,
} from '../consts/actions';

import { getUserProgressInCourse } from '../api/user';

const loadUserProgressStart = () => ({
	type: USER__PROGRESS_LOAD + START,
});

const loadUserProgressSuccess = (courseId, result) => ({
	type: USER__PROGRESS_LOAD + SUCCESS,
	courseId,
	result,
});

const loadUserProgressFail = () => ({
	type: USER__PROGRESS_LOAD + FAIL,
});

export const loadUserProgress = (courseId) => {
	return (dispatch) => {
		dispatch(loadUserProgressStart());

		getUserProgressInCourse(courseId)
			.then(result => {
				dispatch(loadUserProgressSuccess(courseId, result.visitedSlides));
			})
			.catch(err => {
				dispatch(loadUserProgressFail());
			});
	};
};