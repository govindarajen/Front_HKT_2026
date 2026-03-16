import { faHome, faCalendarAlt, faUserInjured, faFileInvoice, faUser, faAddressBook } from '@fortawesome/free-solid-svg-icons';

export const menuItems = [
        { name: 'dashboard', path: '/dashboard', icon: faHome,
            rightName: 'dashboard',
            rights: ['dashboard_r']
        },
        { name: 'documents', path: '/documents', icon: faAddressBook ,
            rightName: 'documents',
            rights: ['documents_r, documents_w', 'documents_r', 'documents_w']
        },
        { name: 'admin', path: '/adminpanel', icon: faUser,
            rightName: 'admin',
            rights: ['admin_r, admin_w', 'admin_r', 'admin_w', '*']
        }
]