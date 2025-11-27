# Salary Report By Teacher — Design Document

## Goal
Replace the existing "salary-report-totals" view with a more useful per-teacher breakdown.
Each row = one salary report + one teacher, showing counts and calculated payment totals.

---

## Requested Fields (UI)
| Field | Source | Notes |
|-------|--------|-------|
| id | View | Composite: `{salaryReportId}_{teacherReferenceId}` |
| salaryReportId | View | FK to salary_report |
| userId | View | FK to user |
| teacherReferenceId | View | FK to teacher |
| date | **Relation** | From salaryReport.date via ReferenceField |
| name | **Relation** | From salaryReport.name via ReferenceField |
| year | **Relation** | From salaryReport.year via ReferenceField |
| teacher | **Relation** | From teacher.name via ReferenceField |
| answerCount | **Pivot (calculated)** | COUNT of answers for this salary_report + teacher |
| attReportCount | **Pivot (calculated)** | COUNT of att_reports for this salary_report + teacher |
| answersTotal | **Pivot (calculated)** | SUM(answer × question.tariff) |
| attReportsTotal | **Pivot (calculated)** | SUM using pricing util |
| grandTotal | **Pivot (calculated)** | answersTotal + attReportsTotal |
| ShowMatchingRecordsButton (answers) | Frontend | Filter: `{ salaryReportId, teacherReferenceId }` |
| ShowMatchingRecordsButton (att_reports) | Frontend | Filter: `{ salaryReportId, teacherReferenceId }` |
| createdAt | **Relation** | From salaryReport.createdAt (admin only) |
| updatedAt | **Relation** | From salaryReport.updatedAt (admin only) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│  SalaryReportPerTeacher.jsx                                     │
│  resource: salary_report_by_teacher/pivot?extra.pivot=WithTotals│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Service                               │
│  salary-report-by-teacher.config.ts                             │
│  SalaryReportByTeacherService.populatePivotData('WithTotals')   │
│  - Loads PriceByUser for userId                                 │
│  - For each row: queries answers + att_reports                  │
│  - Calculates counts and totals using existing pricing util     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SQL View Entity                               │
│  SalaryReportByTeacher.entity.ts                                │
│  Ultra-minimal: id, userId, salaryReportId, teacherReferenceId  │
│  + @ManyToOne relations to SalaryReport and Teacher             │
│  NO date/name/year columns — accessed via relations             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Optimized Design Decisions

### 1. Lean View Entity
The SQL view should be **minimal** — just the unique (salary_report, teacher) pairs with base salary_report fields. No aggregates in the view.

**Why?**
- Simpler SQL, easier to maintain
- All calculations in one place (service)
- Consistent with existing patterns (see `SalaryReportWithTotals` pivot)
- Avoids duplicating pricing logic in SQL vs TypeScript

### 2. Pivot Pattern for Calculations
Use the same pivot pattern as `salary-report.config.ts`:
- Frontend requests: `salary_report_by_teacher/pivot?extra.pivot=WithTotals`
- Service's `populatePivotData('WithTotals', ...)` adds calculated fields

**Why?**
- Reuses existing `calculateAttendanceReportPrice` utility
- Keeps pricing logic in one place (TypeScript)
- Consistent with how `SalaryReportWithTotals` already works

### 3. Self-Contained Module
All logic for this feature lives in:
- `server/src/db/view-entities/SalaryReportByTeacher.entity.ts`
- `server/src/entity-modules/salary-report-by-teacher.config.ts`

**No changes to** `salary-report.config.ts` — keeps concerns separated.

---

## SQL View Design

```sql
-- salary_report_by_teacher view
-- Ultra-minimal: just the unique (userId, salaryReportId, teacherReferenceId) groupings
-- All other fields (date, name, year, etc.) come via TypeORM relations

SELECT 
  CONCAT(salaryReportId, '_', teacherReferenceId) AS id,
  userId,
  salaryReportId,
  teacherReferenceId
FROM reportable_items
WHERE salaryReportId IS NOT NULL AND teacherReferenceId IS NOT NULL
GROUP BY userId, salaryReportId, teacherReferenceId
```

**Key Points:**
- Reuses existing `reportable_items` view
- Only 4 columns: id, userId, salaryReportId, teacherReferenceId
- Salary report fields (date, name, year, createdAt, updatedAt) via `@ManyToOne` relation
- Teacher name via `@ManyToOne` relation
- Frontend uses `<ReferenceField>` for display

