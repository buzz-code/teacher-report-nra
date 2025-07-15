# Teacher Report NRA - Entity Migration Tasks

## Mission: Migrate entities from wolf-teacher-reports system to match system requirements

### Core Teacher Reports Entities to Implement

#### 1. Enhanced User Entity
- [ ] Extend existing User entity with teacher reports fields:
  - [ ] Add `phone_number` field for phone system integration
  - [ ] Add `active` boolean field (default false)
  - [ ] Ensure bcrypt password hashing is configured

#### 2. Enhanced Teacher Entity  
- [ ] Extend existing Teacher entity with wolf-teacher-reports fields:
  - [ ] Add `phone` field (VARCHAR)
  - [ ] Add `email` field (VARCHAR) 
  - [ ] Add `school` field (VARCHAR)
  - [ ] Add `teacher_type_id` field (INTEGER, references teacher_types.key)
  - [ ] Add `price` field (DECIMAL) for hourly wage
  - [ ] Add `training_teacher` field (VARCHAR)
  - [ ] Add `special_question` field (INTEGER, references questions.id)
  - [ ] Add `student_count` field (INTEGER)

#### 3. Enhanced Student Entity
- [ ] Extend existing Student entity:
  - [ ] Add `phone` field (VARCHAR)
  - [ ] Add `email` field (VARCHAR)
  - [ ] Ensure `tz` field is unique per user (already implemented)

#### 4. Teacher Types Entity
- [ ] Create TeacherType entity:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `key` (INTEGER) - Type identifier (1-7)
  - [ ] `name` (VARCHAR) - Hebrew name
  - [ ] Predefined types: Seminar Kita, Training Teacher, Manha Teacher, Responsible, PDS Teacher, Kindergarten, Special Education

#### 5. Attendance Reports Entity (Core reporting table)
- [ ] Create AttReport entity:
  - [ ] Basic fields: id, user_id, teacher_id, report_date, update_date, year, is_confirmed
  - [ ] Salary fields: salaryReport (links to salary_reports.id), salary_month, comment
  - [ ] Activity fields: how_many_students, how_many_methodic, four_last_digits_of_teacher_phone
  - [ ] Teaching fields: teached_student_tz (TEXT), how_many_yalkut_lessons, how_many_discussing_lessons
  - [ ] Assessment fields: how_many_students_help_teached, how_many_lessons_absence, how_many_watched_lessons
  - [ ] Boolean flags: was_discussing, was_kamal, was_students_good, was_students_enter_on_time, was_students_exit_on_time
  - [ ] Special fields: activity_type (references att_types.id), teacher_to_report_for, was_collective_watch
  - [ ] Tariff fields: is_taarif_hulia, is_taarif_hulia2, is_taarif_hulia3

#### 6. Attendance Types Entity
- [ ] Create AttType entity:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `name` (VARCHAR)

#### 7. Prices Configuration Entity
- [ ] Create Price entity:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `key` (INTEGER) - Price identifier
  - [ ] `price` (DECIMAL)
  - [ ] Predefined keys for different price types (11-15, 24-28, 40-42, 51-60)

#### 8. Questions System Entity
- [ ] Create Question entity:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `teacher_type_id` (INTEGER)
  - [ ] `question_type_id` (INTEGER, references question_types.key)
  - [ ] `content` (TEXT) - Hebrew question text
  - [ ] `allowed_digits` (VARCHAR) - Comma-separated allowed input
  - [ ] `is_standalone` (BOOLEAN)
  - [ ] `start_date` (DATE)
  - [ ] `end_date` (DATE)

#### 9. Question Types Entity
- [ ] Create QuestionType entity:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `key` (INTEGER) - Type identifier (1-4)
  - [ ] Types: Always ask if no answer, Ask if no "yes" answer, Ask if no "no" answer, Special question

#### 10. Answers Entity
- [ ] Create Answer entity:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `teacher_id` (FOREIGN KEY to teachers.id)
  - [ ] `question_id` (FOREIGN KEY to questions.id)
  - [ ] `report_id` (FOREIGN KEY to att_reports.id)
  - [ ] `answer` (INTEGER) - 0 or 1
  - [ ] `answer_date` (DATE)

#### 11. Working Dates Entity
- [ ] Create WorkingDate entity:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `teacher_type_id` (INTEGER)
  - [ ] `working_date` (DATE)

#### 12. Salary Reports Entity
- [ ] Create SalaryReport entity:
  - [ ] `id` (PRIMARY KEY, AUTO_INCREMENT)
  - [ ] `user_id` (FOREIGN KEY to users.id)
  - [ ] `ids` (TEXT) - Comma-separated att_report IDs
  - [ ] `date` (DATETIME)
  - [ ] `name` (VARCHAR) - Optional name

### Backend API Implementation

