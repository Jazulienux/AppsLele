import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import { AuthProvicer } from './controller/auth/Auth';
import Login from './controller/landing/Login';
import HeadersAdmin from './controller/admin/HeadersAdmin';
import HomeAdmin from './controller/admin/HomeAdmin';

class App extends Component {

  constructor() {
    super()
    this.state = {
      isLogged: false
    }
  }

  componentDidMount() {
    const stats = localStorage.getItem("usertoken");
    if (stats) {
      this.setState({ isLogged: true })
    }
    else {
      this.setState({ isLogged: false })
    }
  }

  render() {
    return (
      <AuthProvicer>
        <Router>
          {this.state.isLogged === false ? (
            <Redirect to="/login" />
          ) : (<HeadersAdmin />)
          }
          <Route exact path="/login" component={Login} />
        </Router>
      </AuthProvicer>
    )
  }
}

export default App;
