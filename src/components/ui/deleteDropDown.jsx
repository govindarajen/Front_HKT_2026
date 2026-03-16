import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';

export default function DeleteDropDown({ direction, deleteFunction, data, toggle, isOpen, isIcon, secondBtn }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className="d-flex">
      <Dropdown isOpen={isOpen} toggle={toggle} direction={direction} >
        <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={isOpen} className="dropDownBtn d-flex align-items-center justify-content-center">
            {isIcon ? <FontAwesomeIcon icon="fa-solid fa-trash-can" />
              :
              <Button color="secondary" onClick={toggle}>{t("delete")}</Button>
            }
        </DropdownToggle>
        <DropdownMenu className='w-auto'>
            <DropdownItem header>Confirmer</DropdownItem>
            <DropdownItem onClick={() => {dispatch(deleteFunction(data))}}>{t("delete")}</DropdownItem>
            {
              secondBtn ? secondBtn : null
            }
            <DropdownItem divider />
            <DropdownItem onClick={toggle}>Annuler</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
