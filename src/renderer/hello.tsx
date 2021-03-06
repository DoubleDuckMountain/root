/**
 * @overview generated by ghoti-cli
 * @fileoverview Page Index
 */

import { ipcRenderer, shell } from "electron";

import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import * as Pages from "./pages/import";

import "../style/global.sass";

class Hello extends React.Component<{}, {}> {

    public constructor(props: {}) {
        super(props);
    }

    public render(): any {
        return (
            <React.Fragment>
                <Route path="/" exact component={Pages.Root} />
            </React.Fragment>
        );
    }
}

export default Hello;
