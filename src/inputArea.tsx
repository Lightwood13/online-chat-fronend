import React, { ChangeEvent, FormEvent } from 'react';

type InputAreaProps = {
    onSubmit: (name: string, value: string) => void;
}

type InputAreaState = {
    name: string
    inputValue: string
}

export class InputArea extends React.Component<InputAreaProps, InputAreaState> {
    constructor(props: InputAreaProps) {
        super(props);
        this.state = {
            name: '',
            inputValue: ''
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({...this.state, name: event.target.value});
    }

    handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({...this.state, inputValue: event.target.value});
    }

    handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.onSubmit(this.state.name, this.state.inputValue);
    }

    render(): JSX.Element {
        return (
            <form className='input-area' onSubmit={this.handleSubmit}>
                <input
                    className='name-field'
                    name={this.state.name}
                    onChange={this.handleNameChange}
                />
                <input 
                    className='input-field' 
                    value={this.state.inputValue}
                    onChange={this.handleInputChange}
                />
                <button className='send-button'>Send</button>
            </form>
        );
    }
}