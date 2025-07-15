import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArrayInput, SimpleFormIterator, required, TextInput } from 'react-admin';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { CommonEntityNameInput } from '@shared/components/fields/CommonEntityNameInput';
import { CommonJsonInput } from '@shared/components/fields/CommonJsonItem';

export function DashboardItemsInput() {
  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="dashboard-items-content"
        id="dashboard-items-header"
      >
        <Typography variant="h6">הגדרות לוח מחוונים</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ArrayInput source="dashboardItems">
          <SimpleFormIterator>
            <TextInput
              source="title"
              fullWidth
            />
            <CommonEntityNameInput
              source="resource"
              allowedEntities={[
                'event',
                'event_type',
                'event_note',
                'gift',
                'event_gift',
                'class',
                'student',
                'teacher',
              ]}
              helperText="בחר את מקור הנתונים שברצונך להציג"
              fullWidth
              validate={required()}
            />
            <CommonAutocompleteInput
              source="yearFilterType"
              choices={[
                { id: 'none', name: 'ללא סינון שנה' },
                { id: 'year', name: 'סינון שנה רגיל' },
                { id: 'year:$cont', name: 'סינון שנה מורחב' }
              ]}
              defaultValue="none"
              fullWidth
              disableClearable
            />
            <CommonJsonInput source="filter" />
          </SimpleFormIterator>
        </ArrayInput>
      </AccordionDetails>
    </Accordion>
  )
}
