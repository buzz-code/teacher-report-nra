import { Button, Form, NumberInput, ReferenceField, required, SaveButton, TextField, TextInput, useCreate, useNotify, useRecordContext, useRefresh, useTranslate, useUpdate } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import { handleError } from '@shared/utils/notifyUtil';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';

const filters = [
    adminUserFilter,
    <TextInput source="code:$cont" alwaysOn label="קוד" />,
    <TextInput source="description:$cont" label="תיאור" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" emptyText='system' />}
            <TextField source="code" />
            <TextField source="description" />
            <TextField source="price" />
            <EditPriceButton label='עריכה' icon={<EditIcon />} loader={<CircularProgress size={16} />} />
        </CommonDatagrid>
    );
}

const resource = 'price';
const EditPriceButton = ({ label, icon, loader }) => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [showDialog, setShowDialog] = useState(false);

    const handleSuccess = () => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        refresh();
    };
    const [create, createResponse] = useCreate(undefined, undefined, {
        onSuccess: handleSuccess,
        onError: handleError(notify),
    });
    const [update, updateResponse] = useUpdate(undefined, undefined, {
        onSuccess: handleSuccess,
        onError: handleError(notify),
    });
    const handleSave = (data) => {
        if (record.overridePriceId) {
            update(resource, {
                id: record.overridePriceId,
                data: {
                    price: data.price,
                },
                previousData: {}
            });
        } else {
            create(resource, {
                data: {
                    userId: record.userId,
                    code: record.code,
                    description: record.description,
                    price: data.price,
                }
            });
        }
    }

    const handleButtonClick = useCallback(() => {
        setShowDialog(true);
    }, [setShowDialog]);
    const handleDialogClose = useCallback(() => {
        setShowDialog(false);
    }, [setShowDialog]);
    const handleSubmit = useCallback(({ price }) => {
        handleDialogClose();
        handleSave({ price });
    }, [handleDialogClose, handleSave]);

    const isLoading = createResponse.isLoading || updateResponse.isLoading;

    return <>
        <Button label={label} onClick={handleButtonClick} disabled={isLoading}>
            {isLoading ? loader : icon}
        </Button>

        <Dialog onClose={handleDialogClose} open={showDialog}>
            <Form onSubmit={handleSubmit}>
                <DialogContent>
                    <Stack>
                        <NumberInput source='price' label='מחיר' validate={[required()]} step={0.01} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} label={translate('ra.action.cancel')} />
                    <SaveButton alwaysEnable autoFocus variant='text' icon={null} />
                </DialogActions>
            </Form>
        </Dialog>
    </>
}

const entity = {
    Datagrid,
    filters,
};

export default getResourceComponents(entity);
