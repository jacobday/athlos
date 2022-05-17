import { useEffect, useState } from "react";
import MDSpinner from "react-md-spinner";

const Client = (userFirstName, userLastName) => {
  const [load, setLoad] = useState(true);
  useEffect(() => {
    setLoad(true);
    window.CometChatWidget.init({
      appID: "2079391d99294330",
      appRegion: "us",
      authKey: "7cf2425060750748696b231c31aec31d3ec06a17",
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
              widgetID: "5d3d5c17-15b9-4ed8-8077-a6124967615d",
              roundedCorners: "true",
              docked: "true",
              height: "300px",
              width: "400px",
              defaultID: process.env.REACT_APP_AGENT_ID,
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
            widgetID: "5d3d5c17-15b9-4ed8-8077-a6124967615d",
            roundedCorners: "true",
            docked: "true",
            height: "300px",
            width: "400px",
            defaultID: process.env.REACT_APP_AGENT_ID,
            defaultType: "user", //user or group
          });
          setLoad(false);
        });
      }
    });
  }, []);
  if (load) {
    return <div>{/* <MDSpinner /> */}</div>;
  }
  return <div className="App"></div>;
};
export default Client;
