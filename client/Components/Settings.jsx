import React from 'react';
import SettingsAdmin from './SettingsAdmin.jsx';
import SettingsReg from './SettingsReg.jsx';
import Navbar from './Navbar.jsx';

/*
Renders Regular or Admin Settings based on admin prop from localStorage 
that is set on successfull auth;
 */

const Settings = (props) => {

  const isAdmin = localStorage.getItem('admin');
  const newMessage = localStorage.getItem('newMessage');

  return (
    <div className="requestspage">
      <Navbar 
        isAdmin={isAdmin}
        newMessage={newMessage}
        setAuth={props.setAuth} />

      {isAdmin === 'true' && <SettingsAdmin />}
      {isAdmin !== 'true' && <SettingsReg />}
    </div>
  );
};

export default Settings;
