import React from 'react';
import css from './css/main.css'

export class MainPage extends React.PureComponent
{
    render()
    {
        return (<h1 className={css.red+' '+css.bold}>is working!</h1>);
    }
}