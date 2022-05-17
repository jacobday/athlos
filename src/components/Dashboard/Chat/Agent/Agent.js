import { useEffect, useState } from "react";
import MDSpinner from "react-md-spinner";

const Agent = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.CometChatWidget.init({
      appID: "2079391d99294330",
      appRegion: "us",
      authKey: "7cf2425060750748696b231c31aec31d3ec06a17",
    }).then(
      (response) => {
        //You can now call login function.
        window.CometChatWidget.login({
          uid: "chatsupport",
        }).then(
          (response) => {
            window.CometChatWidget.launch({
              widgetID: "a4c01d3f-ebc4-48cf-a866-8e1b027073ef",
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
    return <div>{/* <MDSpinner /> */}</div>;
  }
  return <div id="cometchat" style={{ margin: "0 auto", width: "60%" }} />;
};
export default Agent;
