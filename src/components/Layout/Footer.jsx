import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';


export default function Footer () {
    const navigate = useNavigate();

    const year = moment().format('YYYY');


    return (
        <footer className='w-100 p-2 m-0 footer d-flex flex-column'>
            <p className='text-center m-0'>Copyright © 2025/{year} | COODIEN Govindarajen</p>
        </footer>
    )
}