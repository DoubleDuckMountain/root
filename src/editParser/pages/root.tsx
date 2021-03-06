/**
 * @overview generated by ghoti-cli
 * @fileoverview Root Route
 */

import { ipcRenderer } from 'electron';

import * as React from "react";

import Config from "../../config/config";

import Lunuh from '../components/lunuh';

import * as Cheerio from 'cheerio';
import Dropper from '../components/dropper';
import Loading from '../components/loading';
import printToString, { Print } from './print';
import Edit,{TMode} from './edit';

import * as fs from 'fs';
import * as path from 'path';
import { cleanImageList, comparePictureName, getInner, removeExtName } from '../lambda/parser';
import { availableDivider, IEach, IParsed } from './interface';

export interface IState {
    mode: "drag" | "export";
    filePath: string;
    mode2:TMode;
    repairBaseId: string;
    imageDevider: availableDivider;
    inner: IParsed;//all things u can see
}

class Root extends React.Component<{}, IState> {
    private $: CheerioStatic;

    public constructor(props: {}) {
        super(props);
        this.state = {
            mode: "drag",
            mode2:'invoice',
            filePath: '',
            repairBaseId: "",
            imageDevider: '+',
            inner: null,
        };
        this.onDrop = this.onDrop.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.upgradeMode = this.upgradeMode.bind(this);

        this.preparePictureList = this.preparePictureList.bind(this);

        this.parseOuterStatus = this.parseOuterStatus.bind(this);
        this.getExample = this.getExample.bind(this);
    }

    public render(): any {
        switch (this.state.mode) {
            case 'drag':
                return (<div className="entire theme-bg">
                    <Dropper onDrop={this.onDrop} onLoad={this.onLoad} />
                </div>);
            case 'export':
                if (this.$) {
                    return (<div className="entire theme-bg">
                        <Edit
                            content={this.state.inner}
                            mode2={this.state.mode2}
                            repairBaseId={this.state.repairBaseId}
                            updateContent={(content: IParsed) => {
                                this.setState({
                                    inner: content,
                                });
                            }}
                            upgradeMode={(mode2)=>{
                                this.setState({
                                    mode2
                                })
                            }}
                            />
                    </div>);
                } else {
                    return (<div className="entire theme-bg">
                        Processing
                </div>);
                }
            default:
                return (<div className="entire theme-bg">
                    404
            </div>);
        }
    }

    protected saveFile() {
        ipcRenderer.send('save-file', 'test', printToString(this.state.inner, this.state.repairBaseId));
    }

    protected onDrop() {
        this.setState({
            mode: 'export',
        });
    }
    protected upgradeMode(mode2: TMode, next?:() =>void){
        if(next){
            this.setState({
                mode2,
            }, next);
        } else {
            this.setState({
                mode2,
            });
        }
    }

    /**
     * When file loaded
     *
     * @protected
     * @param {string} content
     * @param {string} filePath
     * @memberof Root
     */
    protected onLoad(content: string, filePath: string) {
        console.log(path.join(filePath, '..'));
        this.setState({
            filePath: path.join(filePath, '..'),
        });
        this.$ = Cheerio.load(content);
        this.parseOuterStatus();
    }

    /**
     * TOTOTOTODO USE COMPARE PICTURENAME INSTEAD LATER
     *
     * @protected
     * @memberof Root
     */
    protected preparePictureList() {
        let inner = this.state.inner;

        let pictList: string[] = [];
        let fullPickList: string[] = [];

        const filePath = this.state.filePath;
        let stat = fs.statSync(filePath);

        let parsedList: Array<{
            name: string;
            used: boolean;
        }>;

        if (stat.isDirectory()) {
            pictList = fs.readdirSync(filePath);
            fullPickList = fs.readdirSync(filePath);

            parsedList = pictList.map((value) => {
                return {
                    name: value,
                    used: false,
                };
            });

            // template new mode [outer]-[number]-[any]

            parsedList = cleanImageList(parsedList);

            inner.totalImage = parsedList.length;

            for (let i of inner.list) {
                for (let j of i.each) {
                    for (let pict of parsedList) {
                        if (comparePictureName(pict.name, i.cate, j.item, this.state.imageDevider)) {
                            let realPath = path.join(filePath, pict.name);
                            if (!j.image) {
                                j.image = [];
                            }
                            pict.used = true;
                            j.image.push({
                                name: removeExtName(pict.name),
                                src: realPath,
                            });
                        }
                    }
                }
            }

            for (let pict of parsedList) {

                // LOGGING
                // console.log(pict);
                if (path.extname(pict.name).toLowerCase() !== '.jpg' && path.extname(pict.name).toLowerCase() !== '.jpeg') {
                    continue;
                }
                if (!pict.used) {
                    let realPath = path.join(filePath, pict.name);

                    if (pict.name.substring(0, 1) === '1') {
                        inner.unused.Exterior.push({
                            name: removeExtName(pict.name),
                            src: realPath,
                        });
                    } else if (pict.name.substring(0, 1) === '2') {
                        inner.unused.Interior.push({
                            name: removeExtName(pict.name),
                            src: realPath,
                        });
                    } else {
                        inner.unused.Other.push({
                            name: removeExtName(pict.name),
                            src: realPath,
                        });
                    }
                }
            }
        }
        this.setState({
            inner,
        })
    }

