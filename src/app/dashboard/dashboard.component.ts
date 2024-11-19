import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teacherName: string = '';
  students: { name: string, marks: number[] }[] = [];
  isAddStudentVisible = false;
  studentName: string = '';
  subjectMarks: number[] = [0, 0, 0];
  editMode: boolean = false;
  currentStudentIndex: number = -1;  // To track which student is being edited
  showSubmitBtn: boolean = false;
  subject_average: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.teacherName = params['teacher'] || 'Teacher';
    });
  }

  toggleAddStudent() {
    this.isAddStudentVisible = !this.isAddStudentVisible;
  }

  addStudent() {
    if (this.studentName && this.subjectMarks.every(mark => mark > 0)) {
      if (this.editMode) {
        // Edit existing student
        this.students[this.currentStudentIndex] = {
          name: this.studentName,
          marks: [...this.subjectMarks]
        };
        this.editMode = false;
      } else {
        // Add new student
        this.students.push({
          name: this.studentName,
          marks: [...this.subjectMarks]
        });
      }
      
      // Reset form
      this.studentName = '';
      this.subjectMarks = [0, 0, 0];
    }
    if (this.students.length >= 2){
        this.showSubmitBtn = true;
    } else {
        this.showSubmitBtn = false;
    }
  }

  editStudent(index: number) {
    // Set up the form to edit the selected student
    this.editMode = true;
    this.currentStudentIndex = index;
    const student = this.students[index];
    this.studentName = student.name;
    this.subjectMarks = [...student.marks];  // Clone the marks array to avoid reference issues
  }

  deleteStudent(index: number) {
    // Remove student from the list
    this.students.splice(index, 1);
  }

  calculateTotalMarks() {
    if (this.students.length < 2) return;

    // Find subject with the lowest class average
    let subjectAverages = [0, 0, 0];
    this.students.forEach(student => {
      student.marks.forEach((mark, index) => {
        subjectAverages[index] += mark;
      });
    });

    subjectAverages = subjectAverages.map(avg => avg / this.students.length);
    this.subject_average = subjectAverages;

    // Ignore the subject with the lowest class average for each student
    const results = this.students.map(student => {
      const totalMarks = student.marks
        .map((mark, index) => (subjectAverages[index] === Math.min(...subjectAverages) ? 0 : mark))
        .reduce((sum, mark) => sum + mark, 0);
      return { name: student.name, totalMarks, marks: student.marks.filter((_, index) => subjectAverages[index] !== Math.min(...subjectAverages)) };
    });

    console.log(results); // Final result
  }
}
