import React from 'react';
import logo from './logo.svg';
import './App.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Dict />
      </header>
    </div>
  );
}

class Dict extends React.Component {
  render() {
    const text = "This is just an example text babyshark you're welcome :)";

    return (
      <div className="dict">
        <div className="dict-text">
          <DictText value={text}/>
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

class DictText extends React.Component {
  render() {
    return (
      <div>
        <div>
          {this.props.value.split(' ').map((value, index) => {
            return <DictWord key={index} value={value}/>
          })}
        </div>
      </div>
    );
  }
}

class DictWord extends React.Component {
  constructor(props) {
    super(props);

    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getMeaning = this.getMeaning.bind(this);
    this.getBody = this.getBody.bind(this);

    this.state = {
      show: false,
      definitions: '',
      word: '',
      idef: 0
    };
  }

  //This is soley for debugging the googledictionaryapi ;)
  consoleDict(word) {
    fetch('https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + word + '&lang=en').then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
    });
  }

  handleClose() {
     this.setState({ show: false });
   }

   handleShow() {
     this.setState({ show: true });
   }

   handlePrev() {
     var idef = this.state.idef - 1;
     if (idef < 0) {
       idef = this.state.definitions.length - 1;
     }
     this.setState({ idef: idef });
   }

   handleNext() {
     var idef = this.state.idef + 1;
     if (idef >= this.state.definitions.length) {
       idef = 0;
     }
     this.setState({ idef: idef });
   }

   getMeaning() {
     if (this.state.definitions[this.state.idef]) {
       var def = this.state.definitions[this.state.idef];
       var defMeanings = def.meaning;
       var meaningArray = [];
       for (let [key, value] of Object.entries(defMeanings)) {
         meaningArray.push({
           type: key,
           definitions: value
         })
       }
       const rendMeanings = meaningArray.map((meaning, index) =>
         <li key={index}>{meaning.type}
           <ul>
           {this.getDefinition(meaning.definitions)}
           </ul>
         </li>
       );
       return rendMeanings;
     }
   }

   getDefinition(defs) {
     const rendMeanings = defs.map((def, index) =>
       <div key={index}>
         <ul>
            <li>{this.displayKeyValuePair('Definition', def.definition)}</li>
            { def.example && (<li>{this.displayKeyValuePair('Example', def.example)}</li>) }
         </ul>
       </div>
     );
     return rendMeanings;
   }

   displayKeyValuePair(key, value) {
     if (value) {
       return (
         <span><span>{key + ': '}</span>{value}</span>
       )
     }
   }

   getBody() {
     if (this.state.definitions[this.state.idef]) {
       return (
         <Modal.Body>
           <p>{this.displayKeyValuePair('Phonetic', this.state.definitions[this.state.idef].phonetic)}</p>
           <p>{this.displayKeyValuePair('Origin', this.state.definitions[this.state.idef].origin)}</p>
           {this.getMeaning()}
         </Modal.Body>
       );
     }
   }

  modalDict(word) {
    fetch('https://googledictionaryapi.eu-gb.mybluemix.net/?define=' + word + '&lang=en').then( (response) => {
      return response.json();
    })
    .then( (jsonResponse) =>  {
      var definitions = [];
      for (var def in jsonResponse) {
        definitions.push(jsonResponse[def]);
      }
      this.setState({ definitions: definitions});
      this.setState({ idef: 0});
      this.setState({ word: definitions[this.state.idef].word});
      this.handleShow();
      return;
    })
    .catch((error) => {
      alert('This should be a modal, but I ran out of time ~~ \'' + word + '\' is not a word, silly.');
    });
  }

  render() {
    return (
      <span>
        <span className="dict-word" onClick={ () => this.modalDict(this.props.value)}>
          {this.props.value + ' '}
        </span>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{'Definition of \'' + this.state.word + '\''}</Modal.Title>
          </Modal.Header>
          {this.getBody()}
            {this.state.definitions.length > 1 ? (
              <Modal.Footer>
                <Button variant="dark" onClick={this.handlePrev}>Previous</Button>
                <Button variant="dark" onClick={this.handleNext}>Next</Button>
                <Button variant="danger" onClick={this.handleClose}>Close</Button>
              </Modal.Footer>
            ) : (
              <Modal.Footer>
                <Button variant="danger" onClick={this.handleClose}>Close</Button>
              </Modal.Footer>
            )}
        </Modal>
      </span>
    );
  }
}

export default App;
