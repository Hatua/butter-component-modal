import React, { Component } from 'react';
import { translate } from 'react-i18next';
import style from './style.styl';

import Row from '../row';
import Button from '../button';
import Switch from '../switch';
import Dropdown from '../dropdown';
import ActionBar from '../action-bar';

//Test themes
function toggle(){
    const root = document.getElementById('root');
    root.className = (root.className === 'theme-dark') ? 'theme-pink' : 'theme-dark';
}

class Action extends Component {
    constructor (props) {
        super()
        let {id, settings} = props
        this.apply = (value) => settings.set(id, value)
    }

    render() {
        let {type, settings, id, t, ...props} = this.props
        let value = settings[id]
        return (
            (type === 'BUTTON')?(<Button text={t(props.text)}/>):
            (type === 'TEXT')?(<input type="text" value={value}/>):
            (type === 'PASSWORD')?(<input type="password"/>):
            (type === 'DROPDOWN')?(<Dropdown apply={this.apply} selected={value} {...props}/>):
            (type === 'SWITCH')?(<Switch apply={this.apply} selected={value}/>):
            (<b>Couldn't find an apropiate action type {console.log(type, props)}</b>)
        )
    }
}

let TabPanel = ({t, id, items, settings, showAdvanced}) => (
    <div role="tabpanel" className={style["tab-panel"]} id={id}>
        <section id={id}>
            {items.map((e, i) => {
                 let {action, advanced, ...rest} = e
                 if (advanced && ! showAdvanced) {
                     return
                 }

                 let actionElement = (<Action t={t} id={e.id} settings={settings} {...action}/>)
                 return (
                     <Row key={i} action={actionElement} {...rest}/>
                 )
             })}
        </section>
    </div>
)

export default class Tabs extends Component {
    constructor (props) {
        super()
        this.state = {
            selected: props.selected || 0,
            showAdvanced: props.showAdvanced || false
        }
    }

    toggleAdvanced () {
        this.setState({showAdvanced: !this.state.showAdvanced})
    }

    render () {
        let {props, state} = this
        return (
            <div>
                <div className="navbar-s">
                    <ActionBar {...props} action={{toggleAdvanced: this.toggleAdvanced.bind(this)}}/>
                    <br/>
                    <ul id="myTabs" className={style.tabs} role="tablist">
                        {props.tabs.map((t, i) => (
                             <li className={'source ' + (i === state.selected?'active':'')} key={i} href={'#' + t.id} aria-controls={t.id} role="tab" data-toggle="tab">
                                 {props.t(t.title)}
                             </li>
                         ))}
                    </ul>
                </div>
                <div id="tabPanels" className={style['tabs-content']}>
                    {props.tabs.map((t, i) => (
                         <TabPanel key={i} t={props.t}
                                   selected={state.selected === i}
                                   showAdvanced={state.showAdvanced}
                                   settings={props.settings}
                                   {...t} />
                     ))}
                <div className={style['buttons-content']}>
                        <Button type="secondary" icon="delete_forever" text={props.t('Flush all databases')}/>
                        <Button type="secondary" icon="format_paint" text={props.t('Toggle theme')} handler={toggle}/>
                        <Button type="secondary" icon="restore" text={props.t('Reset to Default Settings')}/>
                    </div>
                </div>
            </div>
        )
    }
}
