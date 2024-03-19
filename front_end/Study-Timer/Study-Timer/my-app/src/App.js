import React, { useState, useEffect } from 'react';
import './App.css';

function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [countdownDate, setCountdownDate] = useState(null);
  const [expired, setExpired] = useState(false);
  const [countdownRunning, setCountdownRunning] = useState(false);
  let interval;

  //When user clicks the "startCountdown" button after setting the timer, initiate a POST 
  //request to the '/process_image' route of Flask application
  const startCountdown = () => {
    setCountdownRunning(true);// countdown is now running

    const timer = hours * 3600 + minutes * 60 + seconds; // Calculate the total countdown time in seconds

    //This block of sends a POST request to the Flask server's '/process_image' endpoint
    fetch('/process_image', 
    {
      method:'POST',// refers to the HTTP request method beign used when making the request to the user 
      headers:
      {
        //The headers property specifies additional headers to include in the request. 
        //Here, it sets the Content-Type header to 'application/json', 
        //indicating that the request body contains JSON data.
        'Content-Type':'application/json',
      },
      // '{ timer: hours * 3600 + minutes * 60 + seconds }:' 
      //This creates a JavaScript object with a single property 'timer', 
      //which holds the total countdown time calculated in seconds.

      //Finally, 'JSON.stringify()' converts the JavaScript object into a JSON string, 
      //which can be sent in the body of the POST request. 
      //This string representation of the object can be easily parsed by the backend server.
      body: JSON.stringify({timer : timer}), //Send timer value in JSON format
    })

    //This part of the code is a chained promise callback that handles the response 
    //received from the fetch request.

    //The 'response' parameter represents the response object returned by the server.

    //'.json()' is a method available on the response object that parses 
    //the response body as JSON and returns a promise.

    .then(response => response.json())

    //This is another chained promise callback that handles the parsed JSON data 
    //obtained from the previous step.

    //The data parameter represents the parsed JSON data.
    //Inside the callback function, console.
    //log(data) logs the received data to the browser console for debugging purposes.
    .then(data => {
      console.log(data); //Log response from Flask server

      const now =new Date().getTime();
      const countdownTime=now + (hours*3600+minutes*60+seconds)*1000;
      setCountdownDate(countdownTime);
    })
    .catch(error => console.error('Error: ', error));

    
  };

  const stopCountdown = () => {
    clearInterval(interval);
    setCountdownRunning(false);

    //Send a POST request to stop the machine learning module
    fetch('/ ', {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({}),
    })
    .then(response => response.json())
    .then (data => {
      console.log(data);//Log response from Flask server
    })
    .catch(error => console.error('Error: ', error));
  };

  useEffect(() => {
    // Update the countdown every second
    if (countdownDate !== null && countdownRunning) {
      interval = setInterval(() => { // Define interval within useEffect
        const now = new Date().getTime();
        const distance = countdownDate - now;
        if (distance <= 0) {
          setExpired(true);
          clearInterval(interval);
          setCountdownRunning(false);

          //Send a POST request to stop the machine learnign module
          fetch('/stop_detection',
          {
            method:'POST',
            headers : {
              'Content-Type':'application/json',
            },
            body:JSON.stringify({}),
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)//Log response fro Flask server
          })
          .catch(error => console.error('Error: ',error));
        } else {
          const hoursRemaining = Math.floor(distance / (1000 * 60 * 60));
          const minutesRemaining = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const secondsRemaining = Math.floor((distance % (1000 * 60)) / 1000);
          setHours(hoursRemaining);
          setMinutes(minutesRemaining);
          setSeconds(secondsRemaining);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdownDate, countdownRunning]);

  return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h1 className="countdown-title">Session</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="timer-box">
              <div className="form-group">
                <label htmlFor="hours">Hours: </label>
                <input
                    type="number"
                    className="form-control"
                    id="hours"
                    min="0"
                    max="23"
                    placeholder="0"
                    value={hours}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                          setHours(value);
                      }
                  }}
                />

              </div>
              <br />
              <div className="form-group">
                <label htmlFor="minutes">Minutes: </label>
                <input
                    type="number"
                    className="form-control"
                    id="minutes"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={minutes}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                          setMinutes(value);
                      }
                  }}
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="seconds">Seconds: </label>
                <input
                    type="number"
                    className="form-control"
                    id="seconds"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={seconds}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                          setSeconds(value);
                      }
                  }}
                />
              </div>
              <br />
              {countdownRunning ? (
                  <button className="button" onClick={stopCountdown}>
                    Stop Countdown
                  </button>
              ) : (
                  <button className="button" onClick={startCountdown}>
                    Start Countdown
                  </button>
              )}
              <div className="countdown mt-4">
                {expired ? (
                    <span>EXPIRED</span>
                ) : (
                    <>
                      <span>{hours.toString().padStart(2, '0')}</span> :
                      <span>{minutes.toString().padStart(2, '0')}</span> :
                      <span>{seconds.toString().padStart(2, '0')}</span>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default CountdownTimer;
