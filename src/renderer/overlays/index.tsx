import React, {useCallback} from "react";
import {NotificationRenderer} from "./NotificationRenderer";
import {DockerDemonNotificator} from "./DockerDemonNotificator";
import {GlobalLoader} from "./GlobalLoader";
import discord from "../assets/img/logo/Discord-Logo-White.svg";
import settings from "../assets/img/cog.svg";
import ReactTooltip from "react-tooltip";
import {shell} from "electron";
import {useHistory} from "react-router";
import {Routes} from "../constants/routes";
import {ipcRenderer} from "electron";

export const Overlays: React.FC = () => {
    const onDiscordClick = (): void => {
        shell.openExternal("https://discord.gg/ATcsRSN24v");
    };

    const history = useHistory();
    const onSettingsClick = useCallback((): void => {
        if (history.location.pathname !== Routes.SETTINGS) history.push(Routes.SETTINGS);
    }, [history]);
    ipcRenderer.on("open-settings-menu", onSettingsClick);

    return (
        <>
            <NotificationRenderer />
            <DockerDemonNotificator />
            <GlobalLoader />
            <div className='settings-overlay'>
                <ReactTooltip id='settings' place='right' className='hover-width' />
                <div onClick={onSettingsClick} data-tip='Settings' className='container' data-for='settings'>
                    <img src={settings} />
                </div>
            </div>
            <div className='discord-overlay'>
                <ReactTooltip id='discord' place='right' className='hover-width' />
                <div onClick={onDiscordClick} data-tip='Contact support' className='container' data-for='discord'>
                    <img src={discord} />
                </div>
            </div>
            <div className='version-overlay'>v{process.env.npm_package_version}</div>
        </>
    );
};
