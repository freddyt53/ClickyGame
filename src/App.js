import React, { Component } from "react";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Header from './components/Header';
import Item from './components/Item';
import teams from './teams.json';
import './App.css';


class App extends Component {
  constructor() {
    super()

    this.handleShuffleTeams = this.handleShuffleTeams.bind(this)
  }

  state = {
    score: 0,
    topScore: 0,
    maxScore: 12,
    message: "Click an image to begin!",
    messageClass: "",
    teams: teams
  };

  shuffle = (array) => {
    let currentIndex = array.lenght;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleCorrectSelection = () => {
    if (this.state.score + 1 > this.state.topScore) {
      this.setState({ topScore: this.state.topScore + 1 })
    }
    if (this.state.score + 1 === this.state.maxScore) {
      this.setState({ score: this.state.score + 1, message: 'Congrats! You win!', messageClass: "correct" })
    } else {

      this.setState({ score: this.state.score + 1, message: 'You guessed correctly!', messageClass: 'correct' })
    }
  }


  handleResetWin = (currentTeams) => {
    if (this.state.score + 1 === this.state.maxScore) {
      this.setState({ score: 0, topScore: 0 })
      const updatedTeams = currentTeams.map(team => (true) ? { ...team, isClicked: false } : team)
      return updatedTeams
    } else {
      return currentTeams
    }
  }

  handleIncorrectSelection = () => {
    this.setState({ score: 0, message: 'You guessed incorrectly!' })
    const updatedTeams = this.state.teams.map(teams => teams.isClicked === true ? { ...teams, isClicked: false } : teams)
    return updatedTeams
  }

  handleShuffleTeams = (name) => {
    var resetNeeded = false;
    const teams = this.state.teams.map(teams => {
      if (teams.name === name) {
        if (teams.isClicked === false) {
          this.handleCorrectSelection()
          return { ...teams, isClicked: true }
        } else {
          resetNeeded = true
          return { ...teams, isClicked: false }
        }
      }
      return teams
    })
    if (resetNeeded) {
      this.setState({
        teams: this.shuffle(this.handleIncorrectSelection()),
        messageClass: 'incorrect'
      })
    } else {
      this.setState({ teams: this.shuffle(this.handleResetWin(teams)) })
    }
  }

  handleRenderTeams = () => {
    return this.state.teams.map((teams) =>
      <Item
        image={teams.image}
        name={teams.name}
        key={teams.id}
        onClick={this.handleShuffleTeams}
      />
    );
  }

  render() {
    return (
      <div className='App'>
        <Navbar
          score={this.state.score}
          topScore={this.state.topScore}
          message={this.state.message}
          messageClass={this.state.messageClass}
        />


        <Header />
        <div className='content'>
          {this.handleRenderTeams()}
        </div>
        <Footer />
      </div>
    );
  }
}



export default App;
