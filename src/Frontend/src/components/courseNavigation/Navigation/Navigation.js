import React, { Component } from "react";
import PropTypes from 'prop-types';
import NavigationHeader from '../NavigationHeader';
import NavigationContent from '../NavigationContent';
import { menuItemType } from '../types';
import styles from './Navigation.less';


class Navigation extends Component {
	render () {
		const { isCourseNavigation, items } = this.props;
		return (
			<div className={ styles.root }>
				<NavigationHeader {...this.props} />
				<NavigationContent isCourseNavigation={ isCourseNavigation } items={ items } />
			</div>
		);
	}
}

NavigationHeader.propTypes ={
	isCourseNavigation: PropTypes.bool,
	title: PropTypes.string.isRequired,
	progress: PropTypes.number,
	items: PropTypes.arrayOf(menuItemType),

	// TODO: Это инфа о курсе. Нет ли ее в одной куче?
	description: PropTypes.string,
	courseName: PropTypes.string,
	courseUrl: PropTypes.string,
};

export default Navigation
