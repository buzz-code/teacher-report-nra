import React from 'react';
import UpdateIcon from '@mui/icons-material/Update';
import { BulkActionButton } from '@shared/components/crudContainers/BulkActionButton';

export const UpdateStudentCountButton = () => (
    <BulkActionButton
        name="updateStudentCount"
        label="עדכון מס' תלמידות"
        icon={<UpdateIcon />}
        reloadOnEnd
    />
);
