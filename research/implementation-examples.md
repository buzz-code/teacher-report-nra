# Implementation Examples: Teacher Type-Specific Pivot Tables

## Code Examples and Implementation Guides

This document provides detailed code examples and step-by-step implementation guides for the teacher type-specific pivot tables research.

## Example 1: Enhanced Single Dynamic Pivot Table (Recommended)

### Backend Implementation

#### Step 1: Enhanced fieldsShow.util.ts

```typescript
// server/src/utils/fieldsShow.util.ts

/**
 * Get field labels in Hebrew for UI display
 */
export function getFieldLabels(): Record<AttReportField, string> {
  return {
    // Universal fields
    id: 'מזהה',
    userId: 'מזהה משתמש',
    teacherId: 'מזהה מורה',
    reportDate: 'תאריך דיווח',
    updateDate: 'תאריך עדכון',
    year: 'שנה',
    isConfirmed: 'מאושר',
    salaryReport: 'דוח משכורת',
    salaryMonth: 'חודש משכורת',
    comment: 'הערות',
    createdAt: 'נוצר ב',
    updatedAt: 'עודכן ב',

    // Teacher-specific fields
    howManyStudents: 'מספר תלמידים',
    howManyLessons: 'מספר שיעורים',
    howManyWatchOrIndividual: 'מספר צפיות או אישיות',
    howManyTeachedOrInterfering: 'מספר הוראות או התערבויות',
    wasKamal: 'האם היה כמל',
    howManyDiscussingLessons: 'מספר שיעורי דיון',
    howManyLessonsAbsence: 'מספר שיעורי היעדרות',
    howManyMethodic: 'מספר מתודיקות',
    fourLastDigitsOfTeacherPhone: '4 ספרות אחרונות טלפון מורה',
    isTaarifHulia: 'תעריף חוליה',
    isTaarifHulia2: 'תעריף חוליה 2',
    isTaarifHulia3: 'תעריף חוליה 3',
    howManyWatchedLessons: 'מספר שיעורים שנצפו',
    howManyStudentsTeached: 'מספר תלמידים שהורו',
    howManyYalkutLessons: 'מספר שיעורי ילקוט',
    howManyStudentsHelpTeached: 'מספר תלמידים עזרו בהוראה',
    teacherToReportFor: 'מורה לדווח עבור',
    wasCollectiveWatch: 'האם היה צפייה קבוצתית',
    wasStudentsGood: 'האם התלמידים היו טובים',
    howManyStudentsWatched: 'מספר תלמידים שנצפו',
    wasPhoneDiscussing: 'האם היה דיון טלפוני',
    whatIsYourSpeciality: 'מה ההתמחות שלך',
  };
}

/**
 * Get teacher type choices for UI selection
 */
export function getTeacherTypeChoices(): { id: number; name: string }[] {
  return [
    { id: TeacherTypeId.SEMINAR_KITA, name: 'סמינר כיתה' },
    { id: TeacherTypeId.MANHA, name: 'מנהה' },
    { id: TeacherTypeId.PDS, name: 'פדס' },
    { id: TeacherTypeId.KINDERGARTEN, name: 'גן' },
    { id: TeacherTypeId.SPECIAL_EDUCATION, name: 'חינוך מיוחד' },
  ];
}

/**
 * Get headers for dynamic table rendering
 */
export function buildHeadersForTeacherType(teacherTypeId: number): IHeader[] {
  const fields = getFieldsForTeacherType(teacherTypeId);
  const labels = getFieldLabels();
  
  return fields.map(field => ({
    value: field,
    label: labels[field] || field,
    sortable: true,
  }));
}
```

#### Step 2: Enhanced att-report.config.ts

