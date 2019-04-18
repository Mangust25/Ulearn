import React from "react";
import { storiesOf } from "@storybook/react";
import NavigationItem from './NavigationItem';
import { itemTypes } from '../constants';




storiesOf("Navigation", module)
	.add("NavigationItem", () => (
		<nav>
			<NavigationItem text='Первое знакомство с C#' />
			<NavigationItem text='Ошибки' />
			<NavigationItem text='Тут много текста в одном пункте. Надеюсь, таких длинных текстов у нас не будет, но на всякий случай их нужно учесть' />
			<NavigationItem text='Тутдлинноесловобезпробеловкакжесложноегонабиратьононедолжноничеголоматьвидимолучшийвариантегообрезатьмноготочием' />
			<NavigationItem text='Текущий модуль' isActive />
			<NavigationItem text='Модуль с прогресс-баром' progress={ 0.45 } />
			<NavigationItem text='Модуль с заполненным прогресс-баром' progress={ 1 } />
			<NavigationItem text='Тут много текста в одном пункте. Надеюсь, таких длинных текстов у нас не будет, но на всякий случай их нужно учесть' progress={ 0.45 } />
			<NavigationItem text='Тутдлинноесловобезпробеловкакжесложноегонабиратьононедолжноничеголоматьвидимолучшийвариантегообрезатьмноготочием'
				progress={ 0.45 }
			/>
			<NavigationItem text='Пункт меню со счетом' score={ 0.45 } />
			<NavigationItem text='Пункт меню со счетом и описанием' description='Задание' score={ 0 } />
			<NavigationItem text='Пункт меню с метро' metro={{
				complete: true,
				type: itemTypes.theory,
				connectToPrev: true,
			}} />
			<NavigationItem text='Пункт меню с метро' metro={{complete: false, type: itemTypes.theory}} />
			<NavigationItem text='Пункт меню с иконкой' metro={{complete: false, type: itemTypes.quiz}} />
			<NavigationItem text='Пункт меню с иконкой и описанием и счетом'
							hasMetro
							score={ 0.68443 }
							description='Ждет код-ревью • 3 попытки осталось'
							isActive
							metro={{complete: false, type: itemTypes.quiz}} />
			<NavigationItem text='Пункт меню с иконкой' metro={{complete: false, type: itemTypes.task}} />
			<NavigationItem text='Пункт меню с иконкой' metro={{
				complete: true,
				type: itemTypes.quiz,
				connectToNext: true,
			}} />
			<NavigationItem text='Пункт меню с иконкой' metro={{
				complete: true,
				type: itemTypes.task,
				connectToPrev: true,
				isLastItem: true,
			}} />

		</nav>
	));

