import React, { useState, useEffect } from "react";
import "./inbox.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TruncateMarkup from "react-truncate-markup";

const Inbox = (props) => {
  const [jsonOutput, setJsonOutput] = useState([]);
  useEffect(() => {
    getEmails();
  }, []);

  const getEmails = (async) => {
    fetch("http://localhost:5000/api/receiveEmail")
      .then((response) => response.json())
      .then((response) => {
        setJsonOutput(response);
      });
  };


  // const handleRoute = () => {
  //   return <Route path="/myprofile/profile" exact component={Profile} />;
  // };

  function formatDate(date) {
    var q = new Date();
    var m = q.getMonth();
    var d = q.getDay();
    var y = q.getFullYear();

    var newdate = new Date(y, m, d);
    var currentY = y.toString();
    var yearFromApi = date.substr(0, 4);
    var nd = newdate.toString();

    if (nd === date) {
      return date.substr(11, 5);
    } else if (currentY === yearFromApi) {
      return date.substr(5, 5);
    } else {
      return date.substr(0, 10);
    }
  }

  return (
    // <div>vndjbcxjn</div>
    <div className="inboxStyle">
    
      <table class="table table-hover">
       <tbody>
       {!!jsonOutput.length
          ? jsonOutput.reverse().map((value, index) => {
              return (
                <tr>
                  <td><input type="checkbox"/></td>
                  <td>{value.from}</td>
                  <TruncateMarkup lines={2}>
                    <td >
                      <span style={{ fontWeight: "bold" }}>
                        {value.subject}
                      </span>
                      -{value.body}
                    </td>
                  </TruncateMarkup>
                  <td style={{ fontWeight: "bold" }}>
                    {formatDate(value.time)}
                  </td>
                </tr>
              );
            })
          : "Loading"}
       </tbody>
      </table>
    </div>
  );
};

export default Inbox;
