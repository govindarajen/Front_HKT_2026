import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {

Container,
Button,
Modal,
ModalHeader,
ModalBody,
ModalFooter,
Form,
FormGroup,
Label,
Input,
} from "reactstrap";
import { createEnterpriseRequest } from "../../redux/enterprise/enterpriseReducer";
import { getUsersRequest } from "../../redux/users/userReducer";

export default function FormEnterpriseModal({ isOpen, toggle }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.account.value);
    const enterpriseLoading = useSelector((state) => state.enterprise.loading);
    const { t } = useTranslation();

    const users = useSelector((state) => state.users);

    useEffect( () => {

        if (users == null) {
            dispatch(getUsersRequest());
        }

    }, [users])

const [form, setForm] = useState({
    lib: "",
    siret: "",
    ownerId: user?._id || null,
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createEnterpriseRequest(form));
    toggle();
};

return (
        <Modal size="lg" isOpen={isOpen} toggle={toggle}>
            <Form onSubmit={handleSubmit}>
                <ModalHeader toggle={toggle}>Nouvelle entreprise</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="lib">{t('entrepriseName')}</Label>
                        <Input
                            id="lib"
                            name="lib"
                            type="text"
                            value={form.lib}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="siret">{t('siret')}</Label>
                        <Input
                            id="siret"
                            name="siret"
                            type="text"
                            value={form.siret}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        {t('cancel')}
                    </Button>
                    <Button color="primary" type="submit">
                        {enterpriseLoading ? t('uploading') : t('save')}
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
);
}