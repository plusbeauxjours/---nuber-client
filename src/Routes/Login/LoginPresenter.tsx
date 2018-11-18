import React from 'react';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps<any>{
    isLogged: boolean;
}

const LoginPresenter: React.SFC<IProps> = () => (<span>login</span>);

export default LoginPresenter; 