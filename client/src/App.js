import React from "react";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

// import Landing from "./components/Landing";
import Stats from "./components/Stats";

function App() {
  return (
    <Container style={{ marginTop: "5em", marginBottom: "5em" }}>
      <Stats />
    </Container>
  );
}

export default App;
