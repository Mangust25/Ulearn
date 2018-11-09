import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@skbkontur/react-ui/components/Button/Button";
import Tabs from "@skbkontur/react-ui/components/Tabs/Tabs";
import Gapped from "@skbkontur/react-ui/components/Gapped/Gapped";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import CopyGroupModal from "../CopyGroupModal/CopyGroupModal";

import './style.less';
import api from "../../../../api";

const TABS = {
	active: 'active',
	archived: 'archived',
};

class GroupHeader extends Component {

	state = {
		modalCreateGroup: false,
		modalCopyGroup: false,
	};

	render() {
		return (
			<React.Fragment>
				{ this.renderHeader() }
				{ this.state.modalCreateGroup &&
					<CreateGroupModal
						closeModal={this.closeModal}
						createGroup={this.props.createGroup}
						courseId={this.props.courseId}
					/>
				}
				{ this.state.modalCopyGroup &&
					<CopyGroupModal
						closeModal={this.closeModal}
						courseId={this.props.courseId}
						groups={this.props.groups}
						copyGroup={this.props.copyGroup}
						courseTitle={this.courseTitle}
					/>
				}
			</React.Fragment>
		)
	}

	renderHeader() {
		return (
			<header className="group-header">
				<div className="group-header-container">
					<h2>Группы</h2>
					<div className="buttons-container">
						<Gapped gap={20}>
							<Button id="create" use="primary" size="medium" onClick={this.openCreateGroupModal}>Создать группу</Button>
							<Button id="copy" use="default" size="medium" onClick={this.openCopyGroupModal}>Скопировать группу</Button>
						</Gapped>
					</div>
				</div>
				<div className="tabs-container">
					<Tabs value={this.props.filter} onChange={this.onChange}>
						<Tabs.Tab id={TABS.active}>Активные</Tabs.Tab>
						<Tabs.Tab id={TABS.archived}>Архивные</Tabs.Tab>
					</Tabs>
				</div>
			</header>
		)
	}

	openCreateGroupModal = () => {
		this.setState({
			modalCreateGroup: true
		})
	};

	openCopyGroupModal = () => {
		this.setState({
			modalCopyGroup: true
		})
	};

	closeModal = () => {
		this.setState({
			modalCreateGroup: false,
			modalCopyGroup: false,

		})
	};

	onChange = (_, v) => {
		this.props.onTabChange(v);
	};

	get courseTitle() {
		const { courseId } = this.props;
		return api.courses.getCourseTitle(courseId);
	};
}

GroupHeader.propTypes = {
	onTabChange: PropTypes.func,
	filter: PropTypes.string,
	courseId: PropTypes.string,
	copyGroup: PropTypes.func,
	createGroup: PropTypes.func,
	groups: PropTypes.array,
	loading: PropTypes.bool,
};

export default GroupHeader;