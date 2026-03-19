import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../../redux/users/userReducer.js';

import { persistor } from '../../../redux/store.js';
import { useNavigate } from 'react-router-dom';

export default function ProfileDropDown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();


  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleLogout = async () => {
    try {
      // First dispatch logout action
      await persistor.purge();
      dispatch(setLogout());
      
      // Then clear all persisted data
      localStorage.removeItem('persist:root');
      sessionStorage.clear();
      
      // Purge the redux-persist store
      
      // Reset the Redux store
      dispatch({ type: 'RESET_STORE' });
      
    } catch (error) {
      alert('Logout failed. Please try again.');
    }
  }

  return (
    <div className="d-flex">
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={dropdownOpen} className="dropDownBtn d-flex align-items-center justify-content-center">
            <FontAwesomeIcon icon={faUser} className="dropDown-Icon" />
          </DropdownToggle>
        <DropdownMenu >
          <DropdownItem onClick={() => {handleLogout()}}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}