/**
 * @overview generated by ghoti-cli
 * @fileoverview Root Route
 */

import { ipcRenderer, app, BrowserWindow, dialog, Event, ipcMain, Menu, shell } from 'electron';
import * as React from "react";
import { renderToString } from 'react-dom/server';


import Config from "../../config/config";
import createParser, { destroyParser } from "../../main/parser";
//import createParser, { destroyParser } from "./parser";

import { IItem, IPage } from './interface';
import { IParsed } from '../../editParser/pages/interface';

import Edit from './edit';
import Show, { TMode } from './show';

import * as fs from 'fs';

export interface IState {
    page: IPage;
    mode: TMode;
    saveStatus: string;
    isMaximze: boolean;
}

let win: BrowserWindow;
const createWindow: () => void = () => {
    win = new BrowserWindow({
        width: 1850,
        height: 1020,
        show: false,
        frame: false,
        backgroundColor: Config.backgroundColor,
    });
    win.loadURL(`file://${__dirname}/../../anotherone/index.html`);
    win.webContents.openDevTools();
}

class Root extends React.Component<{}, IState> {
    private interval: any;

    public constructor(props) {
        super(props);
        this.state = {

            page: this.init(),
            mode: 'invoice',

            isMaximze: false,
            saveStatus: '',
        };

        this.updatePage = this.updatePage.bind(this);
        this.renderPicture = this.renderPicture.bind(this);
        this.renderNoPicture = this.renderNoPicture.bind(this);
        this.onChangeMaxStatus = this.onChangeMaxStatus.bind(this);
        this.upgradeMode = this.upgradeMode.bind(this);
        this.iparsedToIPage = this.iparsedToIPage.bind(this);

        this.saveFile = this.saveFile.bind(this);
        this.loadFile = this.loadFile.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.mentionSave = this.mentionSave.bind(this);
    }

    public componentDidMount() {
        ipcRenderer.send('register');
        ipcRenderer.on(('max-status'), this.onChangeMaxStatus);
        this.mentionSave();
    }

    public componentWillUnmount() {
        ipcRenderer.removeListener('max-status', this.onChangeMaxStatus);
    }

    public render(): any {
        return (<div className="outer">
            <div className="title">
                <div className="p6"><i className="fas fa-receipt"></i>&nbsp;RPN Invoice</div>
                <div className="save-status-container">
                    <button onClick={this.saveFile} title="save">
                        <i className="fas fa-save"></i>
                    </button>
                    <button onClick={this.loadFile} title="open">
                        <i className="fas fa-folder-open"></i>
                    </button>
                    <div className={"save-status" + (this.state.saveStatus ? " active" : "")}>{this.state.saveStatus}</div>
                </div>
                <div className="seprate"></div>
                <button className="big" onClick={this.renderNoPicture} title="export to pdf">
                    <i className="far fa-file-pdf"></i>
                    &nbsp;/&nbsp;
                    <i className="fas fa-font"></i>
                </button>
                <button className="big" onClick={this.renderPicture} title="export to pdf">
                    <i className="fas fa-file-pdf"></i>
                    &nbsp;/&nbsp;
                    <i className="far fa-image"></i>
                </button>
                <div className="seprate"></div>
                <button onClick={() => {
                    ipcRenderer.send('window-control', 'min');
                }} title="minimize"><i className="fas fa-window-minimize"></i></button>
                <button onClick={() => {
                    ipcRenderer.send('window-control', 'max');
                }} title="maximize">
                    {this.state.isMaximze ? <i className="far fa-window-restore"></i> : <i className="far fa-window-maximize"></i>}
                </button>
                <button onClick={() => {
                    ipcRenderer.send('window-control', 'close');
                }} title="close"><i className="far fa-window-close"></i></button>
            </div>
            <div className="content">
                <div className="edit">
                    <Edit
                        page={this.state.page}
                        updatePage={this.updatePage}
                    />
                </div>
                <div className="show">
                    <Show page={this.state.page}
                        mode={this.state.mode}
                        updatePage={this.updatePage}
                        upgradeMode={(mode) => {
                            this.setState({
                                mode,
                            })
                        }}
                    />
                </div>
            </div>
        </div>
        );
    }