    protected parseOuterStatus() {
        let inner = this.state.inner;
        let entireList: IEach[] = getInner(this.$('#box-table-b').find('.tahoma12-gray'));

        let objList = this.$('.tahoma14-gold');

        let a = this.$('table').first();
        a = a.children().eq(0).children().eq(0).children().eq(1).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(3).children().eq(1).children().eq(0);
        a = a.children(); // tobody outer with start perptory estimate
        a = a.eq(1).children().eq(0).children().eq(0).children().eq(0).children(); // in side list
        // a = a.eq(3); // first three tr are empty // NAMES
        // a = a.eq(4); // 4 = edit estimate button, 5 = first title, 6 = first content
        // 7 = second title, 8 = second content

        a = a.eq(3).children().eq(2).children().eq(0).children().eq(0).children(); // name/ address/ shits

        let name = a.eq(0).children().eq(1).text();
        let address = a.eq(1).children().eq(1).text();
        let city = a.eq(2).children().eq(1).text();
        let year = a.eq(3).children().eq(1).text();
        let stories = a.eq(4).children().eq(1).text();
        let area = a.eq(5).children().eq(1).text();
        let totalCost = a.eq(6).children().eq(1).text();

        let bdate = this.$('#bdate').text().trim();

        inner = {
            name,
            address,
            city,
            year,
            stories,
            area,
            totalCost,
            bdate,
            list: [],
            totalImage: 0,
            unused: {
                Exterior: [],
                Interior: [],
                Other: [],
            },
        };
        let count = 5;
        let lim = 0;
        let temp: {
            cate: string;
            each: IEach[];
        };
        let escape = 0;
        for (let i = 0; i < entireList.length; escape++) {
            if (escape > 1000) {
                return;
            }
            if (entireList[i].item <= count) {
                count = 0;
                if (temp) {
                    inner.list.push(temp);
                }
                temp = {
                    cate: objList.eq(lim++).text().trim(),
                    each: [],
                };
            } else {
                temp.each.push(entireList[i]);
                count = entireList[i++].item;
            }
        }
        if (temp) {
            inner.list.push(temp);
        }
        this.setState({
            inner,
        }, this.preparePictureList);
    }

    protected getExample() {
        let imageExample: string;

        switch (this.state.imageDevider) {
            case '_':
                imageExample = 'Exterior Indoor_4_(2).jpg';
                break;
            case '-':
                imageExample = 'Basement-8.jpg (Not Suggested)';
                break;
            case '+':
                imageExample = 'Interior+3+Backup.jpg';
                break;
        }

        let unusedLength = this.state.inner.unused.Exterior.length + this.state.inner.unused.Interior.length + this.state.inner.unused.Other.length;

        return (<div style={{ marginTop: '5px' }}>
            <div><i className="fas fa-question-circle"></i>&nbsp;{imageExample}</div>
            <div>Matched: {this.state.inner.totalImage - unusedLength}/Total: {this.state.inner.totalImage}</div>
        </div>);
    }



    protected getTr(name: string, info: string, bold?: boolean) {
        return (<tr>
            <td style={{
                minWidth: '50px',
                fontWeight: bold ? "bold" : "normal",
                paddingLeft: '4px',
                paddingRight: '4px',
            }}>{name}</td>
            <td style={{
                fontWeight: bold ? "bold" : "normal",
                paddingLeft: '4px',
                paddingRight: '4px',
            }}>{info}</td>
        </tr>);
    }
}

export default Root;
