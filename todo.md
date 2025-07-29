# Teacher Report NRA - Entity Implementation Tasks

## Mission: Implement all entities from wolf-teacher-reports system with CRUD configs and migrations

### Entity Implementation (Following AGENT_WORKFLOW.md patterns)

#### 1. Enhanced Teacher Entity  
- [x] Extend existing Teacher entity with wolf-teacher-reports fields:
  - [x] Add `phone` field (VARCHAR)
  - [x] Add `email` field (VARCHAR) 
  - [x] Add `school` field (VARCHAR)
  - [x] Add `teacher_type_id` field (INTEGER, references teacher_types.key)
  - [x] Add `price` field (DECIMAL) for hourly wage
  - [x] Add `training_teacher` field (VARCHAR)
  - [x] Add `special_question` field (INTEGER, references questions.id)
  - [x] Add `student_count` field (INTEGER)
- [x] Register in entities.module.ts

#### 2. Enhanced Student Entity
- [x] Extend existing Student entity:
  - [x] Add `phone` field (VARCHAR)
  - [x] Add `email` field (VARCHAR)
- [x] Register in entities.module.ts

#### 3. TeacherType Entity
- [x] Create TeacherType entity in `server/src/db/entities/TeacherType.entity.ts`:
  - [x] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [x] `user_id` (FOREIGN KEY to users.id)
  - [x] `key` (INTEGER) - Type identifier (1-7)
  - [x] `name` (VARCHAR) - Hebrew name
- [x] Register in entities.module.ts

#### 4. AttReport Entity (Core reporting table)
- [x] Create AttReport entity in `server/src/db/entities/AttReport.entity.ts`:
  - [x] Basic fields: id, user_id, teacher_id, report_date, update_date, year, is_confirmed
  - [x] Salary fields: salaryReport (links to salary_reports.id), salary_month, comment
  - [x] Activity fields: how_many_students, how_many_methodic, four_last_digits_of_teacher_phone
  - [x] Teaching fields: teached_student_tz (TEXT), how_many_yalkut_lessons, how_many_discussing_lessons
  - [x] Assessment fields: how_many_students_help_teached, how_many_lessons_absence, how_many_watched_lessons
  - [x] Boolean flags: was_discussing, was_kamal, was_students_good, was_students_enter_on_time, was_students_exit_on_time
  - [x] Special fields: activity_type (references att_types.id), teacher_to_report_for, was_collective_watch
  - [x] Tariff fields: is_taarif_hulia, is_taarif_hulia2, is_taarif_hulia3
- [x] Register in entities.module.ts

#### 5. AttType Entity
- [x] Create AttType entity in `server/src/db/entities/AttType.entity.ts`:
  - [x] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [x] `user_id` (FOREIGN KEY to users.id)
  - [x] `name` (VARCHAR)
- [x] Register in entities.module.ts

#### 6. Price Entity
- [x] Create Price entity in `server/src/db/entities/Price.entity.ts`:
  - [x] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [x] `user_id` (FOREIGN KEY to users.id)
  - [x] `key` (INTEGER) - Price identifier
  - [x] `price` (DECIMAL)
- [x] Register in entities.module.ts

#### 7. Question Entity
- [x] Create Question entity in `server/src/db/entities/Question.entity.ts`:
  - [x] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [x] `user_id` (FOREIGN KEY to users.id)
  - [x] `teacher_type_id` (INTEGER)
  - [x] `question_type_id` (INTEGER, references question_types.key)
  - [x] `content` (TEXT) - Hebrew question text
  - [x] `allowed_digits` (VARCHAR) - Comma-separated allowed input
  - [x] `is_standalone` (BOOLEAN)
  - [x] `start_date` (DATE)
  - [x] `end_date` (DATE)
- [x] Register in entities.module.ts

#### 8. QuestionType Entity
- [x] Create QuestionType entity in `server/src/db/entities/QuestionType.entity.ts`:
  - [x] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [x] `user_id` (FOREIGN KEY to users.id)
  - [x] `key` (INTEGER) - Type identifier (1-4)
  - [x] `name` (VARCHAR) - Type name
- [x] Register in entities.module.ts

#### 9. Answer Entity
- [x] Create Answer entity in `server/src/db/entities/Answer.entity.ts`:
  - [x] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [x] `user_id` (FOREIGN KEY to users.id)
  - [x] `teacher_id` (FOREIGN KEY to teachers.id)
  - [x] `question_id` (FOREIGN KEY to questions.id)
  - [x] `report_id` (FOREIGN KEY to att_reports.id)
  - [x] `answer` (INTEGER) - 0 or 1
  - [x] `answer_date` (DATE)
- [x] Register in entities.module.ts

