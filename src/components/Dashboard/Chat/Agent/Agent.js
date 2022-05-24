import { useEffect, useState } from "react";
const {
  REACT_APP_CHAT_APP_ID,
  REACT_APP_CHAT_AUTH_KEY,
  REACT_APP_CHAT_WIDGET_ID,
} = process.env;

const Agent = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.CometChatWidget.init({
      appID: REACT_APP_CHAT_APP_ID,
      appRegion: "us",
      authKey: REACT_APP_CHAT_AUTH_KEY,
    }).then(
      (response) => {
        //You can now call login function.
        window.CometChatWidget.login({
          uid: "chatsupport",
        }).then(
          (response) => {
            window.CometChatWidget.launch({
              widgetID: REACT_APP_CHAT_WIDGET_ID,
              target: "#cometchat",
              roundedCorners: "true",
              height: "600px",
              width: "100%",
              defaultID: "", //default UID (user) or GUID (group) to show,
              defaultType: "user", //user or group
            });
            setLoading(false);
          },
          (error) => {
            console.log("User login failed with error:", error);
            //Check the reason for error and take appropriate action.
          }
        );
      },
      (error) => {
        console.log("Initialization failed with error:", error);
        //Check the reason for error and take appropriate action.
      }
    );
  }, []);
  if (loading) {
    return;
  }
  return <div id="cometchat" style={{ margin: "0 auto", width: "60%" }} />;
};
export default Agent;
