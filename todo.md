# Teacher Report NRA - Entity Implementation Tasks

## Mission: Implement all entities from wolf-teacher-reports system with CRUD configs and migrations

### Entity Implementation (Following AGENT_WORKFLOW.md patterns)

#### 1. Enhanced Teacher Entity  
- [ ] Extend existing Teacher entity with wolf-teacher-reports fields:
  - [ ] Add `phone` field (VARCHAR)
  - [ ] Add `email` field (VARCHAR) 
  - [ ] Add `school` field (VARCHAR)
  - [ ] Add `teacher_type_id` field (INTEGER, references teacher_types.key)
  - [ ] Add `price` field (DECIMAL) for hourly wage
  - [ ] Add `training_teacher` field (VARCHAR)
  - [ ] Add `special_question` field (INTEGER, references questions.id)
  - [ ] Add `student_count` field (INTEGER)
- [ ] Update teacher.config.ts CRUD configuration

#### 2. Enhanced Student Entity
- [ ] Extend existing Student entity:
  - [ ] Add `phone` field (VARCHAR)
  - [ ] Add `email` field (VARCHAR)
- [ ] Update student.config.ts CRUD configuration

#### 3. TeacherType Entity
- [ ] Create TeacherType entity in `server/src/db/entities/TeacherType.entity.ts`:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `key` (INTEGER) - Type identifier (1-7)
  - [ ] `name` (VARCHAR) - Hebrew name
- [ ] Create teacher-type.config.ts CRUD configuration
- [ ] Register in entities.module.ts

#### 4. AttReport Entity (Core reporting table)
- [ ] Create AttReport entity in `server/src/db/entities/AttReport.entity.ts`:
  - [ ] Basic fields: id, user_id, teacher_id, report_date, update_date, year, is_confirmed
  - [ ] Salary fields: salaryReport (links to salary_reports.id), salary_month, comment
  - [ ] Activity fields: how_many_students, how_many_methodic, four_last_digits_of_teacher_phone
  - [ ] Teaching fields: teached_student_tz (TEXT), how_many_yalkut_lessons, how_many_discussing_lessons
  - [ ] Assessment fields: how_many_students_help_teached, how_many_lessons_absence, how_many_watched_lessons
  - [ ] Boolean flags: was_discussing, was_kamal, was_students_good, was_students_enter_on_time, was_students_exit_on_time
  - [ ] Special fields: activity_type (references att_types.id), teacher_to_report_for, was_collective_watch
  - [ ] Tariff fields: is_taarif_hulia, is_taarif_hulia2, is_taarif_hulia3
- [ ] Create att-report.config.ts CRUD configuration
- [ ] Register in entities.module.ts

#### 5. AttType Entity
- [ ] Create AttType entity in `server/src/db/entities/AttType.entity.ts`:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `name` (VARCHAR)
- [ ] Create att-type.config.ts CRUD configuration
- [ ] Register in entities.module.ts

#### 6. Price Entity
- [ ] Create Price entity in `server/src/db/entities/Price.entity.ts`:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `key` (INTEGER) - Price identifier
  - [ ] `price` (DECIMAL)
- [ ] Create price.config.ts CRUD configuration
- [ ] Register in entities.module.ts

#### 7. Question Entity
- [ ] Create Question entity in `server/src/db/entities/Question.entity.ts`:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `teacher_type_id` (INTEGER)
  - [ ] `question_type_id` (INTEGER, references question_types.key)
  - [ ] `content` (TEXT) - Hebrew question text
  - [ ] `allowed_digits` (VARCHAR) - Comma-separated allowed input
  - [ ] `is_standalone` (BOOLEAN)
  - [ ] `start_date` (DATE)
  - [ ] `end_date` (DATE)
- [ ] Create question.config.ts CRUD configuration
- [ ] Register in entities.module.ts

#### 8. QuestionType Entity
- [ ] Create QuestionType entity in `server/src/db/entities/QuestionType.entity.ts`:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `key` (INTEGER) - Type identifier (1-4)
  - [ ] `name` (VARCHAR) - Type name
- [ ] Create question-type.config.ts CRUD configuration
- [ ] Register in entities.module.ts

#### 9. Answer Entity
- [ ] Create Answer entity in `server/src/db/entities/Answer.entity.ts`:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `teacher_id` (FOREIGN KEY to teachers.id)
  - [ ] `question_id` (FOREIGN KEY to questions.id)
  - [ ] `report_id` (FOREIGN KEY to att_reports.id)
  - [ ] `answer` (INTEGER) - 0 or 1
  - [ ] `answer_date` (DATE)
- [ ] Create answer.config.ts CRUD configuration
- [ ] Register in entities.module.ts

#### 10. WorkingDate Entity
- [ ] Create WorkingDate entity in `server/src/db/entities/WorkingDate.entity.ts`:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `teacher_type_id` (INTEGER)
  - [ ] `working_date` (DATE)
- [ ] Create working-date.config.ts CRUD configuration
- [ ] Register in entities.module.ts

#### 11. SalaryReport Entity
- [ ] Create SalaryReport entity in `server/src/db/entities/SalaryReport.entity.ts`:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `ids` (TEXT) - Comma-separated att_report IDs
  - [ ] `date` (DATETIME)
  - [ ] `name` (VARCHAR) - Optional name
- [ ] Create salary-report.config.ts CRUD configuration
- [ ] Register in entities.module.ts

### Database Migration Generation

#### 12. Generate TypeORM Migrations
- [ ] Generate migration for all new entities:
  ```bash
  cd server && yarn typeorm:generate src/migrations/AddTeacherReportEntities
  ```
- [ ] Review generated migration file
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