#### 10. WorkingDate Entity
- [x] Create WorkingDate entity in `server/src/db/entities/WorkingDate.entity.ts`:
  - [x] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [x] `user_id` (FOREIGN KEY to users.id)
  - [x] `teacher_type_id` (INTEGER)
  - [x] `working_date` (DATE)
- [x] Register in entities.module.ts

#### 11. SalaryReport Entity
- [x] Create SalaryReport entity in `server/src/db/entities/SalaryReport.entity.ts`:
  - [x] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [x] `user_id` (FOREIGN KEY to users.id)
  - [x] `ids` (TEXT) - Comma-separated att_report IDs
  - [x] `date` (DATETIME)
  - [x] `name` (VARCHAR) - Optional name
- [x] Register in entities.module.ts

### Database Migration Generation

#### 12. Generate TypeORM Migrations
- [x] Generate migration for all new entities:
  ```bash
  cd server && yarn typeorm:generate src/migrations/AddTeacherReportEntities
  ```
- [x] Review generated migration file
- [ ] Run migration to apply schema changes (requires database environment):
  ```bash
  yarn typeorm:run
  ```

### Frontend React Admin Implementation

#### 13. Entity Components for New Tables
- [x] Create teacher-type.jsx component in `client/src/entities/`
- [x] Create att-report.jsx component in `client/src/entities/`
- [x] Create att-type.jsx component in `client/src/entities/`
- [x] Create price.jsx component in `client/src/entities/`
- [x] Create question.jsx component in `client/src/entities/`
- [x] Create question-type.jsx component in `client/src/entities/`
- [x] Create answer.jsx component in `client/src/entities/`
- [x] Create working-date.jsx component in `client/src/entities/`
- [x] Create salary-report.jsx component in `client/src/entities/`

#### 14. App.jsx Updates
- [x] Add new resources to React Admin in `client/src/App.jsx`
- [x] Update `client/src/domainTranslations.js` with Hebrew translations

#### 15. Enhanced Teacher and Student Updates
- [x] Update teacher.jsx component with new fields (phone, email, school, teacherTypeId, price, trainingTeacher, specialQuestion, studentCount)
- [x] Update student.jsx component with new fields (phone, email)

## Missing Functionality Analysis (Based on SYSTEM_REQUIREMENTS.md)

### 🚨 Critical Missing API Endpoints

#### 16. Specialized Report Endpoints (Backend)
According to SYSTEM_REQUIREMENTS.md, the following specialized report endpoints should exist but are currently missing:
- [ ] `GET /api/att-reports/getSeminarKitaReport` - Seminar Kita teacher reports with student count calculations
- [ ] `GET /api/att-reports/getTrainingReport` - Training teacher reports (marked as not in use but should exist)
- [ ] `GET /api/att-reports/getManhaReport` - Manha teacher reports with complex validation
- [ ] `GET /api/att-reports/getResponsibleReport` - Responsible reports (marked as not in use but should exist)
- [ ] `GET /api/att-reports/getPdsReport` - PDS teacher reports
- [ ] `GET /api/att-reports/getSpecialEducationReport` - Special education reports
- [ ] `GET /api/att-reports/getKindergartenReport` - Kindergarten reports
- [ ] `GET /api/att-reports/getTotalPayMonthlyReport` - Monthly salary summary reports

#### 17. Report Management Endpoints (Backend)
- [ ] `POST /api/att-reports/updateSalaryMonth` - Update salary month for multiple reports
- [ ] `POST /api/att-reports/updateSalaryComment` - Update comment for report
- [ ] `POST /api/att-reports/createSalaryReport` - Create salary report grouping
- [ ] `POST /api/att-reports/:report/export-pdf` - Export report as PDF with Hebrew RTL support

#### 18. Dashboard Endpoint (Backend)
- [ ] `GET /api/dashboard` - Dashboard statistics and summary data

### 📱 Phone System Integration Gaps

#### 19. Complete YemotHandlerService Implementation
Current implementation has many TODO comments and missing functionality:
- [ ] Complete `getStudentByTz()` method - currently returns null, needs Student entity integration
- [ ] Implement comprehensive question system logic with dynamic questions based on teacher type
- [ ] Complete validation methods:
  - [ ] `validateNoMoreThanTenAbsences()` - currently incomplete
  - [ ] `validateSeminarKitaLessonCount()` - validation logic exists but needs testing
  - [ ] `validateManhaReport()` - basic implementation exists
  - [ ] `validatePdsReport()` - basic implementation exists
- [ ] Implement missing teacher type report methods (marked with TODO):
  - [ ] Complete `getTrainingReport()` - currently empty
  - [ ] Complete `getReponsibleReport()` - currently empty
- [ ] Implement `showReports()` functionality for viewing previous reports
- [ ] Add support for question types 1-4 with proper logic
- [ ] Implement Hebrew text message system integration

