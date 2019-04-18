import React from "react";
import { storiesOf } from "@storybook/react";
import NavigationHeader from './NavigationHeader';


storiesOf("Navigation", module)
	.add("Шапка в навигации", () => (
		<div>
			<NavigationHeader title='Основы программирования'
							  isCourseNavigation
							  description={getDescription()}
							  progress={ 0 }
			/>
			<NavigationHeader title='Основы программирования'
							  isCourseNavigation
							  progress={ 0.56 }
			/>
			<NavigationHeader title='Первое знакомство с C#'
							  courseName='Основы программирования'
							  courseUrl='/BasicProgramming'
							  progress={ 0.9 }
			/>

		</div>
	));

function getDescription () {
	return `Знакомство с основами синтаксиса C#, 
	стандартными классами .NET, 
	с основами ООП и базовыми алгоритмами.`;
}
