import React, { Component } from 'react'
import PropTypes from 'prop-types'

class RegisterAsset extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;
        this.onAssetCreated = this.onAssetCreated.bind(this);
        this.onContractError = this.onContractError.bind(this);
        this.handleRegisterAsset = this.handleRegisterAsset.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            identifier: '',
            assetName: '',
            showTxMsg: false,
            txMsg: '',
            txClassName: '',
            date: Math.floor(new Date().getTime() / 1000),
            isEnabled: false
        };
        this.contracts.AssetTracker.events
            .AssetCreated({/* eventOptions */}, this.onAssetCreated)
            .on('error', this.onContractError);
    }

    onAssetCreated(error, event) {
        if (!error) {
            this.setState({
                showTxMsg: true,
                txMsg: 'Asset was created with Id: ' + this.web3.utils.toUtf8(event.raw.data),
                txClassName: "success"
            });
        } else {
            this.onContractError(error);
        }
    }

    onContractError(error) {
        this.setState({
            showTxMsg: true,
            txMsg: 'An error occured: ' + error.message,
            txClassName: "error"
        });
    }

    handleInputChange(event) {
        var isEnabled = this.state.assetName.length > 0 &&
            this.state.identifier.length > 0;
        this.setState({[event.target.name]: event.target.value, showTxMsg: false, isEnabled: isEnabled})
    }

    render() {
        return (
            <div className="pure-u-1-1">
                <h2>Register Asset</h2>
                <br/><br/>
                <form className="pure-form pure-form-aligned">
                    <fieldset>
                        <div className="pure-control-group">
                            <label htmlFor="identifier">Id</label>
                            <input name="identifier" type="text" value={this.state.id} onBlur={this.handleInputChange} onChange={this.handleInputChange}
                                   placeholder="Asset Id" required={true}/>
                        </div>

                        <div className="pure-control-group">
                            <label htmlFor="name">Name</label>
                            <input name="assetName" type="text" value={this.state.name} onBlur={this.handleInputChange}
                                   onChange={this.handleInputChange} placeholder="Asset Name" required={true}/>
                        </div>

                        <div className="pure-controls">
                            <button type="button" className="pure-button pure-button-primary" disabled={!this.state.isEnabled}
                                    onClick={() => this.handleRegisterAsset()}>Submit
                            </button>
                        </div>
                        <br/>
                        <span hidden={!this.state.showTxMsg} className={'pure-form-message ' + this.state.txClassName }>{this.state.txMsg}</span>
                    </fieldset>
                </form>
            </div>
        )
    }

    handleRegisterAsset() {
        this.contracts.AssetTracker.methods.registerAsset(this.state.date, this.state.assetName, this.web3.utils.fromAscii(this.state.identifier)).send()
            .on('error', this.onContractError);
    }

}

RegisterAsset.contextTypes = {
    drizzle: PropTypes.object
};

export default RegisterAsset
