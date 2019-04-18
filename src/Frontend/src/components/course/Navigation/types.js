import PropTypes from 'prop-types';
import { itemTypes } from './constants';

export const menuItemType = PropTypes.shape({
	title: PropTypes.string,
	url: PropTypes.string,
	progress: PropTypes.number,
	type: PropTypes.oneOf(Object.values(itemTypes)),
	complete: PropTypes.bool,
});