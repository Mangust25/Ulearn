import React from 'react';
import { storiesOf } from '@storybook/react';
import ProgressBar from './ProgressBar';
import Gapped from '@skbkontur/react-ui/Gapped';

storiesOf('ProgressBar', module)
	.add('Прогресс-бары', () => (
		<Gapped vertical>
			<b>value=0.36:</b>
			<ProgressBar value={ 0.36 }/>
			<b>value=0.85:</b>
			<ProgressBar value={ 0.85 }/>
			<b>value=0:</b>
			<ProgressBar value={ 0 }/>
			<b>value=1:</b>
			<ProgressBar value={ 1 }/>
			<b>value=5:</b>
			<ProgressBar value={ 5 }/>
			<b>small</b>
			<ProgressBar value={ 0.45 } small/>
			<b>blue</b>
			<ProgressBar value={ 0.45 } color='blue'/>
		</Gapped>
	));