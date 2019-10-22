/* NPM modules */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
/* Material UI */
/* Own modules */
import Home from '../Home/Home';
import AdvertDisplay from '../AdvertDisplay/AdvertDisplay';
import AdvertEdit from '../AdvertEdit/AdvertEdit';
import Error404 from '../Error404/Error404';
import Register from '../Register/Register';
import LocalStorage from '../../utils/Storage';
import { UserProvider } from '../../context/UserContext';
/* Assets */
/* CSS */

/**
 * Main App
 */
export default class App extends Component {
  /**
   * Constructor
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    // Intento recuperar la sesión del storage
    const user = LocalStorage.readLocalStorage();
    this.state = {
      session: user
    }
  }

  /**
   * Render
   */
  render() {   
    return (
      <UserProvider value={this.state}>
          <Router>
            <Switch>
                <Route path='/register' exact component={Register} />
                <Route path='/advert/display' exact component={AdvertDisplay} />
                <Route path='/advert/create' exact render={(props) => <AdvertEdit {...props} title='Crear anuncio' mode={'C'}/>}/>
                <Route path='/advert/edit' exact render={(props) => <AdvertEdit {...props} title='Editar anuncio' mode={'U'}/>}/>
                <Route path='/' exact component={Home} />
                <Route component={Error404} />
            </Switch>
          </Router>
      </UserProvider>
    );
  }
}