import React, { Component } from "react";
import PropTypes from 'prop-types';
import classnames from 'classnames';
import NavigationItem from '../NavigationItem';
import styles from './NavigationContent.less';
import { menuItemType } from '../types';


class NavigationContent extends Component {
	render () {
		const { items } = this.props;
		return (
			<div className={ styles.root }>
				{ this.renderTitle() }
				{ items.map((item, index) => this.renderItem(item, index)) }
			</div>
		);
	}

	renderTitle () {
		const { isCourseNavigation } = this.props;

		if (isCourseNavigation) {
			return (
				<h5 className={ styles.header }>Программа курса</h5>
			);
		}

		return (
			<h5 className={ classnames(styles.header, styles.module ) }>Программа модуля</h5>
		);
	}

	renderItem(menuItem, index) {
		const { isCourseNavigation, items } = this.props;

		if (isCourseNavigation) {
			return (
				<NavigationItem
					key={ menuItem.url }
					text={ menuItem.title }
					url={ menuItem.url }
					progress={ menuItem.progress } />
			);
		}

		const isFirstItem = index === 0;
		const isLastItem = index === items.length - 1;

		const metroSettings = {
			complete: menuItem.complete,
			type: menuItem.type,
			isFirstItem: isFirstItem,
			isLastItem: isLastItem,
			connectToPrev: menuItem.complete && (isFirstItem || items[index - 1].complete),
			connectToNext: menuItem.complete && (isLastItem || items[index + 1].complete),
		};

		return (
			<NavigationItem
				key={ menuItem.url }
				text={ menuItem.title }
				url={ menuItem.url }
				score={ menuItem.progress }
				metro={ metroSettings }
			/>
		);


	}
}

NavigationContent.propTypes ={
	isCourseNavigation: PropTypes.bool,
	items: PropTypes.arrayOf(menuItemType)
};

export default NavigationContent