```typescript
// server/src/entity-modules/att-report.config.ts

import { 
  getFieldsForTeacherType, 
  buildHeadersForTeacherType,
  getTeacherTypeChoices,
  TeacherTypeId 
} from '../utils/fieldsShow.util';

class AttReportPivotService<T extends Entity | AttReport> extends BaseEntityService<T> {
  protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any, auth: any): Promise<void> {
    const data = list as AttReport[];

    switch (pivotName) {
      case 'AttReportWithPricing': {
        // Existing pricing logic
        // ... keep existing implementation
        break;
      }

      case 'AttReportByTeacherType': {
        await this.handleTeacherTypePivot(data, extra, filter, auth);
        break;
      }
    }
  }

  private async handleTeacherTypePivot(data: AttReport[], extra: any, filter: any, auth: any): Promise<void> {
    const teacherTypeId = extra?.teacherTypeId;
    
    if (!teacherTypeId) {
      // No teacher type selected - show all data with universal fields only
      const headers = buildHeadersForTeacherType(null); // Universal fields only
      (data[0] as any).headers = headers;
      return;
    }

    // Filter data to only include relevant fields for the selected teacher type
    const relevantFields = getFieldsForTeacherType(teacherTypeId);
    
    // Build headers dynamically
    const headers = buildHeadersForTeacherType(teacherTypeId);
    
    // Clean data - remove fields not relevant to this teacher type
    data.forEach(report => {
      const cleanedReport = {};
      relevantFields.forEach(field => {
        if (report[field] !== undefined) {
          cleanedReport[field] = report[field];
        }
      });
      
      // Copy cleaned properties back to original report
      Object.keys(report).forEach(key => {
        if (!relevantFields.includes(key as any)) {
          delete report[key];
        }
      });
      
      Object.assign(report, cleanedReport);
    });

    // Add headers to first item for dynamic rendering
    if (data.length > 0) {
      (data[0] as any).headers = headers;
    }
  }
}

function getEnhancedConfig(): BaseEntityModuleOptions {
  return {
    entity: AttReport,
    query: {
      join: {
        teacher: { eager: true },
      },
    },
    exporter: {
      processReqForExport(req: CrudRequest, innerFunc) {
        req.options.query.join = {
          teacher: { eager: true },
        };
        return innerFunc(req);
      },
      getExportHeaders(): IHeader[] {
        const teacherTypeId = req.parsed?.extra?.teacherTypeId;
        if (teacherTypeId) {
          return buildHeadersForTeacherType(teacherTypeId);
        }
        
        return [
          { value: 'teacher.name', label: 'שם המורה' },
          { value: 'reportDate', label: 'תאריך דיווח' },
          { value: 'year', label: 'שנה' },
        ];
      },
    },
    service: AttReportPivotService,
  };
}
```

### Frontend Implementation

#### Step 1: AttReportByTeacherType.jsx

```jsx
// client/src/pivots/AttReportByTeacherType.jsx

import { 
    DateInput, 
    NumberField, 
    TextField, 
    ReferenceField, 
    SelectField, 
    TextInput, 
    BooleanInput,
    DateField,
    BooleanField,
    useListContext
} from 'react-admin';
import { CommonDatagrid, getPivotColumns } from '@shared/components/crudContainers/CommonList';
import { MultiReferenceField } from '@shared/components/fields/CommonReferenceField';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId, filterByUserIdAndYear } from '@shared/components/fields/CommonReferenceInputFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

// Teacher type choices for the filter
const teacherTypeChoices = [
  { id: 1, name: 'סמינר כיתה' },
  { id: 3, name: 'מנהה' },
  { id: 5, name: 'פדס' },
  { id: 6, name: 'גן' },
  { id: 7, name: 'חינוך מיוחד' },
];

const filters = [
    ({ isAdmin }) => isAdmin && <CommonReferenceInputFilter source="userId" reference="user" />,
    <CommonAutocompleteInput 
        source="extra.teacherTypeId" 
        choices={teacherTypeChoices} 
        label="סוג מורה"
        alwaysOn 
    />,
    <DateInput source="reportDate:$gte" label="תאריך דיווח אחרי" alwaysOn />,
    <DateInput source="reportDate:$lte" label="תאריך דיווח לפני" alwaysOn />,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="activityType" reference="att_type" dynamicFilter={filterByUserId} />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <BooleanInput source="isConfirmed" label="מאושר" />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
};

const Datagrid = ({ isAdmin, children, ...props }) => {
    const { data, filterValues } = useListContext();
    const selectedTeacherType = filterValues?.['extra.teacherTypeId'];

    return (
        <CommonDatagrid {...props}>
            {children}
            
            {/* Universal fields - always shown */}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <MultiReferenceField source="teacherId" sortBy="teacher.name" reference="teacher" />
            <DateField source="reportDate" />
            <SelectField source="year" choices={yearChoices} />
            <BooleanField source="isConfirmed" />
            
            {/* Dynamic columns based on teacher type */}
            {getPivotColumns(data)}
            
            {/* Fallback for when no teacher type is selected */}
            {!selectedTeacherType && (
                <TextField source="comment" />
            )}
        </CommonDatagrid>
    );
}

const entity = {
    resource: 'att_report/pivot?extra.pivot=AttReportByTeacherType',
    Datagrid,
    filters,
    filterDefaultValues,
};

export default getResourceComponents(entity).list;
```