#### 13. CRUD Controllers for New Entities
- [ ] Create TeacherTypeController with CRUD operations
- [ ] Create AttReportController with CRUD operations
- [ ] Create AttTypeController with CRUD operations  
- [ ] Create PriceController with CRUD operations
- [ ] Create QuestionController with CRUD operations
- [ ] Create QuestionTypeController with CRUD operations
- [ ] Create AnswerController with CRUD operations
- [ ] Create WorkingDateController with CRUD operations
- [ ] Create SalaryReportController with CRUD operations

#### 14. Specialized Report Endpoints
- [ ] Implement getSeminarKitaReport endpoint
- [ ] Implement getTrainingReport endpoint (if needed)
- [ ] Implement getManhaReport endpoint
- [ ] Implement getResponsibleReport endpoint (if needed)
- [ ] Implement getPdsReport endpoint
- [ ] Implement getSpecialEducationReport endpoint
- [ ] Implement getKindergartenReport endpoint
- [ ] Implement getTotalPayMonthlyReport endpoint

#### 15. Report Management Endpoints
- [ ] Implement updateSalaryMonth endpoint
- [ ] Implement updateSalaryComment endpoint  
- [ ] Implement createSalaryReport endpoint
- [ ] Implement export-pdf endpoint for reports

#### 16. Enhanced Yemot Integration
- [ ] Update YemotHandler to support teacher reports workflow
- [ ] Implement teacher identification by phone number
- [ ] Add support for all teacher types in phone system
- [ ] Implement dynamic question system for phone calls
- [ ] Add Hebrew date confirmation functionality
- [ ] Implement report validation during phone input
- [ ] Add support for reviewing previous unconfirmed reports

### Frontend React Admin Implementation

#### 17. Entity Components for New Tables
- [ ] Create teacher-type.jsx component
- [ ] Create att-report.jsx component  
- [ ] Create att-type.jsx component
- [ ] Create price.jsx component
- [ ] Create question.jsx component
- [ ] Create question-type.jsx component
- [ ] Create answer.jsx component
- [ ] Create working-date.jsx component
- [ ] Create salary-report.jsx component

#### 18. Specialized Report Components
- [ ] Create seminar-kita-reports.jsx component
- [ ] Create manha-reports.jsx component
- [ ] Create pds-reports.jsx component
- [ ] Create special-education-reports.jsx component
- [ ] Create kindergarten-reports.jsx component
- [ ] Create monthly-reports.jsx component

#### 19. App.jsx Updates
- [ ] Add new resources to React Admin with appropriate icons
- [ ] Update navigation structure for teacher reports
- [ ] Add Reports dropdown menu with specialized report views
- [ ] Add Tables dropdown menu with configuration entities

#### 20. Hebrew Language Support
- [ ] Update domainTranslations.js with Hebrew translations for all new entities
- [ ] Add Hebrew calendar support using jewish-date library
- [ ] Ensure RTL support for all new components
- [ ] Add Hebrew year system (academic year starting July 1st)

### Salary Calculation System

#### 21. Business Logic Implementation
- [ ] Implement salary calculation for Type 1 (Seminar Kita) teachers
- [ ] Implement salary calculation for Type 3 (Manha) teachers  
- [ ] Implement salary calculation for Type 5 (PDS) teachers
- [ ] Implement salary calculation for Type 6 (Kindergarten) teachers
- [ ] Implement salary calculation for Type 7 (Special Education) teachers
- [ ] Add extra pay calculation from special questions
- [ ] Implement salary month assignment functionality

#### 22. Validation Rules
- [ ] Add absence limit validation (max 10 per month)
- [ ] Add lesson count validation for Seminar Kita
- [ ] Add working day validation
- [ ] Add report confirmation requirements
- [ ] Add salary report lock validation

### Database Migration and Setup

#### 23. Database Schema Migration
- [ ] Create migration for new teacher reports entities
- [ ] Add indexes for performance optimization  
- [ ] Create database views for salary calculations
- [ ] Set up foreign key constraints
- [ ] Add unique constraints where needed

#### 24. Initial Data Seeding
- [ ] Seed teacher_types with predefined types (1-7)
- [ ] Seed question_types with standard types (1-4)
- [ ] Seed default price configurations
- [ ] Create sample working dates
- [ ] Add default system messages for phone integration

### Testing and Documentation

#### 25. Testing Implementation
- [ ] Create unit tests for salary calculation logic
- [ ] Add integration tests for phone system workflow
- [ ] Test Hebrew date handling and calendar functionality
- [ ] Validate report generation and PDF export
- [ ] Test multi-language support

#### 26. Documentation Updates
- [ ] Update project-index.md with teacher reports functionality
- [ ] Document API endpoints in Swagger
- [ ] Create user guide for phone system integration
- [ ] Document salary calculation formulas
- [ ] Add Hebrew year system documentation