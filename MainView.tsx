declare var require: any

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
	SplitLayout, SplitCol, Epic, PanelHeader, VKCOM, ViewWidth, Group, Cell, Tabbar, TabbarItem, withAdaptivity, withPlatform, Slider, Switch, SimpleCell, Header, Tooltip, TooltipContainer, InfoRow, Badge, Footer, Alert, Spacing
} from "@vkontakte/vkui";
import {
	Icon24Cancel, Icon28AllCategoriesOutline, Icon28Write
} from '@vkontakte/icons';
import "./main.css";
import bridge, { RequestPropsMap } from '@vkontakte/vk-bridge';
export const MainView = withAdaptivity(class MainClass extends React.Component<{FMN, viewWidth, platform, setModal }, { activeStory, widget_value, widget_anim, widget_hide }> {
	constructor(props) {
		super(props);
		this.state = {
			activeStory: "graph",
			widget_value: 20,
			widget_anim: false,
			widget_hide: false
		}
		this.changeValue = this.changeValue.bind(this);
	}
	changeValue(Ctype: string, value: any) {
		switch (Ctype) {
			case "value":
				this.setState({ widget_value: value });
				break;
			case "anim":
				this.setState({ widget_anim: value });
				break;
			case "hide":
				this.setState({ widget_hide: value });
				break;
		}
	}
	render() {
		return (<div>
			<SplitLayout
				style={{ justifyContent: "center" }}
			>{this.props.viewWidth >= ViewWidth.SMALL_TABLET && <PanelHeader separator={false} >VKUI болванка</PanelHeader>}
				{this.props.viewWidth >= ViewWidth.SMALL_TABLET && (
					<SplitCol fixed width="280px" maxWidth="280px">
						 <PanelHeader />
						<Group>
							<Cell
								disabled={this.state.activeStory === 'graph'}
								style={this.state.activeStory === 'graph' ? {
									backgroundColor: "var(--button_secondary_background)",
									borderRadius: 8
								} : {}}
								onClick={(e) => this.setState({ activeStory: "graph" })}
								before={<Icon28AllCategoriesOutline />}
							>
								Графики
							</Cell>
							<Cell
								disabled={this.state.activeStory === 'else'}
								style={this.state.activeStory === 'else' ? {
									backgroundColor: "var(--button_secondary_background)",
									borderRadius: 8
								} : {}}
								onClick={(e) => this.setState({ activeStory: "else" })}
								before={<Icon28Write />}
							>
								Настройки
							</Cell>
						</Group>
					</SplitCol>
				)}
				<SplitCol
					spaced={this.props.viewWidth >= ViewWidth.SMALL_TABLET}
					
				>
					{this.state.activeStory == "graph" && <Graph saveFunc={this.changeValue} value={this.state.widget_value} anim={this.state.widget_anim} hide={this.state.widget_hide} />}
					{this.state.activeStory == "else" && <Else FMN={this.props.FMN} setModal={this.props.setModal} />}
				<Epic activeStory={this.state.activeStory} tabbar={this.props.viewWidth < ViewWidth.SMALL_TABLET &&
					<Tabbar>
						<TabbarItem
							onClick={(e) => this.setState({ activeStory: "graph" })}
							selected={this.state.activeStory === 'graph'}
							text="Основное"
						><Icon28AllCategoriesOutline /></TabbarItem>
						<TabbarItem
							onClick={(e) => this.setState({ activeStory: "else" })}
							selected={this.state.activeStory === 'else'}
							text="Настройки"
						><Icon28Write /></TabbarItem>
					</Tabbar>
				} />
				</SplitCol>
			</SplitLayout>
				<Footer>Подвал</Footer></div>

		)
	}
}, { viewWidth: true });
class Graph extends React.Component<{ value, anim, hide, saveFunc }, { Hint }>{
	constructor(props) {
		super(props);
		this.state = { Hint: localStorage["Learns"] < 2 };
		this.doHide = this.doHide.bind(this);
		this.doAnim = this.doAnim.bind(this);
		this.doValue = this.doValue.bind(this);
	}
	componentDidMount() {
		this.doValue(this.props.value);
		this.doHide();
		this.doAnim();
	}
	doValue(percent) {
		let length = 283;
		this.props.saveFunc("value", percent);
		if (percent >= 100) { percent = 100 }
		if (percent <= 0) { percent = 0 }
		if (isNaN(percent)) { percent = 0 }
		percent = (100 - percent) / 100
		let SvgCircle = document.getElementsByClassName('Visualizer_LoadStroke')[0] as SVGCircleElement;
		SvgCircle.setAttribute('stroke-dashoffset', (length * percent).toString());
	}
	doHide() {
		let Svg = document.getElementsByClassName('Visualizer_Svg')[0];
		let checked = (document.getElementById('HideButton') as HTMLInputElement).checked;
		this.props.saveFunc("hide", checked);
		if (checked) {
			Svg.classList.add('Visualizer_Svg_Hidden');
		} else {
			Svg.classList.remove('Visualizer_Svg_Hidden');
		}

	}
	doAnim() {
		let Svg = document.getElementsByClassName('Visualizer_Svg')[0];
		let checked = (document.getElementById('AnimButton') as HTMLInputElement).checked;
		this.props.saveFunc("anim", checked);
		if (checked) {
			Svg.classList.add('Visualizer_Svg_Animated');
		} else {
			Svg.classList.remove('Visualizer_Svg_Animated');
		}
	}
	render() {
		return (<div>
					<PanelHeader>Основное</PanelHeader>
			<Group header={<div><Header>График</Header><Spacing separator size={16} /> </div>} description="Очень полезная самописная круговая диаграмма">
				<div className='ValueWidget'>
					<div className='ValueWidget_Visualizer Visualizer'>
						<svg className='Visualizer_Svg' version="1.1" width="300" height="300"
							viewBox="0 0 100 100"
							baseProfile="full"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g>
								<circle cx="50" cy="50" r="45"
									stroke="#DDD" fill='none' strokeWidth='10' />
								<circle cx="50" cy="50" r="45"
									stroke="#3f8ae0" fill='none' strokeWidth='10'
									transform="rotate(-90 50 50)"
									className='Visualizer_LoadStroke'
									strokeDashoffset="283" strokeDasharray="283">
								</circle>
							</g>
						</svg>
					</div>
					<div className="ValueWidget_ControlPanel ControlPanel">
						<div className="ControlPanel_Box">
							<SimpleCell after={<TooltipContainer style={{ position: 'relative', minWidth: "220px", marginLeft: "8px" }}><Tooltip
								isShown={this.state.Hint}
								onClose={() => {
									localStorage["Learns"] = 2
										this.setState({ Hint: false });
								}}
								text="Можно поиграть со слайдером"
								header="Мудрые слова"

							>
								<Slider value={this.props.value}
									min={0}
									max={100}
									onLoad={value1 => { this.doValue(value1)}}
									onChange={value1 => { this.doValue(value1)}}
								/>
							</Tooltip></TooltipContainer>}> Value</SimpleCell>
						</div>
						<div className="ControlPanel_Box" >
							<SimpleCell after={this.props.anim ? <Switch id="AnimButton" defaultChecked onClick={checked => this.doAnim()} />
								: <Switch id="AnimButton" onClick={checked => this.doAnim()} />}> Animate</SimpleCell>
							<SimpleCell after={this.props.hide ? <Switch id="HideButton" defaultChecked onClick={checked => this.doHide()} />
								: <Switch id="HideButton" onClick={checked => this.doHide()} />}>Hide</SimpleCell>
						</div>
					</div>
				</div>
			</Group></div>
		)
	}
}
class Else extends React.Component<{FMN, setModal}, { alert }>{
	constructor(props) {
		super(props);
		this.state = { alert: false};
	}
	changeTheme() {
		let scheme = document.getElementsByTagName("body")[0].getAttribute("scheme");
		document.getElementsByTagName("body")[0].removeAttribute("scheme");
		if (scheme == "bright_light") {
			document.getElementsByTagName("body")[0].setAttribute("scheme", "space_gray");
		} else {
			document.getElementsByTagName("body")[0].setAttribute("scheme", "bright_light");
		}
	}
	