#### Step 2: Enhanced App.jsx Integration

```jsx
// client/src/App.jsx

// Add import
import AttReportByTeacherType from 'src/pivots/AttReportByTeacherType';

// In the CustomRoutes section, add:
<CustomRoutes>
  <Route path="/yemot-simulator" element={<YemotSimulator />} />
  <Route path="/tutorial" element={<Tutorial />} />
  <Route path="/pages-view" element={<PageList />} />
  <Route path="/roadmap" element={<Roadmap features={roadmapFeatures} />} />
  <Route path="/att-report-pricing" element={<AttReportWithPricing />} />
  <Route path="/att-report-by-teacher-type" element={<AttReportByTeacherType />} />
</CustomRoutes>
```

## Example 2: Multiple Static Pivot Tables

### Implementation for Seminary Class Teachers (SEMINAR_KITA)

```jsx
// client/src/pivots/AttReportSeminarKita.jsx

import { 
    DateInput, 
    NumberField, 
    TextField, 
    ReferenceField, 
    SelectField, 
    BooleanInput,
    DateField,
    BooleanField
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { MultiReferenceField } from '@shared/components/fields/CommonReferenceField';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

const filters = [
    ({ isAdmin }) => isAdmin && <CommonReferenceInputFilter source="userId" reference="user" />,
    <DateInput source="reportDate:$gte" label="תאריך דיווח אחרי" alwaysOn />,
    <DateInput source="reportDate:$lte" label="תאריך דיווח לפני" alwaysOn />,
    <CommonReferenceInputFilter 
        source="teacherId" 
        reference="teacher" 
        dynamicFilter={(req) => ({
            ...filterByUserId(req),
            teacherTypeId: 1 // Only SEMINAR_KITA teachers
        })} 
    />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <BooleanInput source="isConfirmed" label="מאושר" />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
};

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            
            {/* Universal fields */}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <MultiReferenceField source="teacherId" sortBy="teacher.name" reference="teacher" />
            <DateField source="reportDate" />
            <SelectField source="year" choices={yearChoices} />
            <BooleanField source="isConfirmed" />
            
            {/* SEMINAR_KITA specific fields */}
            <NumberField source="howManyStudents" label="מספר תלמידים" />
            <NumberField source="howManyLessons" label="מספר שיעורים" />
            <NumberField source="howManyWatchOrIndividual" label="מספר צפיות או אישיות" />
            <NumberField source="howManyTeachedOrInterfering" label="מספר הוראות או התערבויות" />
            <BooleanField source="wasKamal" label="האם היה כמל" />
            <NumberField source="howManyDiscussingLessons" label="מספר שיעורי דיון" />
            <NumberField source="howManyLessonsAbsence" label="מספר שיעורי היעדרות" />
            
            <TextField source="comment" label="הערות" />
        </CommonDatagrid>
    );
}

const entity = {
    resource: 'att_report/pivot?extra.pivot=AttReportSeminarKita&extra.teacherTypeId=1',
    Datagrid,
    filters,
    filterDefaultValues,
};

export default getResourceComponents(entity).list;
```

### Backend Support for Static Pivots

```typescript
// server/src/entity-modules/att-report.config.ts

case 'AttReportSeminarKita': {
  // Filter to only show SEMINAR_KITA teachers and relevant fields
  const seminarKitaFields = getFieldsForTeacherType(TeacherTypeId.SEMINAR_KITA);
  
  // Filter data to only include teachers of this type
  const filteredData = data.filter(report => 
    report.teacher?.teacherTypeId === TeacherTypeId.SEMINAR_KITA
  );
  
  // Clean each report to only include relevant fields
  filteredData.forEach(report => {
    Object.keys(report).forEach(key => {
      if (!seminarKitaFields.includes(key as AttReportField)) {
        delete report[key];
      }
    });
  });
  
  // Replace original data with filtered data
  data.length = 0;
  data.push(...filteredData);
  break;
}
```

