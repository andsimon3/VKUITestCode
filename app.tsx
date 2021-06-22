declare var require: any

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "@vkontakte/vkui/dist/vkui.css";
import {
	ConfigProvider, AdaptivityProvider, AppRoot, Root, View, Panel, Snackbar, Avatar, Group, SimpleCell,
	ModalPage, ModalRoot, ModalPageHeader, PanelHeaderBack, usePlatform, ANDROID, IOS, VKCOM  } from "@vkontakte/vkui";
import { Icon16Done, Icon24Reply, Icon24Home, Icon24FavoriteOutline } from '@vkontakte/icons';
import { WelcomeFirst, WelcomeSecond, WelcomeThird } from "./WelcomeView";
import { MainView } from "./MainView";
import bridge, { RequestPropsMap } from '@vkontakte/vk-bridge';


const Hello = (props) => {
	bridge.subscribe((e) => findSmtUsefull(e.detail));
	bridge.send("VKWebAppInit", {});
	const platform = usePlatform();
	const [Learn, setLearn] = React.useState(false);
	const [Panels, setPanels] = React.useState("welcome_first");
	const [isMobile, setPlatform] = React.useState(platform == ANDROID || platform == IOS);
	const [Views, setViews] = React.useState(!localStorage["Learns"] ? "welcome" : "main");
	const [modals, setModals] = React.useState(null);
	function findSmtUsefull(e) {
		switch (e.type) {
			case "VKWebAppUpdateConfig":
				document.getElementsByTagName("body")[0].setAttribute("scheme", e.data.scheme);
				if (e.data.viewport_height != undefined) { setPlatform(false) }
				break;
		}
	}
	function setPanel(str: string) {
		setPanels(str);
	}
	function setModal(a) {
		setModals(a);
	}
	function setView(str: string) {
		localStorage["Learns"] = 1
		setViews("main");
		setLearn(true);
	}
	function forgetMeNow() {
		localStorage["Learns"] = 0;
		setViews("welcome");
		setPanels('welcome_first');
	}
	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<Root activeView={Views}>
						<View id="welcome" activePanel={Panels}>
							<Panel id="welcome_first">
								<WelcomeFirst onPanelChange={setPanel} />
							</Panel>
							<Panel id="welcome_second">
								<WelcomeSecond onPanelChange={setPanel} />
							</Panel>
							<Panel id="welcome_third">
								<WelcomeThird onViewChange={setView} />
							</Panel>
						</View>
						<View id="main" activePanel="main" modal={
							<ModalRoot activeModal={modals}>
								<ModalPage id="Social" onClose={() => setModals(null)}
									header={
										<ModalPageHeader
											left={<PanelHeaderBack label="Назад" onClick={() => setModals(null)} />}
										>
											Плюшки
										</ModalPageHeader>
									}
									settlingHeight={80}>
									<Group>
										<SimpleCell after={<Icon24FavoriteOutline />} onClick={(e) => bridge.send("VKWebAppAddToFavorites")}>
											Добавить в избранное
										</SimpleCell>
										{isMobile ?
											<SimpleCell after={<Icon24Home />} onClick={(e) => bridge.send("VKWebAppAddToHomeScreen")}>
												Добавить на домашний экран
											</SimpleCell> :
											<SimpleCell>
												А на телефоне тут есть кнопочка
											</SimpleCell>
										}

										<SimpleCell after={<Icon24Reply />} onClick={(e) => bridge.send("VKWebAppShare", { "link": "https://vk.com/app7875963" })}>
											Поделиться ссылочкой ;)
										</SimpleCell>
										<SimpleCell >
											Не придумал что добавить, но что-то будет позже, я уверен...
										</SimpleCell>
									</Group>
								</ModalPage>
							</ModalRoot>
						}>
							<Panel id="main">
								<MainView FMN={forgetMeNow} viewWidth={null} platform={null} setModal={setModal} />
								{Learn && <Snackbar
									onClose={() => { setLearn(false); }}
									before={<Avatar size={24} style={{ background: 'var(--accent)' }}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
								>
									Обучение пройдено
								</Snackbar>}
							</Panel>
						</View>
					</Root>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);

}

ReactDOM.render(<Hello />, document.getElementById('root'));