	render() {
		return (
			<div>
				<PanelHeader>Настройки</PanelHeader>
				<Group header={<div><Header>Основная информация</Header><Spacing separator size={16} /> </div>}>
					<SimpleCell>
						<InfoRow header="Имя приложения">VKUI болванка</InfoRow>
					</SimpleCell>
					<SimpleCell>
						<InfoRow header="Разработчик">Я</InfoRow>
					</SimpleCell>
					<SimpleCell>
						<InfoRow header='Кто "я"?'>Смотря кто спрашивает</InfoRow>
					</SimpleCell>
				</Group>
				<Group header={<div><Header>Еще немного информации</Header><Spacing separator size={16} /> </div>}>
					<SimpleCell after={<Badge mode="prominent"/>}>
						<InfoRow header="Что-то важное" > Подробнее о чем-то важном</InfoRow>
					</SimpleCell>
					<SimpleCell>
						<InfoRow header="Больше информации">Просто заваливаем информацией</InfoRow>
					</SimpleCell>	
					<SimpleCell>
						<InfoRow header="У физрука было четыре сына:">Первый, второй, первый, второй</InfoRow>
					</SimpleCell>
				</Group>
				<Group header={<div><Header>А тут бац и кнопка будет</Header><Spacing separator size={16} /> </div>}>
					<SimpleCell after="Открыть" onClick={(e) => this.props.setModal("Social")}>
						Много приколюшек
					</SimpleCell>
					<SimpleCell after={document.getElementsByTagName("body")[0].getAttribute("scheme") == "bright_light" ? "Светлая тема" : "Темная тема"} onClick={(e) => this.changeTheme()}>
						Изменить тему
					</SimpleCell>
					<SimpleCell onClick={(e) => this.setState({ alert: true })} after={<Icon24Cancel />}>
						Сбросить обучение
					</SimpleCell>
					{this.state.alert && <Alert
						actions={[{
							title: 'Сбросить',
							mode: 'destructive',
							autoclose: true,
							action: () => { this.props.FMN() },
						}, {
							title: 'Отмена',
							autoclose: true,
							mode: 'cancel'
						}]}
						actionsLayout="horizontal"
						onClose={() => this.setState({ alert: false })}
						header="Ну рискни, блин"
						text="Ты просто хочешь все забыть?"
					/>}
				</Group>

					</div>
		)
	}
}