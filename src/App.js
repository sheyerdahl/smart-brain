import React from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation"
import Logo from "./components/Logo/Logo"
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm"
import Rank from "./components/Rank/Rank"
import ImageRecognition from "./components/ImageRecognition/ImageRecognition"
import Signin from "./components/Signin/Signin"
import Register from "./components/Register/Register"
import ParticlesBg from 'particles-bg'

console.log("App.js started!")

const initialState = {
  input: "",
  imageUrl: "",
  imageCaptions: "",
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  }
}
class App extends React.Component {
  constructor() {
    super()
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
    }})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
         input: this.state.input
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result) {
        fetch("http://localhost:3000/image", {
          method: "put",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      }
      this.setState({imageCaptions: result.outputs[0].data.text.raw})
    })
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === "signin") {
      this.setState(initialState)
    } else if (route === "home") {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const {isSignedIn, imageUrl, route, imageCaptions} = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} color="#4444ff" />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === "home" 
        ? <div> 
        <Logo />
        <Rank name = {this.state.user.name} entries={this.state.user.entries} /> 
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>       
        <ImageRecognition imageUrl={imageUrl} imageCaptions={imageCaptions}/>
        </div>
        : (
          route === "signin"
          ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
        }
      </div>
    )
  };
}

export default App;
