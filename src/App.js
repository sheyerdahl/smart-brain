import React, { useState } from 'react';
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

function App() {
  const [input, setInput] = useState(initialState.input);
  const [imageUrl, setImageUrl] = useState(initialState.imageUrl);
  const [imageCaptions, setImageCaptions] = useState(initialState.imageCaptions);
  const [route, setRoute] = useState(initialState.route);
  const [isSignedIn, setIsSignedIn] = useState(initialState.isSignedIn);
  const [user, setUser] = useState(initialState.user);


  const resetState = () => {
    setInput(initialState.input);
    setImageUrl(initialState.imageUrl);
    setImageCaptions(initialState.imageCaptions);
    setRoute(initialState.route);
    setIsSignedIn(initialState.isSignedIn);
    setUser(initialState.user);
  }

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    })
  }

  const onInputChange = (event) => {
    setInput(event.target.value)
  }

  const onButtonSubmit = () => {
    setImageUrl(input)

    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
         input: input
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result) {
        fetch("http://localhost:3000/image", {
          method: "put",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
              id: user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          setUser({...user, entries: count})
        })
        .catch(console.log)
      }
      setImageCaptions(result.outputs[0].data.text.raw)
    })
    .catch(error => console.log('error', error));
  }

  const onRouteChange = (route) => {
    if (route === "signin") {
      resetState()
    } else if (route === "home") {
      setIsSignedIn(true)
    }
    setRoute(route)
  }

  
  return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} color="#4444ff" />
        <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn}/>
        { route === "home" 
        ? <div> 
        <Logo />
        <Rank name = {user.name} entries={user.entries} /> 
        <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>       
        <ImageRecognition imageUrl={imageUrl} imageCaptions={imageCaptions}/>
        </div>
        : (
          route === "signin"
          ? <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
          : <Register onRouteChange={onRouteChange} loadUser={loadUser} />
          )
        }
      </div>
  );
}

export default App;
