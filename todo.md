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
- [ ] Run migration to apply schema changes:
  ```bash
  yarn typeorm:run
  ```

### Frontend React Admin Implementation

#### 13. Entity Components for New Tables
- [ ] Create teacher-type.jsx component in `client/src/entities/`
- [ ] Create att-report.jsx component in `client/src/entities/`
- [ ] Create att-type.jsx component in `client/src/entities/`
- [ ] Create price.jsx component in `client/src/entities/`
- [ ] Create question.jsx component in `client/src/entities/`
- [ ] Create question-type.jsx component in `client/src/entities/`
- [ ] Create answer.jsx component in `client/src/entities/`
- [ ] Create working-date.jsx component in `client/src/entities/`
- [ ] Create salary-report.jsx component in `client/src/entities/`

#### 14. App.jsx Updates
- [ ] Add new resources to React Admin in `client/src/App.jsx`
- [ ] Update `client/src/domainTranslations.js` with Hebrew translations

#### 15. Specialized Report Components
- [ ] Create seminar-kita-reports.jsx component
- [ ] Create manha-reports.jsx component
- [ ] Create pds-reports.jsx component
- [ ] Create special-education-reports.jsx component
- [ ] Create kindergarten-reports.jsx component
- [ ] Create monthly-reports.jsx component