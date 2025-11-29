import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { IHeader } from '@shared/utils/exporter/types';
import { getHeaderFormatters, getHeaderNames } from '@shared/utils/exporter/exporter.util';
import { DataToExcelReportGenerator } from '@shared/utils/report/data-to-excel.generator';
import { MailSendService } from '@shared/utils/mail/mail-send.service';

/**
 * Format a string with named parameters.
 * Supports {paramName} syntax.
 * @example formatNamedString("Hello {name}!", { name: "John" }) => "Hello John!"
 */
export function formatNamedString(str: string, params: Record<string, string | number>): string {
  return str.replace(/{(\w+)}/g, (_, key) => String(params[key] ?? ''));
}

export interface TeacherMailReportParams {
  teacherName: string;
  teacherEmail: string;
  mailSubject: string;
  mailBody: string;
  headers: IHeader[];
  data: any[];
  fromAddress: Address;
  replyToAddress?: string;
}

/**
 * Generate an Excel file and send it via email to a teacher.
 * Mail subject and body support {name} placeholder for teacher name.
 */
export async function sendExcelReportToTeacher(
  mailSendService: MailSendService,
  params: TeacherMailReportParams,
): Promise<void> {
  const { teacherName, teacherEmail, mailSubject, mailBody, headers, data, fromAddress, replyToAddress } = params;

  // Generate Excel file
  const headerRow = getHeaderNames(headers);
  const formatters = getHeaderFormatters(headers);
  const formattedData = data.map((row) => formatters.map((func) => func(row)));

  const generator = new DataToExcelReportGenerator(() => `דיווחי נוכחות - ${teacherName}`);
  const excelBuffer = await generator.getFileBuffer({
    headerRow,
    formattedData,
    sheetName: 'דיווחי נוכחות',
  });

  // Format mail subject and body with named parameters
  const textParams = { name: teacherName };
  const formattedSubject = formatNamedString(mailSubject, textParams);
  const formattedBody = formatNamedString(mailBody, textParams);

  // Send email
  await mailSendService.sendMail({
    to: teacherEmail,
    from: fromAddress,
    subject: formattedSubject,
    html: formattedBody,
    attachments: [
      {
        filename: `דיווחי נוכחות - ${teacherName}.xlsx`,
        content: excelBuffer,
      },
    ],
    replyTo: replyToAddress ? { address: replyToAddress, name: fromAddress.name } : undefined,
  });
}
