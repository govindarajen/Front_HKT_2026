import { faHome, faCalendarAlt, faUserInjured, faFileInvoice, faUser, faAddressBook, faFileImport } from '@fortawesome/free-solid-svg-icons';

export const menuItems = [
        { name: 'dashboard', path: '/dashboard', icon: faHome,
            rightName: 'dashboard',
            rights: ['dashboard_r']
        },
        { name: 'documents', path: '/documents', icon: faFileImport ,
            rightName: 'documents',
            rights: ["document_upload", "document_r", "document_c", "document_w", "document_d"]
        },
        { name: 'enterprise', path: '/enterprise', icon: faAddressBook,
            rightName: 'enterprise',
            rights: ['enterprise_r']
        },
        { name: 'admin', path: '/adminpanel', icon: faUser,
            rightName: 'admin',
            rights: ['admin_r, admin_w', 'admin_r', 'admin_w', '*']
        }
]