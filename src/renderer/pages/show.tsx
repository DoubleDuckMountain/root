/**
 * @author WMXPY
 * @overview generated by ghoti-cli
 * @fileoverview Page set show
 */

import * as React from 'react';

import Config from '../../config/config';

import { IItem, IPage } from './interface';

import * as fs from 'fs';
import * as path from 'path';
import logo from './logo';

export interface IProps {
    page: IPage;
    updatePage?: (page: IPage) => void;
    noPicture?: boolean;
    isPrint?: boolean;
}

export interface IState {
    mode: 'invoice' | 'workorder';
}
/**
         * FOR MAINTAINER
         * MAKE SURE THIS part is not editable
         */
const s = {
    td: {
        border: '1px solid black',
    },
    th: {
        textAlign: 'center',
        border: '1px solid black',
    },
    div: {
        padding: '3px',
    },
    entireDiv: {
        border: '1px solid black',
    },
    topDiv: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tdInvisable: {
        border: '1px solid black',
    },
    lowDiv: {

    },
};

class Show extends React.Component<IProps, IState> {
    public constructor(props) {
        super(props);
        this.mapItem = this.mapItem.bind(this);
        this.state = {
            mode: 'invoice',
        };
    }

    public render(): JSX.Element {
        let tax: number = 0;
        let taxTotal: number = 0;
        let total: number = 0;
        for (let i of this.props.page.item) {
            total += (i.amount ? i.amount : 0);
            if (i.taxable) {
                taxTotal += (i.amount ? i.amount : 0);
            }
        }
        tax = taxTotal * (this.props.page.tax ? this.props.page.tax : 0) * 0.01;
        total += tax;

        return (<div>
            <button onClick={() => {
                this.setState({
                    mode: (this.state.mode === 'invoice') ? 'workorder' : 'invoice',
                });
            }}></button>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                height: '100px',
                backgroundColor: this.state.mode === 'invoice' ? 'red' : 'blue',
                alignItems: 'center',
            }}>
                <img src={logo} alt="logo" style={{
                    width: '70px',
                    height: '50px',
                }} />
                <div style={{
                    flex: 1,
                    paddingLeft: '10px',
                    paddingTop: '20px',
                    display: 'inline',
                    fontSize: '20px',
                    color: 'darkblue',
                    fontWeight: 'bold',
                }}>
                    Repair and Preservation Network, LLC
                </div>
                <div style={{
                    width: '30%',
                    fontSize: '45px',
                    fontWeight: 'bold',
                    color: 'lightblue',
                    textAlign: 'center',
                }}>INVOICE</div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 3 }}>
                    1213 Colony Dr.<br />
                    Hartsdale, NY 10530<br />
                    Phone: (646)-568-0008
                </div>
                <div style={{ flex: 2 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={(s.td as any)}>
                                    Invoice Number
                                </td>
                                <td style={(s.td as any)}>
                                    {this.props.page.invoice}
                                </td>
                            </tr>
                            <tr>
                                <td style={(s.td as any)}>
                                    Completion Date
                                </td>
                                <td style={(s.td as any)}>
                                    {this.parseDate(this.props.page.completionDate)}
                                </td>

                            </tr>
                            <tr>
                                <td style={(s.td as any)}>
                                    Invoice Date
                                </td>
                                <td style={(s.td as any)}>
                                    {this.parseDate(this.props.page.invoiceDate)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <table style={{
                width: '100%',
                border: '3px solid black',
                marginTop: '15px',
                borderCollapse: 'collapse',
            }}>
                <thead>
                    <tr style={{ border: '3px solid black' }}>
                        <th style={{ ...(s.th as any), width: "66%" }}>BILL TO</th>
                        <th style={(s.th as any)}>ADDRESS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ width: "66%", border: '1px solid black', padding: '5px' }}>{this.props.page.billTo.split('\n').map((value, index) => {
                            return <div key={index}>{value}</div>;
                        })}</td>
                        <td style={{ border: '1px solid black', padding: '5px' }}>{this.props.page.address.split('\n').map((value, index) => {
                            return <div key={index}>{value}</div>;
                        })}</td>
                    </tr>
                </tbody>
            </table>
            <table style={{
                width: '100%',
                border: '1px solid black',
                marginTop: '15px',
                borderCollapse: 'collapse',
            }}>
                <thead>
                    <tr>
                        <th style={{ ...(s.th as any), width: "80%", ...s.td }}>ITEM</th>
                        <th style={{ ...s.td, ...(s.th as any) }}>AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.page.item.map(this.mapItem)}
                    <tr>
                        <td style={(s.td as any)}>
                            <div style={{
                                padding: '3px',
                            }}>
                                HOA: Sales tax {this.props.page.tax ? this.props.page.tax : 0}%
                            </div>
                        </td>
                        <td style={{
                            ...(s.td as any),
                            padding: '3px',
                            fontWeight: 'bold',
                        }}>
                            <div style={{ display: 'flex' }}>
                                <div>$</div>
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                    {tax ? tax.toFixed(2) : 0}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={(s.td as any)}>
                            <div style={{
                                padding: '3px',
                                display: 'flex',
                            }}>
                                <div style={{ flex: 1, textAlign: 'center' }}>Thank you for your bussiness</div>
                                <div style={{
                                    fontWeight: 'bold',
                                }}>Total</div>
                            </div>
                        </td>
                        <td style={{
                            ...(s.td as any),
                            padding: '3px',
                            fontWeight: 'bold',
                        }}>
                            <div style={{ display: 'flex' }}>
                                <div>$</div>
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                    {total ? total.toFixed(2) : 0}
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style={{
                textAlign: 'center',
                backgroundColor: 'lightblue',
                marginTop: '15px',
            }} className="div-footer">
                <div>If you have any questions about this invoice, please contact us at:</div>
                <a href="mail: info@rpncomplany.com">info@rpncompany.com</a>
            </div>
        </div >);
    }

    protected parseDate(da: string | Date): string {
        let year: string;
        let month: string;
        let day: string;
        if (da instanceof Date) {
            year = da.getFullYear().toString();
            month = (da.getMonth() + 1).toString();
            day = da.getDate().toString();
        } else {
            let parsed: string[] = da.split('-');
            if (parsed.length < 3) {
                return da;
            }
            year = parsed[0];
            month = parsed[1];
            day = parsed[2];
        }
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return `${month}/${day}/${year}`;
    }

    protected base64_encode(file: string): string {
        /**
         * FOR MAINTAINER
         * if this.props.isprint means use is printing this page who have full access to file:// protocol
         * If not, read the file ourself and return as base64 string
         */
        if (file.length < 1) {
            return '';
        }

        if (this.props.isPrint) {
            return file;
        }

        let extensionName: string = path.extname(file);
        let bitmap: Buffer;

        /**
         * FOR MAINTAINER
         * This is a bad practice, use sync reading will cause big picture load stuck render thread.
         * ToFIXIT: Fix it by use async reading function, but be aware user may add picture again dring async reading, make sure to disable upload button during async file reading.
         */
        try {
            bitmap = fs.readFileSync(file);
        } catch (err) {
            return '';
        }
        let base64Image: string = new Buffer(bitmap).toString('base64');
        let imgSrcString: string = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
        return imgSrcString;
    }

    protected mapItem(value: IItem, index: number): JSX.Element {
        const mapPicture = (picture: string, pictureIndex: number) => {
            if (!picture) {
                return void 0;
            }
            return (<div key={pictureIndex} style={{
                flex: 1,
                // minWidth: '33%',
                minWidth: '220px',
                maxWidth: '220px',
                padding: '3px',
            }} >
                <img
                    style={{
                        width: '100%',
                        height: 'auto',
                        border: '1px solid black',
                    }}
                    src={this.base64_encode(picture)}
                />
            </div>);
        };

        const buildPicture = (pictureE: string[]) => {

            const picture = [...pictureE];
            let pictureList: any[] = [];
            let tempList: string[] = [];
            let key: number = 0;
            while (picture.length > 0) {
                /**
                 * FOR MAINTAINER
                 * FOR KEY! this is a bad practice, due to key change, the entire component list may rendered again due to small change.
                 * TOFIXIT: use individual key value.
                 */
                if (tempList.length >= 3) {
                    pictureList.push(<tr key={key++}>
                        <td style={(s.tdInvisable as any)} colSpan={2}>
                            <div style={s.div}>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                }}>{tempList.map(mapPicture)}</div>
                            </div>
                        </td>
                    </tr>);
                    tempList = [];
                }
                tempList.push(picture.shift());
            }
            if (tempList.length > 0) {
                pictureList.push(<tr key={key}>
                    <td style={(s.tdInvisable as any)} colSpan={2}>
                        <div style={s.div}>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                            }}>{tempList.map(mapPicture)}</div>
                        </div>
                    </td>
                </tr>);
            }
            return pictureList;
        };

        if (this.props.noPicture) {
            return (<tr key={index}>
                <td style={(s.td as any)}>
                    <div style={{
                        padding: '3px',
                    }}>{index + 1}.&nbsp;{value.description}</div>
                </td>
                <td style={{
                    ...(s.td as any),
                    padding: '3px',
                    fontWeight: 'bold',
                }}>
                    <div style={{ display: 'flex' }}>
                        <div>$</div>
                        <div style={{ flex: 1, textAlign: 'right' }}>
                            {value.amount ? value.amount.toFixed(2) : 0}
                        </div>
                    </div>
                </td>
            </tr>);
        }

        return (<React.Fragment key={index}><tr>
            <td style={(s.td as any)}>
                <div style={{
                    padding: '3px',
                }}>{index + 1}.&nbsp;{value.description}</div>
            </td>
            <td style={{
                ...(s.td as any),
                padding: '3px',
                fontWeight: 'bold',
            }}>
                <div style={{ display: 'flex' }}>
                    <div>$</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                        {value.amount ? value.amount.toFixed(2) : 0}
                    </div>
                </div>
            </td>
        </tr>
            {value.before.length > 0 ?
                <React.Fragment>
                    <tr>
                        <td style={(s.topDiv as any)} colSpan={2}>Before</td>
                    </tr>
                    {buildPicture(value.before)}
                </React.Fragment>
                : void 0}
            {value.during.length > 0 ?
                <React.Fragment>
                    <tr>
                        <td style={(s.topDiv as any)} colSpan={2}>During</td>
                    </tr>
                    {buildPicture(value.during)}
                </React.Fragment>
                : void 0}

            {value.after.length > 0 ?
                <React.Fragment>
                    <tr>
                        <td style={(s.topDiv as any)} colSpan={2}>After</td>
                    </tr>
                    {buildPicture(value.after)}
                </React.Fragment>
                : void 0}
        </React.Fragment>);
    }
}

export default Show;
