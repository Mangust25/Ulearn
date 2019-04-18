import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from '@skbkontur/react-ui/Link';
import LeftIcon from '@skbkontur/react-icons/ArrowChevron2Left';
import styles from './NavigationHeader.less';
import ProgressBar from '../ProgressBar';

class NavigationHeader extends Component {
	render () {
		const { description, progress, isCourseNavigation } = this.props;
		return (
			<header className={ styles.root }>
				{ this.renderBreadcrumb() }
				{ this.renderTitle() }
				{ description && <p className={ styles.description }>{ description }</p> }
				{ isCourseNavigation &&
					<div className={ styles.progressBarWrapper }>
						<ProgressBar value={ progress } />
					</div>
				}
			</header>
		); // TODO: Еще ссылка на "Ведомость модуля" у тех, у кого права есть
	}

	renderBreadcrumb() {
		const { isCourseNavigation, courseName, courseUrl } = this.props;

		const text = isCourseNavigation ? 'Все курсы' : courseName;
		const href = isCourseNavigation ? '/' : courseUrl;

		return (
			<nav className={ styles.breadcrumbs }>
				<Link
				  	icon={ <LeftIcon /> }
				  	href={ href }>{ text }</Link>
			</nav>
		);
	}

	renderTitle() {
		const { isCourseNavigation, title } = this.props;

		if (isCourseNavigation) {
			return <h1 className={ styles.h1 }>{ title }</h1>;
		}

		return <h2 className={ styles.h2 }>{ title }</h2>;
	}
}

NavigationHeader.propTypes ={
	isCourseNavigation: PropTypes.bool,
	title: PropTypes.string.isRequired,
	progress: PropTypes.number, // TODO: если 0, надо ли рисовать прогресс бар

	// TODO: Это инфа о курсе. Нет ли ее в одной куче?
	description: PropTypes.string,
	courseName: PropTypes.string,
	courseUrl: PropTypes.string,
};

export default NavigationHeader
