import React, { useState, useEffect } from 'react';

/*
sends data received from state of parent component - MainPage 
and value of input field (or props email if input field is empty);
updates state of statusReceived and conditionally renders error or 
success div
 */

const SendMessage = (props) => {
  const sourceEmail = localStorage.getItem('email');
  const [email, setEmail] = useState(sourceEmail);
  const [statusReceived, setStatusReceived] = useState(false);

  const emailEntered = (e) => {
    setEmail(e.target.value);
  };

  const sendMessage = async () => {
    try {
      const sourceName = localStorage.getItem('name');
      const data = {
        contactEmail: email,
        sourceName,
        sourceEmail,
        targetEmail: props.selectedUser.email,
        targetName: props.selectedUser.name,
        skill: props.graphData.skills[0],
      };
      const sent = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const response = await sent.json();
      setStatusReceived(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (statusReceived === true) {
      setTimeout(() => {
        setStatusReceived(false);
      }, 1500);
    }
  }, [statusReceived]);

  return (
    <div className="messenger">
      <div className="internal-messenger">
        <span className="close" onClick={props.cancelMessage}>
          &times;
        </span>
        {!statusReceived && (
          <div>
            <p>
              Hi{' '}
              <span className="recepientname">{props.selectedUser.name}</span>,
              I am looking forward to learning {props.graphData.skills[0]} from
              you{' '}
            </p>
            <p>Here is my contact info: </p>
            <div className="form-wrapperdiv">
              <form>
                <input
                  type="text"
                  className="form-control-messenger"
                  placeholder="Enter email"
                  onChange={emailEntered}
                />
                <button
                  type="button"
                  className="sendmessage"
                  onClick={sendMessage}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
        {statusReceived && (
          <div>
            <p>
              <span className="recepientname">{props.selectedUser.name}</span>{' '}
              has received your message and should reply shortly{' '}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMessage;
