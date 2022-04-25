import React, { useState } from "react";
import "../App.css";
import PayloadBinary from "./PayloadBinary";

const PayloadInput = () => {
  const [payload, setPayload] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    PayloadBinary(payload);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="text-area">
        <h3>Enter your message</h3>
        <textarea
          type="textarea"
          id="payload"
          name="payload"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          rows={5}
          cols={50}
        />
        <button type="submit"> Encode </button>
      </div>
    </form>
  );
};

export default PayloadInput;
