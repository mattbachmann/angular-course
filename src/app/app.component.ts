import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Inject, Injector, OnInit, signal} from '@angular/core';
import {Course} from './model/course';
import {Observable} from 'rxjs';
import {AppConfig, CONFIG_TOKEN} from './config';
import {COURSES} from '../db-data';
import {CoursesService} from './courses/courses.service';
import {createCustomElement} from '@angular/elements';
import {CourseTitleComponent} from './course-title/course-title.component';
import {CourseCardComponent} from './courses/course-card/course-card.component';
import {CourseImageComponent} from './courses/course-image/course-image.component';
import {NgForOf} from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CourseCardComponent,
    CourseImageComponent,
    NgForOf
  ],
  standalone: true
})
export class AppComponent implements OnInit {

  courses = signal(['Angular For Beginners', 'Reactive Angular Course']);

  coursesTotal = this.courses().length;

  counter = signal(0);

  course = signal({
    id: 1,
    title: 'Angular For Beginners',
  })

  constructor(
    private coursesService: CoursesService,
    @Inject(CONFIG_TOKEN) private config: AppConfig,
    private injector: Injector) {
  }

  ngOnInit() {

    const htmlElement = createCustomElement(CourseTitleComponent, {injector: this.injector});

    customElements.define('course-title', htmlElement);

  }

  onEditCourse() {

    this.courses[1].category = 'ADVANCED';

  }

  save(course: Course) {
    this.coursesService.saveCourse(course)
      .subscribe(
        () => console.log('Course Saved!')
      );
  }


  increment() {
    const readOnlySignal = this.counter.asReadonly();
    this.counter.update(val => val + 1);

    // Not the proper way - will not work with Change-Detection-On-Push:
    // this.course().title = 'Hello World';
    // this.courses().push('Angular Core Deep Dive');

    this.course.set({
      id: 1,
      title: 'Hello World',
    });

    this.courses.update(courses => [...courses, 'Angular Core Deep Dive']);
  }
}
