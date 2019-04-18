import api from "../api/"

export function getUserProgressInCourse(courseId) {
	return api.get(`user/progress/${courseId}`);
}