declare var require: any

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
	View, Button, Div, Placeholder, PanelSpinner, Progress
} from "@vkontakte/vkui";
import {
	Icon56GestureOutline, Icon20ChevronRightOutline, Icon56FragmentsOutline, Icon28NewsfeedOutline, Icon28ServicesOutline
} from '@vkontakte/icons';
import "./welcome.css";

export class WelcomeFirst extends React.Component<{ onPanelChange}, {}> {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(e) {
		this.props.onPanelChange("welcome_second");
	}
	componentDidMount() {
		(document.getElementById("welcome_nextButton") as HTMLButtonElement).style.opacity = '0';
		(document.getElementById("welcome_nextButton") as HTMLButtonElement).disabled = true;
		let i = 0;
		let text = "Welcome";
		let TimerId = setInterval((e) => {
			try { (document.getElementById("welcome_text1") as HTMLSpanElement).textContent += text[i]; } catch (e) { clearInterval(TimerId);}
			i++;
			if (i >= text.length) {
				clearInterval(TimerId);
				(document.getElementById("welcome_nextButton") as HTMLButtonElement).style.opacity = '1';
				(document.getElementById("welcome_nextButton") as HTMLButtonElement).disabled = false;
			}
		}, 200)

	}
	render() {
		return (
			<Div id="welcome_mainDiv">
				<h1 id="welcome_text1"></h1>
				<Placeholder id="welcome_placeholder"
					icon={<Icon56GestureOutline />}
				>
					В ничего не делающее приложение
				</Placeholder>
				<Button size="l" after={<Icon20ChevronRightOutline/>} id="welcome_nextButton" onClick={this.handleChange}>Next</Button>
			</Div >
		);
	}
}
export class WelcomeSecond extends React.Component<{ onPanelChange }, {}> {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(e) {
		this.props.onPanelChange("welcome_third");
	}
	componentDidMount() {
		(document.getElementById("welcome_nextButton2") as HTMLButtonElement).style.opacity = "0";
		(document.getElementById("welcome_nextButton2") as HTMLButtonElement).disabled = true;
		let i = 0;
		let text = "Ну начнем?";
		let TimerId2 = setInterval((e) => {
			try { (document.getElementById("welcome_text2") as HTMLSpanElement).textContent += text[i]; } catch (e) { clearInterval(TimerId2); }
			i++;
			if (i >= text.length) {
				clearInterval(TimerId2);
				(document.getElementById("welcome_nextButton2") as HTMLButtonElement).style.opacity = "1";
				(document.getElementById("welcome_nextButton2") as HTMLButtonElement).disabled = false;
			}
		}, 100)

	}
	render() {
		return (
			<Div id="welcome_mainDiv">
						<h1 id="welcome_text2"></h1>
				<Placeholder id="welcome_placeholder"
					icon={<Icon56FragmentsOutline />}
				>
					Ничего не делать...
				</Placeholder>
						<Button size="l" after={<Icon20ChevronRightOutline />} id="welcome_nextButton2" onClick={this.handleChange}>Конечно</Button>
			</Div>
		);
	}
}
export class WelcomeThird extends React.Component<{ onViewChange }, {progress}> {
	constructor(props) {
		super(props);
		this.state = {progress: 0}
	}
	componentDidMount() {
		let i = 0;
		let TimerId = setInterval((e) => {
			this.setState({ progress: i*20 });
			i++;
			if (i > 5) {
				clearInterval(TimerId);
				this.props.onViewChange("main");
			}
		}, 300)

	}
	render() {
		return (
			<Div id="welcome_mainDiv">
				<PanelSpinner />
				<Progress value={this.state.progress} />

			</Div>
		);
	}
}