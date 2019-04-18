import {
	COURSES__COURSE_ENTERED,
	COURSES__COURSE_LOAD,
	START, SUCCESS, FAIL,
} from "../consts/actions";

import { getCourse } from '../api/courses'

export const changeCurrentCourseAction = (courseId) => ({
	type: COURSES__COURSE_ENTERED,
	courseId,
});

const loadCourseStart = () => ({
	type: COURSES__COURSE_LOAD + START,
});

const loadCourseSuccess = (courseId, result) => ({
	type: COURSES__COURSE_LOAD + SUCCESS,
	courseId,
	result,
});

const loadCourseFail = () => ({
	type: COURSES__COURSE_LOAD + FAIL,
});

export const loadCourse = (courseId) => {
	return (dispatch) => {
		dispatch(loadCourseStart());

		getCourse(courseId)
			.then(result => {
				dispatch(loadCourseSuccess(courseId, result));
			})
			.catch(err => {
				dispatch(loadCourseFail());
			});
	};
};