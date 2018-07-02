import React, { Component } from 'react';
import s from './app.css';


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { username: null };
  }

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {

    console.log("importning styles: " + s.purple) //undefined

    return (
      <div className='blah blah'>
        {this.state.username ? (
          <h1 className={s.purple}>v{this.state.username}</h1>
        ) : (
          <h1>Loading.. please wait!</h1>
        )}
      </div>
    );
  }
}