---

## Database Migrations

Migrations must be run inside the Docker container:

1. **Dry-run** to verify changes:
   ```bash
   docker compose exec server yarn typeorm:generate src/migrations/CreateSalaryReportByTeacherView --dryrun --pretty
   ```

2. **Generate** the migration:
   ```bash
   docker compose exec server yarn typeorm:generate src/migrations/CreateSalaryReportByTeacherView --pretty
   ```

3. **Run** migrations:
   ```bash
   docker compose exec server yarn typeorm:run
   ```

---

## Service Implementation

```typescript
// salary-report-by-teacher.config.ts

interface SalaryReportByTeacherWithTotals extends SalaryReportByTeacher {
  answerCount?: number;
  attReportCount?: number;
  answersTotal?: number;
  attReportsTotal?: number;
  grandTotal?: number;
}

class SalaryReportByTeacherService extends BaseEntityService<SalaryReportByTeacher> {
  protected async populatePivotData(
    pivotName: string, 
    list: SalaryReportByTeacher[], 
    extra: any, 
    filter: any[], 
    auth: any
  ): Promise<void> {
    if (pivotName !== 'WithTotals') return;
    
    const userId = getUserIdFromUser(auth);
    
    // 1. Load pricing data
    const priceMap = await this.loadPriceMap(userId);
    
    // 2. For each row, calculate totals
    for (const row of list as SalaryReportByTeacherWithTotals[]) {
      await this.calculateRowTotals(row, userId, priceMap);
    }
  }
  
  private async loadPriceMap(userId: number): Promise<Map<string, number>> {
    const priceByUserRepo = this.dataSource.getRepository(PriceByUser);
    const prices = await priceByUserRepo.find({ where: { userId } });
    return new Map(prices.map(p => [p.code, p.price]));
  }
  
  private async calculateRowTotals(
    row: SalaryReportByTeacherWithTotals, 
    userId: number, 
    priceMap: Map<string, number>
  ): Promise<void> {
    const answerRepo = this.dataSource.getRepository(Answer);
    const attReportRepo = this.dataSource.getRepository(AttReport);
    
    // Load answers for this salary_report + teacher
    const answers = await answerRepo.find({
      where: { 
        salaryReportId: row.salaryReportId, 
        teacherReferenceId: row.teacherReferenceId,
        userId 
      },
      relations: ['question'],
    });
    
    // Load att_reports for this salary_report + teacher
    const attReports = await attReportRepo.find({
      where: { 
        salaryReportId: row.salaryReportId, 
        teacherReferenceId: row.teacherReferenceId,
        userId 
      },
      relations: ['teacher', 'teacher.teacherType'],
    });
    
    // Calculate counts
    row.answerCount = answers.length;
    row.attReportCount = attReports.length;
    
    // Calculate answers total (answer × tariff)
    row.answersTotal = roundToTwoDecimals(
      answers.reduce((sum, a) => sum + (a.answer * (a.question?.tariff || 0)), 0)
    );
    
    // Calculate att_reports total using pricing util
    row.attReportsTotal = roundToTwoDecimals(
      attReports.reduce((sum, report) => {
        const teacherTypeId = report.teacher?.teacherType?.key;
        if (!teacherTypeId) return sum;
        return sum + calculateAttendanceReportPrice(report, teacherTypeId, priceMap);
      }, 0)
    );
    
    // Grand total
    row.grandTotal = roundToTwoDecimals(row.answersTotal + row.attReportsTotal);
  }
}
```

---

## Frontend Component

