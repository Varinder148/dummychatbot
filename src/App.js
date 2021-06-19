import logo from './logo.svg';
import './App.css';
import Chatbox from './components/chatbox/chatbox.component'
import chatdump from './assets/chat-dump';


function App() {

  // let dump = chatdump.replaceAll('.',"###");
  let dump = chatdump.replaceAll('.',"###");

  return (
    <>
      <Chatbox chatdump = {dump}/>
    </>
  );
}

export default App;
