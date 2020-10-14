import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import {BrowserRouter} from 'react-router-dom'
import AppStore from './Store';
import IdleTimer from 'react-idle-timer'
import {LogoutFront} from './Actions/Auth'
import WebRouter from './Router'; 
import './App.css';

const mapStateToProps = (state) =>({});
const mapDispatchToProps = (dispatch) => ({});

const RouteApp = connect(mapStateToProps, mapDispatchToProps)(WebRouter);
class App extends Component{ 
  
  constructor(props) {
    super(props)
    this.idleTimer = null
    this.onIdle = this._onIdle.bind(this)
  }
  
  _onIdle(e) {
    let _details = LogoutFront()
    console.log('_details', _details)
  }

  render(){
      return <Provider store={AppStore}>
            <BrowserRouter>
               <IdleTimer
                ref={ref => { this.idleTimer = ref }}
                element={document}
                onActive={this.onActive}
                onIdle={this.onIdle}
                onAction={this.onAction}
                debounce={0}
                timeout={2000 * 60 * 15} 
               />
                <RouteApp/>
            </BrowserRouter>
        </Provider>
  }
}
export default App;