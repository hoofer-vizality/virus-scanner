import React from 'react';
import { shell } from 'electron';

import { Plugin } from '@vizality/entities';
import { patch, unpatch } from '@vizality/patcher';
import { getModule, getModuleByDisplayName, typing } from '@vizality/webpack';
import { Tooltip, Icon } from '@vizality/components/';
import { get, post } from '@vizality/http';
import { open as OpenModal } from '@vizality/modal';

const NoticeModal = require("./components/NoticeModal");

export default class VirusScanner extends Plugin {


    async scanUrl(url) {
        url = encodeURIComponent(url);

        var res = post(`https://www.virustotal.com/api/v3/urls`);
        res.set("Content-Type", "application/x-www-form-urlencoded")
        res.set("x-apikey", this.settings.get("apikey",""))
        res.send({ url: url }).then(body=>{
            var data = body.body.data.id.split("-")[1];
            vizality.api.popups.openPopup({ url: `https://www.virustotal.com/gui/url/${data}/detection` });
            //shell.openExternal(`https://www.virustotal.com/gui/url/${data}/detection`)
        }).catch(err=>{
            if (err.statusCode == 401){
                // unauthorized || invalid api key
                OpenModal(()=> <NoticeModal fieldType={"apikey"} settings={this.settings} content={"It appears you either haven't provided an API key yet, or an issue occured with your API key. Please enter your API key again."}/>)
            } else {
                // unknown error
                OpenModal(()=> <NoticeModal fieldType={"notice"} settings={this.settings} content={"An undocumented error has occured. Feel free to send this to the plugin developer, not sure why this would happen."}/>)
            }
        });
        
    }

    async start () {
        // inject into that juicy top bar
        
        const AttachmentContent = await getModule(["AttachmentUpload"], true)
        patch("attachment-field", AttachmentContent, "default", (args, res)=>{
            if (res.props?.children && res.props.children[2]?.props?.children){
                var url = args[0].url;
                res.props.children[2].props.children = [res.props.children[2].props.children];
                res.props.children.push(
                    <Icon 
                    name='CloudUpload' 
                    class='downloadButton-23tKQp'
                    tooltip='Scan File'
                    onClick={()=> this.scanUrl(url)}
                    />
                );
            }
            return res;
        })
    }

    stop () {
        unpatch("attachment-field")
    }
}
