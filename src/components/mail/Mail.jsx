import React, { useContext, useEffect, useState } from "react";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import Loading from "../loading/Loading";

// My Mail Components
import Inbox from "./components/inbox";
import SideBar from "./components/sidenavBar";
import CardView from "./components/cardView";
import Compose from "./components/compose";
import Drafts from "./components/drafts";
import Starred from "./components/starred";
import { useLocation } from "react-router-dom";
import SentMail from "./components/sentMail";

const Mail = (props) => {
  const location = useLocation();
  // console.log(location.pathname);
  const renderSwitch = (path) => {
    switch (path) {
      case "/mail/inbox":
        return (
          <div>
            <CardView /> <Inbox />
          </div>
        );
      case "/mail/starred":
        return (
          <div>
             <SideBar />
            {/* <Starred /> */}
          </div>
        );

      case "/mail/sendEmail":
        return (
          <div>
             <SideBar />
            {/* <SentMail /> */}
          </div>
        );

      case "/mail/drafts":
        return (
          <div>
             <SideBar />
            {/* <Drafts /> */}
          </div>
        );

      default:
        return (
          <div>
            <CardView /> <Inbox />
          </div>
        );
    }
  };
  return (
    <div>
      <Switch>
        <Redirect from="/mail" to="/mail/inbox" exact />

        <Route path="/mail/inbox" exact component={SideBar} />
        <Route path="/mail/compose" component={Compose} />
        <Route path="/mail/starred" component={Starred} />
        <Route path="/mail/drafts" component={Drafts} />
        <Route path="/mail/sendEmail" component={SentMail} />
      </Switch>
      {/* {location.pathname === '/mail/inbox'? <div><CardView/><Inbox/></div> : <Compose/>} */}
    {renderSwitch(location.pathname)}
      
    </div>
  );
};

export default Mail;
