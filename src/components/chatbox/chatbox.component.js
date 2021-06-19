import { useState, useRef } from "react";
import Msg from "../msg/msg.component";
import "./chatbox.styles.scss";
import axios from "axios";

const Chatbox = ({ chatdump }) => {
  const [window, setWindow] = useState("closed");

  const [msg, setMsg] = useState("");

  const [msgs, setMsgs] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const buttonRef = useRef();

  const toggle = () => {
    setWindow(window === "open" ? "closed" : "open");
  };

  const sendHandler = async (e) => {
    e.preventDefault();
    if (msg.trim() !== "") {
      setMsgs([...msgs, { msg: msg.trim(), sender: 1 }]);
      setMsg("");
      setIsLoading(true);
      let response = await gptReqAsync(msg);
      setMsgs([
        ...msgs,
        { msg: msg.trim(), sender: 1 },
        { msg: response, sender: 2 },
      ]);
      setIsLoading(false);
    }
  };

  const msgHandler = (e) => {
    const { value } = e.target;
    setMsg(value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      buttonRef.current.click();
    }
  };

  const gptReqAsync = async (msg) => {
    let processedDump = chatdump.split("###").map((text) => text.trim());
    let eng = "davinci";
    let payload = {
      documents: processedDump,
      query: msg,
    };
    let _headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_GPT_KEY}`,
    };
    try {
      let res = await axios.post(
        `https://api.openai.com/v1/engines/${eng}/search`,
        payload,
        { headers: _headers }
      );
      let resData = await res.data.data.sort((a, b) => b.score - a.score);

      let botans = await openApiAsync(processedDump[resData[0].document], msg);
      console.log("botans", botans);
      return botans;
    } catch (error) {
      console.log(error);
    }
  };

  const openApiAsync = async (doc, ques) => {
    let contextString = `${doc}`;
    let engine = "davinci";

    let payload = {
      prompt: contextString,
      max_tokens: 40,
      temperature: 0,
      top_p: 1.0,
      n: 1,
      stream: false,
      logprobs: null,
      stop: "###",
    };

    let _headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
    };

    try {
      let res = await axios.post(
        `https://api.openai.com/v1/engines/${engine}/completions`,
        payload,
        { headers: _headers }
      );
      console.log("openai", res);

      let resMsg = res.data.choices[0].text;

      return resMsg;
    } catch (error) {
      console.log(error);
    }
  };

  if (window === "closed") {
    return (
      <div className="chatbox closed closed-content" onClick={toggle}>
        <p>Let's chat</p>
      </div>
    );
  }

  return (
    <div className={`chatbox ${window}`}>
      <div className="box-nav">
        <span>Chat</span>
        <span onClick={toggle}>_</span>
      </div>
      <div className="chat-content">
        {msgs.map(({ msg, sender }) => (
          <>
            <Msg key={msg} msg={msg} sender={sender === 1 ? "user" : "bot"} />
          </>
        ))}
        {isLoading && <Msg msg="Writing..." sender="bot" />}
      </div>
      <form onSubmit={sendHandler}>
        <div className="msg-bar">
          <textarea
            value={msg}
            onChange={msgHandler}
            onKeyDown={onEnterPress}
          ></textarea>
          <button ref={buttonRef}>Send</button>
        </div>
      </form>
    </div>
  );
};

export default Chatbox;
