import { connect } from "react-redux";
import { loadCourse } from "../../actions/course";
import { loadUserProgress } from "../../actions/user";

import Course from '../../components/course/Course';

const mapStateToProps = (state, {match}) => {
	const courseId = match.params.courseId;
	return {
		courseId,
		isAuthenticated: state.account.isAuthenticated,
		slideId: match.params.slideId,
		courseInfo: state.courses.fullCoursesInfo[courseId],
		progress: state.user.progress[courseId],
	};
};
const mapDispatchToProps = (dispatch) => ({
	loadCourse: (courseId) => dispatch(loadCourse(courseId)),
	loadUserProgress: (courseId) => dispatch(loadUserProgress(courseId)),
});


const connected = connect(mapStateToProps, mapDispatchToProps)(Course);
export default connected;