import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './NavigationItem.less';
import classnames from 'classnames';
import ProgressBar from '../ProgressBar';
import { itemTypes } from '../constants';

const icons = {
	[itemTypes.quiz]: '?',
	[itemTypes.task]: '{}',
};

class NavigationItem extends Component {
	render () {
		const { text, url, isActive, description, metro } = this.props;

		const classes = {
			[styles.itemLink]: true,
			[styles.active]: isActive,
			[styles.withMetro]: metro
		};

		return (
			<li className={ styles.root }>
				<a href={ url } className={ classnames(classes) }>
					{ metro && this.renderMetro() }
					<div className={ styles.firstLine }>
						<span className={ styles.text }>{ text }</span>
						{ this.renderRightPart() }
					</div>
					{ description &&
						<div className={ styles.description }>{description}</div>
					}
				</a>
			</li>
		);
	}

	renderRightPart() {
		const { progress, score } = this.props;

		if (progress) {
			return (
				<span className={ styles.progressWrapper }>
					<ProgressBar value={ progress } small color={ progress >= 1 ? 'green' : 'blue' } />
				</span>
			);
		}

		if (typeof score === 'number') {
			return (
				<div className={ styles.scoreWrapper }>
					<span className={ styles.score }>{ Math.round(score * 100) }%</span>
				</div>
			);
		}
	}

	renderMetro() {
		const { metro } = this.props;

		if (!metro) {
			return null;
		}

		const { isFirstItem, isLastItem, connectToPrev, connectToNext } = metro;

		const classes = {
			[styles.metroWrapper]: true,
			[styles.withoutBottomLine]: isLastItem,
			[styles.longTopLine]: isFirstItem,
			[styles.completeTop]: connectToPrev,
			[styles.completeBottom]: connectToNext,
		};

		return (
			<div className={ classnames(classes)}>
				{ this.renderPointer() }
			</div>
		);
	}

	renderPointer() {
		const { complete, type } = this.props.metro;

		if (type === itemTypes.theory) {
			return (
				<span className={ classnames(styles.pointer, {[styles.complete]: complete}) } />
			);
		}

		return (
			<span className={ classnames(styles.icon, {[styles.complete]: complete}) }>{icons[type]}</span>
		);
	}
}

NavigationItem.propTypes ={
	text: PropTypes.string.isRequired,
	url: PropTypes.string,
	isActive: PropTypes.bool,
	progress: PropTypes.number,
	score: PropTypes.number,
	description: PropTypes.string,
	metro: PropTypes.shape({
		complete: PropTypes.bool,
		type: PropTypes.oneOf(Object.values(itemTypes)),
		isFirstItem: PropTypes.bool,
		isLastItem: PropTypes.bool,
		connectToPrev: PropTypes.bool,
		connectToNext: PropTypes.bool,
	})
};

export default NavigationItem

