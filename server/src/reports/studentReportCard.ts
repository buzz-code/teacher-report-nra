// import { EjsToPdfReportGenerator } from '@shared/utils/report/ejs-to-pdf.generator';
// import { getReportData, getReportName } from './studentReportCardReact';

// const reportTemplate = `
// <!DOCTYPE html>
// <html>
//     <head>
//         <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">

//         <% /* %>
//         <%- include('../../common-modules/templates/custom-font', { font }); %>
//         <% */ %>

//         <style>
//             body {
//                 direction: rtl;
//                 font-family: CustomFont, 'Roboto', sans-serif;
//                 font-size: 12px;
//                 min-height: 21cm;
//             }
//             .container {
//                 width: calc(100% - 100px);
//                 max-width: 1200px;
//                 margin: auto;
//                 text-align: center;
//                 padding-top: 2px;
//             }
//             .header-wrapper {
//                 display: -webkit-flex;
//                 display: -ms-flexbox;
//                 display: flex;
//                 -webkit-justify-content: space-around;
//                 -ms-justify-content: space-around;
//                 justify-content: space-around;
//                 padding-bottom: 4px;
//                 padding-inline: 20px;
//             }
//             h1, h2, h3, h4 {
//                 margin: 0;
//             }
//             .value {
//                 font-weight: normal;
//             }
//             .report-data-wrapper {
//                 page-break-inside: avoid;
//                 padding-top: 2rem;
//             }
//             table {
//                 border-collapse: collapse;
//                 width: 100%;
//                 margin-top: .5em;
//             }
//             table, th, td {
//                 border: 1px solid black;
//                 padding: 4px;
//             }
//             th {
//                 /* background-color: #727fc9; */
//                 border: 3px solid black;
//                 /* font-size: 1.25rem; */
//                 /* color: white; */
//             }
//             .full-cell {
//                 min-width: 75px;
//                 max-width: 100px;
//             }
//             .empty_cell {
//                 min-width: 60px;
//             }
//             .end-image {
//                 position: static;
//                 bottom: 0;
//                 right: 0;
//                 width: 100%;
//                 padding-top: 1rem;
//             }
//             small.notice {
//                 position: absolute;
//                 top: 50%;
//                 right: 0;
//                 z-index: 99999;
//                 -webkit-transform: rotate(90deg);
//                 transform: rotate(90deg);
//                 transform-origin: right top;
//             }
//         </style>
//     </head>
//     <body>
//         <% /* %>
//         <%- include('header', { img }); %>
//         <% */ %>

//         <% var reportDataArr = [{reports, id: studentBaseKlass.id}] %>
//         <% if (reportParams.groupByKlass) { %>
//             <% var klasses = {} %>
//             <% reports.forEach(item => {
//                 klasses[item.klass.name] = klasses[item.klass.name] || { name: item.klass.name, id: item.klass.id, order: item.isBaseKlass ? -1 : 1, reports: [] }
//                 klasses[item.klass.name].reports.push(item)
//             }) %>
//             <% reportDataArr = Object.values(klasses).sort((a, b) => a.order - b.order) %>
//         <% } %>

//         <div class="container">
//             <div class="header-wrapper">
//                 <% if (student && student.comment) { %>
//                     <h1>התמחות:
//                         <span class="value"><%= student.comment %></span>
//                     </h1>
//                 <% } %>
//             </div>
//             <div class="header-wrapper">
//                 <% if (student) { %>
//                     <h4>שם התלמידה:
//                         <span class="value"><%= student.name %></span>
//                     </h4>
//                     <h4>מספר תז:
//                         <span class="value"><%= student.tz %></span>
//                     </h4>
//                 <% } %>
//                 <% if (studentBaseKlass && !reportParams.groupByKlass) { %>
//                     <h4>
//                         <span class="value"><%= studentBaseKlass.klassName %></span>
//                     </h4>
//                 <% } %>
//             </div>

//             <% reportDataArr.forEach(reportData => { %>
//                 <div class="report-data-wrapper">
//                     <div class="header-wrapper">
//                         <% if (reportParams.groupByKlass) { %>
//                             <h4>
//                                 <span class="value"><%= reportData.name %></span>
//                             </h4>
//                         <% } %>
//                     </div>

