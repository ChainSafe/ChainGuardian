import React, { Component } from 'react'
import KeyModalContent from '../../../components/KeyModalContent/KeyModalContent'
import { Routes } from '../../../constants/routes'

export default class SigningKeyImport extends Component<{ history: any }, {}> {
    render() {
        return (
            <KeyModalContent title="Enter your signing key" onSubmit={this.handleSubmit} />
        )
    }

    private handleSubmit= (input: string) => {
        this.props.history.push(Routes.ONBOARD_ROUTE_EVALUATE('2', 'b1'))
    }

}