```jsx
// SalaryReportPerTeacher.jsx

const ShowTeacherReportablesButton = ({ targetResource, label }) => {
  const record = useRecordContext();
  if (!record) return null;
  
  return (
    <ShowMatchingRecordsButton
      resource={targetResource}
      filter={{ 
        salaryReportId: record.salaryReportId, 
        teacherReferenceId: record.teacherReferenceId 
      }}
      label={label}
    />
  );
};

const Datagrid = ({ isAdmin, children, ...props }) => (
  <CommonDatagrid {...props}>
    {children}
    {isAdmin && <TextField source="id" />}
    {isAdmin && <ReferenceField source="userId" reference="user" />}
    <ReferenceField source="salaryReportId" reference="salary_report" link="show" />
    <DateField showDate showTime source="date" />
    <TextField source="name" />
    <ReferenceField source="teacherReferenceId" reference="teacher" />
    <SelectField source="year" choices={yearChoices} />
    
    <NumberField source="answerCount" />
    <NumberField source="attReportCount" />
    <NumberField source="answersTotal" options={currencyOptions} />
    <NumberField source="attReportsTotal" options={currencyOptions} />
    <NumberField source="grandTotal" options={currencyOptions} sx={{ fontWeight: 'bold' }} />
    
    <ShowTeacherReportablesButton targetResource="answer" label="תשובות" />
    <ShowTeacherReportablesButton targetResource="att_report" label="דיווחים" />
    
    {isAdmin && <DateField showDate showTime source="createdAt" />}
    {isAdmin && <DateField showDate showTime source="updatedAt" />}
  </CommonDatagrid>
);

const entity = {
  resource: 'salary_report_by_teacher/pivot?extra.pivot=WithTotals',
  Datagrid,
  filters,
  filterDefaultValues,
};

export default getResourceComponents(entity).list;
```

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `server/src/db/view-entities/SalaryReportByTeacher.entity.ts` | Minimal view entity (no calculated fields) |
| `server/src/entity-modules/salary-report-by-teacher.config.ts` | Service with pivot calculation logic |
| `client/src/pivots/SalaryReportPerTeacher.jsx` | Frontend list component |

### Modified Files
| File | Change |
|------|--------|
| `server/src/entities.module.ts` | Register new module |
| `client/src/App.jsx` | Add route |
| `client/src/GeneralLayout.jsx` | Add menu item |
| `client/src/domainTranslations.js` | Add translations |

### No Changes Needed
- `salary-report.config.ts` — keep existing `SalaryReportWithTotals` pivot unchanged

---

## Implementation Steps

1. **Create view entity** (`SalaryReportByTeacher.entity.ts`)
   - Uses `reportable_items` view for distinct teacher pairs
   - No calculated fields

2. **Create entity module** (`salary-report-by-teacher.config.ts`)
   - Service extends BaseEntityService
   - `populatePivotData('WithTotals')` calculates all fields
   - Reuse existing `calculateAttendanceReportPrice` util

3. **Register module** in `entities.module.ts`

4. **Generate & run migration**
   ```bash
   docker compose exec server yarn typeorm:generate src/migrations/CreateSalaryReportByTeacherView --dryrun --pretty
   docker compose exec server yarn typeorm:generate src/migrations/CreateSalaryReportByTeacherView --pretty
   docker compose exec server yarn typeorm:run
   ```

5. **Create frontend pivot** (`SalaryReportPerTeacher.jsx`)
   - Resource: `salary_report_by_teacher/pivot?extra.pivot=WithTotals`
   - Two `ShowMatchingRecordsButton` with compound filters

6. **Add route & menu** in `App.jsx` and `GeneralLayout.jsx`

7. **Add translations** in `domainTranslations.js`

8. **Test**
   - Verify view returns correct pairs
   - Verify pivot calculates correct totals
   - Verify ShowMatchingRecordsButton filters work

---

## Performance Considerations

The current design queries answers and att_reports for each row in the list. For large result sets, this could be slow.

**Optimization Options (if needed):**

1. **Batch queries** — Load all answers/att_reports for all visible rows in one query, then distribute to rows in memory
   
2. **Add counts to view** — If counts are frequently needed without totals, add COUNT subqueries to the SQL view

3. **Pagination** — Ensure reasonable page sizes (default 25-50 rows)

For now, keep it simple. Optimize if performance issues arise.

---

## Comparison: Before vs After

| Aspect | SalaryReportWithTotals (current) | SalaryReportPerTeacher (new) |
|--------|----------------------------------|------------------------------|
| Granularity | Per salary report | Per salary report + teacher |
| Teacher breakdown | No | Yes |
| ShowMatchingRecordsButton | By salary report only | By salary report + teacher |
| Implementation | Pivot on SalaryReport entity | Separate view entity + pivot |
| Where calculations live | salary-report.config.ts | salary-report-by-teacher.config.ts |

---

## Open Questions

1. **Keep SalaryReportWithTotals?** — Should we remove it or keep both views?
   - Recommendation: Keep both, they serve different purposes

2. **Filter by teacher?** — Should the UI allow filtering by teacher?
   - Recommendation: Yes, add `CommonReferenceInput` filter for teacher

3. **Export support?** — Should this view be exportable?
   - Recommendation: Add later if requested