#### 20. Text/Message System for Phone Integration
- [ ] Populate TextByUser system with required Hebrew messages for phone system:
  - [ ] TEACHER.WELCOME messages
  - [ ] REPORT.* messages for all report flows
  - [ ] VALIDATION.* messages for all validation rules
  - [ ] QUESTION.* messages for dynamic question system
  - [ ] GENERAL.* messages for common interactions

### 🎯 Frontend Missing Specialized Views

#### 21. Dedicated Report Views by Teacher Type
According to SYSTEM_REQUIREMENTS.md, these specialized frontend routes should exist:
- [ ] `/seminar-kita-reports` - Dedicated view for Seminar Kita teacher reports
- [ ] `/manha-reports` - Dedicated view for Manha teacher reports  
- [ ] `/pds-reports` - Dedicated view for PDS teacher reports
- [ ] `/special-education-reports` - Dedicated view for Special Education reports
- [ ] `/kindergarten-reports` - Dedicated view for Kindergarten reports
- [ ] `/total-monthly-reports` - Monthly salary summary reports view

#### 22. Enhanced Navigation Structure
- [ ] Update main navigation to include "Reports" dropdown menu with specialized report views
- [ ] Add proper menu grouping for different report types
- [ ] Implement dynamic field visibility based on teacher type selection

#### 23. Excel Import/Export Functionality
- [ ] `/excel-import` route for data import (basic structure exists but needs validation)
- [ ] Enhanced export functionality with teacher-type-specific fields
- [ ] PDF export with Hebrew RTL templates

### 💼 Business Logic Implementation Gaps

#### 24. Comprehensive Salary Calculation System
While basic pricing utilities exist, the complex salary calculation from SYSTEM_REQUIREMENTS.md needs implementation:
- [ ] Complete salary calculation formulas for each teacher type:
  - [ ] Type 1 (Seminar Kita): Complex formula with student count multipliers
  - [ ] Type 2 (Training): Fixed pricing structure  
  - [ ] Type 3 (Manha): Multi-tier pricing with activity types
  - [ ] Type 5 (PDS): Watch/teach/discuss pricing
  - [ ] Type 6 (Kindergarten): Collective watch and student-based pricing
  - [ ] Type 7 (Special Education): Lesson and student-based pricing
- [ ] Extra pay calculation from special question answers
- [ ] Salary month assignment and grouping logic

#### 25. Enhanced Validation Rules
- [ ] Implement complete business validation rules:
  - [ ] Maximum 10 absences per month per teacher (partially implemented)
  - [ ] Lesson count validation for Seminar Kita teachers
  - [ ] Working day validation against WorkingDate entities
  - [ ] Report confirmation requirements before new reports
  - [ ] Salary report lock prevention (cannot modify confirmed or grouped reports)
  - [ ] Future date reporting prevention
  - [ ] Academic year boundary validation

#### 26. Hebrew Year System Integration
- [ ] Validate Hebrew year calculation logic (תש"פ format)
- [ ] Academic year boundary handling (July 1st start)
- [ ] Hebrew date formatting for phone system
- [ ] Year selection persistence in localStorage

#### 27. Question System Enhancement
- [ ] Implement question type logic (1-4) with proper triggers:
  - [ ] Type 1: Always ask if no answer
  - [ ] Type 2: Ask if no "yes" answer  
  - [ ] Type 3: Ask if no "no" answer
  - [ ] Type 4: Special question based on teacher setting
- [ ] Date range activation for questions
- [ ] Teacher-specific special questions
- [ ] Question answer validation and storage

### 🔐 Access Control and Permissions

#### 28. Enhanced Permission System
- [ ] Validate user-based data isolation (all entities filtered by userId)
- [ ] Phone system user lookup by phone number
- [ ] Admin vs regular user permission differentiation
- [ ] Report modification permissions based on confirmation status

### 📊 Data Views and Reporting

#### 29. Database Views Implementation
- [ ] Verify `salary_reports_view` implementation
- [ ] Verify `answers_price` view for pricing calculations
- [ ] Add any missing database views for reporting

#### 30. Advanced Filtering and Search
- [ ] Implement teacher type-based field filtering in reports
- [ ] Hebrew month/year filtering
- [ ] Activity type filtering
- [ ] Salary report status filtering

## Implementation Priority

### High Priority (Core Functionality)
1. Specialized report API endpoints (#16)
2. Complete YemotHandlerService implementation (#19)
3. Text/message system for phone integration (#20)
4. Basic specialized frontend views (#21)

### Medium Priority (Enhanced Features)  
1. Complete salary calculation system (#24)
2. Enhanced validation rules (#25)
3. Question system enhancement (#27)
4. Excel import/export functionality (#23)

### Lower Priority (Polish and Enhancement)
1. Enhanced navigation structure (#22)
2. Hebrew year system validation (#26)
3. Advanced filtering features (#30)
4. Database views optimization (#29)