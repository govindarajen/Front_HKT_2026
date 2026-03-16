import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Col } from 'reactstrap';

import { faHome, faCalendarAlt, faUserInjured, faFileInvoice, faAddressBook } from '@fortawesome/free-solid-svg-icons';

import ProfileDropDown from '../ui/Navbar/profileDropDown';
import { menuItems } from '../../helpers/configs';


export default function NavBar () {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const location = window.location.pathname;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { groupId } = useSelector((state) => state.account.value);

    const { fullName, rights, pref, profession } = useSelector((state) => state.account.value);


    const [isProfessionModalOpen, setIsProfessionModalOpen] = useState(false);

    useEffect( () => {
        if (profession === "newUser" || profession === null || profession === undefined) {
            return setIsProfessionModalOpen(true);
        } else {
            setIsProfessionModalOpen(false);
        }
    }, [profession, location]);

    

    const handleMenuClick = (path) => {
        setMenuOpen(false);
        navigate(path);
    };
        
    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);


    const navItems = menuItems.map((item) => {
        let hasRight = false;
        
        if (item.rights && item.rights.length > 0) {
            hasRight = item.rights.some(right => rights.includes(right));
        } else if (item.rightName) {
            hasRight = rights.includes(item.rightName);
        }

        if (rights.includes('*')) {
            hasRight = true;
        }
        
        if (!hasRight) return null;

        if (item.name === 'customers' && profession == 'medical') { // check medical profession
            item.name = 'patients';
            item.icon = faUserInjured;
        };
        
        return (
            <a
            key={item.name}
            className={`navLink p-2${location === item.path ? ' active' : ''}`}
            onClick={(e) => {
                e.preventDefault();
                handleMenuClick(item.path);
            }}
            >
            <FontAwesomeIcon icon={item.icon} className={`me-2 navLink-Icon ${location === item.path ? ' active' : ''}`} />
            {t(item.name)}
            </a>
        );
    })

    

    return (
        <nav id="navbar" className="navbar-expand-lg w-100 d-flex flex-row justify-content-between align-items-center p-3">
            <Col className="navTitle d-flex justify-content-start" xs={6} lg={3}>
                <a className="navbarTitle" onClick={() => navigate("/dashboard")}>Hackathon</a>
            </Col>
            {/* Hamburger icon for mobile */}
            <div className="d-xl-none d-flex align-items-center">
                <button
                    className="hamburgerBtn d-xl-none ms-4"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
                </button>
            </div>
            {/* Desktop menu */}
            <Col className="d-none d-xl-flex justify-content-center align-items-center" xs={12} lg={6}>
                {
                    navItems
                }
            </Col>
            <div className="d-none d-xl-flex justify-content-end w-25">
                <div className='d-flex align-items-end justify-content-start flex-column me-3'> 
                    <span className="navWelcome m-0 p-0 d-flex justify-content-center align-items-center me-2">{t('welcomeText')}!👋</span>
                    <span className="navUserName m-0 p-0 d-flex justify-content-center align-items-center me-2">{fullName}</span>
                </div>
                <ProfileDropDown />
            </div>
            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className="mobileMenuOverlay">
                    <div className="mobileMenu" ref={menuRef}>
                            {
                                navItems
                            }
                        <div className="mobileProfileDropDown mt-3">
                            <ProfileDropDown />
                            <div className='d-flex align-items-start justify-content-start flex-column ms-3'> 
                                <span className="navWelcome m-0 p-0 d-flex justify-content-center align-items-center me-2">{t('welcomeText')}!👋</span>
                                <span className="navUserName m-0 p-0 d-flex justify-content-center align-items-center me-2">{fullName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}