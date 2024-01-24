import {Component, computed, effect, EffectRef, Inject, Injector, OnInit, signal} from '@angular/core';
import {Course} from './model/course';
import {AppConfig, CONFIG_TOKEN} from './config';
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

  multiplier = 1;

  // Cannot update - derived signals are readonly
  derivedCounter = computed(() => {
    // if (this.multiplier >= 10) {
    //   return this.counter() * 10; // will never be reached - no dependency created initially
    // } else {
    //   return 0;
    // }
    const counter = this.counter(); // dependency is established initially
    return this.multiplier >= 10 ? counter * 10 : 0;
  });

  course = signal({
    id: 1,
    title: 'Angular For Beginners',
  })

  effectRef: EffectRef;

  constructor(
    private coursesService: CoursesService,
    @Inject(CONFIG_TOKEN) private config: AppConfig,
    private injector: Injector) {

    // effect is normally cleaned up automatically in onDestroy, but could also be done manually with .destroy()
    this.effectRef = effect((onCleanup) => {
      const counterValue = this.counter();
      const derivedCounterValue = this.derivedCounter();
      console.log(`counter: ${counterValue}`);

      onCleanup(() => {
        console.log(`Cleanup occured!`);
      });
    }, {
      manualCleanup: true,
    });

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

  incrementMultiplier() {
    this.multiplier++;
  }

  onCleanUp() {
    this.effectRef.destroy();
  }
}
