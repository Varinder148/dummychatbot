import "./msg.styles.scss";

const Msg = ({ msg, sender }) => {
  let userOrBot = "bot left";
  if (sender) userOrBot = sender === "user" ? "user right" : "bot left";

  return (
    <div className="msg-outline">
      <div className="align">
        <div className={userOrBot+" msg"}>{msg}</div>
      </div>
    </div>
  );
};

export default Msg;
