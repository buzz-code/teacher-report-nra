import studentConfig from '../student.config';
import { Student } from 'src/db/entities/Student.entity';

describe('StudentConfig', () => {
  it('should use Student entity', () => {
    expect(studentConfig.entity).toBe(Student);
  });

  it('should return correct export headers', () => {
    const headers = studentConfig.exporter.getExportHeaders([]);
    expect(headers).toEqual([
      { value: 'tz', label: 'ת.ז.' },
      { value: 'name', label: 'שם מלא' },
    ]);
  });

  it('should have exporter defined', () => {
    expect(studentConfig.exporter).toBeDefined();
    expect(studentConfig.exporter.getExportHeaders).toBeDefined();
    expect(typeof studentConfig.exporter.getExportHeaders).toBe('function');
  });
});
