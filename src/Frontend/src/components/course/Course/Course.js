import React, { Component } from "react";
import PropTypes from "prop-types";
import Navigation from "../Navigation";
import AnyPage from '../../../pages/AnyPage'
import styles from "./Course.less"



class Course extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showCourseNav: false,
		};
	}

	componentDidMount () {
		const { loadCourse, loadUserProgress, isAuthenticated, courseId, courseInfo, progress } = this.props;

		if (!courseInfo) {
			loadCourse(courseId);
		}

		if (progress) {
			this.setState({
				showCourseNav: Boolean(Object.keys(progress).length),
			});
		}

		if (isAuthenticated && !progress) {
			loadUserProgress(courseId);


		}

		if (!isAuthenticated) {
			// загрузить из localStorage
		}
	}


	render () {
		const { courseInfo, progress } = this.props;

		if (!courseInfo) {
			return null;
		}

		return (
			<div className={ styles.root }>
				<Navigation
					isCourseNavigation
					progress={0}
					title={ courseInfo.title }
					description={ courseInfo.description }
					items={ courseInfo.units } />
				<div>
					<AnyPage />
				</div>
			</div>
		);
	}
}

Course.propTypes = {
	isAuthenticated: PropTypes.bool,
	courseId: PropTypes.string,
	slideId: PropTypes.string,
	courseInfo: PropTypes.object, // TODO: описать
	progress: PropTypes.object, // TODO: описать
	loadCourse: PropTypes.func,
	loadUserProgress: PropTypes.func,
};

export default Course;