import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, Button, SearchBar, Anchor, Divider, Text } from "@vizality/components"
import { TextArea } from "@vizality/components/settings"
import { close as CloseModal } from '@vizality/modal';

const FormTitle = getModuleByDisplayName('FormTitle')

module.exports = class NoticeModal extends React.PureComponent {
    constructor(props){
        super(props)
        this.textAreaText = ""
        
    }


    render() {
        return <>
            <Modal size={Modal.Sizes.SMALL} className="lf-modal-main">
                <Modal.Header>
                <FormTitle tag={FormTitle.Tags.H2} style={{margin: "0px"}}>Uh oh!</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <Text>{this.props.content}<br/><br/><b>If you do not have an API key, you may obtain one through VirusTotal for free.</b></Text>
                    <Divider style={{"margin-bottom":"10px"}}/>
                    {this.props.fieldType === "apikey" ? <TextArea onChange={(val)=>{
                        this.textAreaText = val;
                    }} type="password">API Key - DO NOT SHARE YOUR API KEY</TextArea> : <></>}
                </Modal.Content>
                <Modal.Footer justify={"justifyCenter--8YVyf"} wrap={"wrap-ZIn9Iy"}>
                    <Button size={Button.Sizes.XLARGE} color={Button.Colors.GREEN} onClick={()=>{
                        if (this.props.fieldType === "apikey"){
                            this.props.settings.set("apikey",this.textAreaText)
                        }
                        CloseModal();
                    }}>{`Got it!`}</Button>
                    <div style={{margin: "5px"}}></div>
                    <Button size={Button.Sizes.XLARGE} color={Button.Colors.GREY} onClick={()=>{
                        CloseModal();
                    }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
    }
}