//                     <% var reports = reportData.reports %>
//                     <table>
//                     <% if (reports.length > 0) { %>
//                         <tr>
//                             <th>מקצוע</th>
//                             <th>שם המורה</th>
//                             <% if (reportParams.grades) { %>
//                                 <th>ציון</th>
//                             <% } %>
//                             <th>אחוז נוכחות</th>
//                         </tr>
//                         <% reports.forEach((report, index) => { %>
//                             <% if (
//                                 (!reportParams.forceGrades || (report.grade != undefined && report.grade != null)) &&
//                                 (!reportParams.forceAtt || (report.lessonsCount))
//                             ) { %>
//                                 <tr>
//                                     <td class="full-cell"><%= report.lesson && report.lesson.name %></td>
//                                     <td class="full-cell"><%= report.teacher && report.teacher.name %></td>

//                                     <% var att_percents = Math.round((((report.lessonsCount ?? 1) - (report.absCount ?? 0)) / (report.lessonsCount ?? 1)) * 100) %>

//                                     <% if (report.lessonsCount && report.lessonsCount * 2 == report.absCount) { %>
//                                         <td class="full-cell"><%= report.grade %></td>
//                                         <td class="full-cell">&nbsp;</td>
//                                     <% } else { %>
//                                         <% if (reportParams.grades) { %>
//                                             <td class="full-cell">
//                                             <% if (report.grade != undefined && report.grade != null) { %>
//                                                 <% var grade_effect = att_grade_effect?.find(item => item.percents <= att_percents || item.count >= report.absCount)?.effect ?? 0 %>
//                                                 <% var isOriginalGrade = report.grade > 100 || report.grade == 0 %>
//                                                 <% var affected_grade = isOriginalGrade ? report.grade : Math.min(100, report.grade + grade_effect) %>
//                                                 <% var matching_grade_name = grade_names?.find(item => item.key <= affected_grade)?.name %>

//                                                 <% if (matching_grade_name) { %>
//                                                     <%= matching_grade_name %>
//                                                 <% } else { %>
//                                                     <%= affected_grade %>%
//                                                 <% } %>
//                                             <% } else { %>
//                                                 &nbsp;
//                                             <% } %>
//                                             </td>
//                                         <% } %>
//                                         <td class="full-cell"><%= att_percents %>%</td>
//                                     <% } %>
//                                 </tr>
//                             <% } %>
//                         <% }) %>
//                         <% if (!reportParams.hideAbsTotal) { %>
//                             <tr>
//                                 <th>אחוז נוכחות כללי</th>
//                                 <th>&nbsp;</th>
//                                 <% if (reportParams.grades) { %>
//                                     <th>&nbsp;</th>
//                                 <% } %>

//                                 <% var reportsNoSpecial = reports.filter(item => item.lessonsCount * 2 != item.absCount) %>
//                                 <% var total_lesson_count = reportsNoSpecial.reduce((a, b) => a + b.lessonsCount, 0) %>
//                                 <% var total_abs_count = reportsNoSpecial.reduce((a, b) => a + b.absCount, 0) %>
//                                 <% var total_att_count = total_lesson_count - total_abs_count %>

//                                 <th>
//                                     <%=
//                                         Math.round(((total_att_count) / total_lesson_count) * 100)
//                                     %>%
//                                 </th>
//                             </tr>
//                             <tr>
//                                 <th>נוכחות בקיזוז חיסורים מאושרים</th>
//                                 <th>&nbsp;</th>
//                                 <% if (reportParams.grades) { %>
//                                     <th>&nbsp;</th>
//                                 <% } %>
//                                 <th>
//                                     <% var approved_abs_value = approved_abs_count?.[reportData.id] %>
//                                     <% if (!reportParams.groupByKlass) { %>
//                                         <% approved_abs_value = Object.values(approved_abs_count)[0] %>
//                                     <% } %>
//                                     <%=
//                                         Math.round(
//                                             (
//                                                 (
//                                                     total_att_count + (approved_abs_value || 0)
//                                                 ) / total_lesson_count
//                                             ) * 100
//                                         )
//                                     %>%
//                                 </th>
//                             </tr>
//                         <% } %>
//                     <% } %>
//                     </table>
//                 </div>
//             <% }) %>

//             <% if (reportParams.personalNote) { %>
//                 <h4>
//                     <%= reportParams.personalNote %>
//                 </h4>
//             <% } %>
//         </div>
//         <small class="notice">הופק באמצעות תוכנת יומנט</small>
//         <div class="end-image">
//           <% /* %>
//           <%- include('image', { img: footerImage }); %>
//           <% */ %>
//         </div>
//     </body>
// </html>
// `;

// const reportOptions: ejs.Options = {
//     compileDebug: true,
// };

// export default new EjsToPdfReportGenerator(getReportName, getReportData, reportTemplate, reportOptions);