## Example 3: Tabbed Interface Implementation

```jsx
// client/src/pivots/AttReportTabbedView.jsx

import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { Title } from 'react-admin';
import AttReportSeminarKita from './AttReportSeminarKita';
import AttReportManha from './AttReportManha';
import AttReportPds from './AttReportPds';
import AttReportKindergarten from './AttReportKindergarten';
import AttReportSpecialEducation from './AttReportSpecialEducation';

const TeacherTypeTab = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`teacher-type-tabpanel-${index}`}
      aria-labelledby={`teacher-type-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AttReportTabbedView = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const teacherTypes = [
    { 
      id: 1, 
      label: 'סמינר כיתה', 
      Component: AttReportSeminarKita,
      description: 'דוחות מורות סמינר כיתה'
    },
    { 
      id: 3, 
      label: 'מנהה', 
      Component: AttReportManha,
      description: 'דוחות מנהות מחוז'
    },
    { 
      id: 5, 
      label: 'פדס', 
      Component: AttReportPds,
      description: 'דוחות מורות פדס'
    },
    { 
      id: 6, 
      label: 'גן', 
      Component: AttReportKindergarten,
      description: 'דוחות מורות גן'
    },
    { 
      id: 7, 
      label: 'חינוך מיוחד', 
      Component: AttReportSpecialEducation,
      description: 'דוחות מורות חינוך מיוחד'
    },
  ];

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Title title="דוחות נוכחות לפי סוג מורה" />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleChange} 
          aria-label="teacher type reports tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {teacherTypes.map((type, index) => (
            <Tab 
              key={type.id} 
              label={type.label} 
              id={`teacher-type-tab-${index}`}
              aria-controls={`teacher-type-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>
      
      {teacherTypes.map((type, index) => (
        <TeacherTypeTab key={type.id} value={activeTab} index={index}>
          <Typography variant="h6" component="h2" gutterBottom>
            {type.description}
          </Typography>
          <type.Component />
        </TeacherTypeTab>
      ))}
    </Box>
  );
};

export default AttReportTabbedView;
```

## Example 4: Menu Integration

### Enhanced Menu Structure

```jsx
// client/src/App.jsx

// Add menu group for teacher type reports
const teacherReportMenuItems = [
  {
    path: "/att-report-by-teacher-type",
    label: "דוח דינמי לפי סוג מורה",
    icon: AssignmentIcon,
    component: <AttReportByTeacherType />
  },
  {
    path: "/att-report-tabbed",
    label: "דוחות בלשוניות",
    icon: TabIcon,
    component: <AttReportTabbedView />
  },
  {
    path: "/att-report-seminar",
    label: "סמינר כיתה",
    icon: SchoolIcon,
    component: <AttReportSeminarKita />
  },
  {
    path: "/att-report-manha",
    label: "מנהה",
    icon: SupervisorAccountIcon,
    component: <AttReportManha />
  },
  {
    path: "/att-report-kindergarten",
    label: "גן",
    icon: ChildCareIcon,
    component: <AttReportKindergarten />
  },
];

// In the CustomRoutes section:
<CustomRoutes>
  {teacherReportMenuItems.map(item => (
    <Route key={item.path} path={item.path} element={item.component} />
  ))}
</CustomRoutes>
```

## Testing Examples

### Unit Tests for fieldsShow.util.ts

```typescript
// server/src/utils/__tests__/fieldsShow.util.spec.ts

import { 
  shouldShowField, 
  getFieldsForTeacherType, 
  getTeacherTypesForField,
  TeacherTypeId,
  buildHeadersForTeacherType
} from '../fieldsShow.util';

describe('fieldsShow.util', () => {
  describe('shouldShowField', () => {
    it('should show universal fields for all teacher types', () => {
      expect(shouldShowField('id', TeacherTypeId.SEMINAR_KITA)).toBe(true);
      expect(shouldShowField('teacherId', TeacherTypeId.MANHA)).toBe(true);
      expect(shouldShowField('reportDate', TeacherTypeId.KINDERGARTEN)).toBe(true);
    });

    it('should show type-specific fields for correct teacher type', () => {
      expect(shouldShowField('howManyStudents', TeacherTypeId.SEMINAR_KITA)).toBe(true);
      expect(shouldShowField('howManyMethodic', TeacherTypeId.MANHA)).toBe(true);
      expect(shouldShowField('wasCollectiveWatch', TeacherTypeId.KINDERGARTEN)).toBe(true);
    });

    it('should not show type-specific fields for wrong teacher type', () => {
      expect(shouldShowField('howManyMethodic', TeacherTypeId.SEMINAR_KITA)).toBe(false);
      expect(shouldShowField('wasCollectiveWatch', TeacherTypeId.MANHA)).toBe(false);
    });
  });

  describe('buildHeadersForTeacherType', () => {
    it('should build correct headers for SEMINAR_KITA', () => {
      const headers = buildHeadersForTeacherType(TeacherTypeId.SEMINAR_KITA);
      
      expect(headers).toContainEqual({
        value: 'howManyStudents',
        label: 'מספר תלמידים',
        sortable: true
      });
      
      expect(headers).toContainEqual({
        value: 'howManyLessons',
        label: 'מספר שיעורים',
        sortable: true
      });
    });
  });
});
```

### Frontend Component Tests

```jsx
// client/src/pivots/__tests__/AttReportByTeacherType.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import { AdminContext } from 'react-admin';
import AttReportByTeacherType from '../AttReportByTeacherType';

const mockDataProvider = {
  getList: jest.fn(() => Promise.resolve({ data: [], total: 0 })),
};

const mockAuthProvider = {
  login: jest.fn(),
  logout: jest.fn(),
  checkAuth: jest.fn(() => Promise.resolve()),
  checkError: jest.fn(),
  getPermissions: jest.fn(() => Promise.resolve({})),
};

describe('AttReportByTeacherType', () => {
  it('should render teacher type filter', () => {
    render(
      <AdminContext dataProvider={mockDataProvider} authProvider={mockAuthProvider}>
        <AttReportByTeacherType />
      </AdminContext>
    );

    expect(screen.getByLabelText('סוג מורה')).toBeInTheDocument();
  });

  it('should show dynamic columns based on teacher type selection', async () => {
    render(
      <AdminContext dataProvider={mockDataProvider} authProvider={mockAuthProvider}>
        <AttReportByTeacherType />
      </AdminContext>
    );

    // Select seminary class teacher type
    const teacherTypeSelect = screen.getByLabelText('סוג מורה');
    fireEvent.change(teacherTypeSelect, { target: { value: '1' } });

    // Wait for component to update and check for specific fields
    await screen.findByText('מספר תלמידים');
    expect(screen.getByText('מספר שיעורים')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Backend Caching

```typescript
// server/src/entity-modules/att-report.config.ts

import { CacheModule } from '@nestjs/cache-manager';

// Add caching for field configurations
private fieldConfigCache = new Map<number, AttReportField[]>();
private headerConfigCache = new Map<number, IHeader[]>();

private getFieldsForTeacherTypeCached(teacherTypeId: number): AttReportField[] {
  if (!this.fieldConfigCache.has(teacherTypeId)) {
    const fields = getFieldsForTeacherType(teacherTypeId);
    this.fieldConfigCache.set(teacherTypeId, fields);
  }
  return this.fieldConfigCache.get(teacherTypeId);
}

private buildHeadersForTeacherTypeCached(teacherTypeId: number): IHeader[] {
  if (!this.headerConfigCache.has(teacherTypeId)) {
    const headers = buildHeadersForTeacherType(teacherTypeId);
    this.headerConfigCache.set(teacherTypeId, headers);
  }
  return this.headerConfigCache.get(teacherTypeId);
}
```

### Frontend Memoization

```jsx
// client/src/pivots/AttReportByTeacherType.jsx

import { useMemo } from 'react';

const Datagrid = ({ isAdmin, children, ...props }) => {
    const { data, filterValues } = useListContext();
    const selectedTeacherType = filterValues?.['extra.teacherTypeId'];

    // Memoize dynamic columns to prevent unnecessary re-renders
    const dynamicColumns = useMemo(() => {
        return getPivotColumns(data);
    }, [data, selectedTeacherType]);

    return (
        <CommonDatagrid {...props}>
            {children}
            <MultiReferenceField source="teacherId" sortBy="teacher.name" reference="teacher" />
            <DateField source="reportDate" />
            {dynamicColumns}
        </CommonDatagrid>
    );
};
```

This implementation guide provides comprehensive examples for all the approaches discussed in the main research document, with specific code samples and testing strategies.