import React from "react";
import "./Dictaphone.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Dictaphone = (props) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  return (
    <div>
      <button
        title={
          !browserSupportsSpeechRecognition
            ? "Not supported by browser."
            : "Search by Voice"
        }
        className={listening ? "mic micActive" : "mic micInactive"}
        onMouseDown={() => {
          SpeechRecognition.startListening({ continuous: true });
          resetTranscript();
        }}
        onMouseUp={() => {
          SpeechRecognition.stopListening();
          if (transcript) {
            props.setSearchValue(transcript);
          }
        }}
      >
        <FontAwesomeIcon icon="fa-solid fa-microphone" />
      </button>
    </div>
  );
};
export default Dictaphone;
