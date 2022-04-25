import { useState } from "react";
import FileUpload from "./components/FileUpload";
import "./App.css";

function Tabs() {
  const [toggleState, setToggleState] = useState(0);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 0 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(0)}
        >
          Encode
        </button>
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          Decode
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 0 ? "content  active-content" : "content"}
        >
          <h2>Content 1</h2>
          <hr />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            praesentium incidunt quia aspernatur quasi quidem facilis quo nihil
            vel voluptatum?
            <FileUpload />
          </p>
        </div>

        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <h2>Content 2</h2>
          <hr />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            voluptatum qui adipisci.
            <FileUpload />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tabs;
