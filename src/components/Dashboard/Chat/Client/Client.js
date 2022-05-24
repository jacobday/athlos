import { useEffect, useState } from "react";
const {
  REACT_APP_CHAT_APP_ID,
  REACT_APP_CHAT_API_KEY,
  REACT_APP_CHAT_WIDGET_ID,
  REACT_APP_AGENT_ID,
} = process.env;

const Client = (userFirstName, userLastName) => {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setLoad(true);
    window.CometChatWidget.init({
      appID: REACT_APP_CHAT_APP_ID,
      appRegion: "us",
      authKey: REACT_APP_CHAT_API_KEY,
    }).then((response) => {
      //You can now call login function.
      let uid = localStorage.getItem("cc-uid");
      if (uid === null) {
        // create new user
        const uid = "user" + new Date().getSeconds().toString();
        const user = new window.CometChatWidget.CometChat.User(uid);
        user.setName(uid);
        window.CometChatWidget.createOrUpdateUser(user).then((user) => {
          // Proceed with user login
          window.CometChatWidget.login({
            uid: uid,
          }).then((loggedInUser) => {
            localStorage.setItem("cc-uid", loggedInUser.uid);
            // Proceed with launching your Chat Widget
            window.CometChatWidget.launch({
              widgetID: REACT_APP_CHAT_WIDGET_ID,
              roundedCorners: "true",
              docked: "true",
              height: "300px",
              width: "400px",
              defaultID: REACT_APP_AGENT_ID,
              defaultType: "user", //user or group
            });
            setLoad(false);
          });
        });
      } else {
        window.CometChatWidget.login({
          uid: uid,
        }).then((user) => {
          window.CometChatWidget.launch({
            widgetID: REACT_APP_CHAT_WIDGET_ID,
            roundedCorners: "true",
            docked: "true",
            height: "300px",
            width: "400px",
            defaultID: REACT_APP_AGENT_ID,
            defaultType: "user", //user or group
          });
          setLoad(false);
        });
      }
    });
  }, []);
  return <div className="App"></div>;
};
export default Client;