    /**
     * Convert IParsed Object to IPage object
     *
     * @protected
     * @param {IParsed} parsed
     * @returns {IPage}
     * @memberof Root
     */
    protected iparsedToIPage(parsed: IParsed): IPage {
        const uniqueIdSmall = () => {
            return '_' + Math.random().toString(36).substring(2, 9);
        };
        let pagei: IPage = {
            invoice: '',
            billTo: '',
            address: '',
            completionDate: new Date().toString(),
            invoiceDate: new Date(),
            item: [],
            tax: 0,
        };

        for (let list of parsed.list) {
            for (let current of list.each) {
                pagei.item.push({
                    description: current.description,
                    unique: uniqueIdSmall(),
                    amount: current.cost,
                    taxable: true,
                    before: [...current.image ? current.image.map((picture) => picture.src) : []],
                    during: [],
                    after: [],
                });
            }
        }
        return pagei;
    }

    protected mentionSave() {
        this.interval = setTimeout(() => {
            this.changeStatus('Time to save');
        }, 300000);
    }



    protected changeStatus(status: string) {

        /**
         * FOR MAINTAINER
         * Interval can only have one at the same time, MAKESURE to call changestatus instead create your own timeout function
         */
        clearTimeout(this.interval);
        this.setState({
            saveStatus: status,
        });
        this.interval = setTimeout(() => {
            this.setState({
                saveStatus: '',
            });
            this.mentionSave();
        }, 2000);
    }

    protected saveFile() {
        ipcRenderer.once('save-page-re', (event, arg) => {
            if (arg) {
                fs.writeFile(arg, JSON.stringify(this.state.page), (err) => {
                    if (err) {
                        this.changeStatus('Error!');
                    } else {
                        this.changeStatus('Succeed');
                    }
                });
            } else {
                this.changeStatus('Canceled');
            }
        });
        ipcRenderer.send('save-page', 'invoice-save');
    }

    protected loadFile() {

        /**
         * FOR MAINTAINER
         * receive response from ipcmain, read: src/main/index.js
         */
        ipcRenderer.once('load-page-re', (event, arg) => {
            if (arg) {
                if (arg.length > 0) {
                    fs.readFile(arg[0], (err, content) => {
                        if (err) {
                            this.changeStatus('Error!');
                        } else {
                            let parsed: IPage = JSON.parse(content.toString());

                            if (!Boolean(parsed.invoice)) {
                                parsed = this.iparsedToIPage((parsed as any));
                            }

                            parsed.invoiceDate = new Date(parsed.invoiceDate);

                            this.setState({
                                page: parsed,
                            });
                            this.changeStatus('Succeed');
                        }
                    });
                }
            } else {
                this.changeStatus('Canceled');
            }
        });
        ipcRenderer.send('load-page', 'invoice-save');
    }

    protected onChangeMaxStatus(event: any, status: boolean) {
        this.setState({
            isMaximze: status,
        });
    }

    protected renderPicture() {
        ipcRenderer.send('save-file', 'invoice-save', renderToString(<Show page={this.state.page} mode={this.state.mode} isPrint />));
    }

    protected renderNoPicture() {
        ipcRenderer.send('save-file', 'invoice-save', renderToString(<Show page={this.state.page} mode={this.state.mode} noPicture isPrint />));
    }

    protected updatePage(page: IPage, next?: () => void) {

        /**
         * FOR MAINTAINER
         * If a function need to be called after page updated, use it here
         * This is not a good practice pattern, you shall use the pricatice in parser 'this.inner' style
         * Read: src/anotherone/page/root.tsx
         */
        if (next) {
            this.setState({
                page,
            }, next);
        } else {
            this.setState({
                page,
            });
        }
    }

    protected upgradeMode(mode: TMode, next?: () => void) {
        if (next) {
            this.setState({
                mode,
            }, next);
        } else {
            this.setState({
                mode,
            });
        }
    }

    protected init(): IPage {
        return {
            invoice: '',
            billTo: '',
            address: '',
            completionDate: '',
            invoiceDate: new Date(),
            item: [],
            tax: 0,
        };
    }
}

export default Root;
