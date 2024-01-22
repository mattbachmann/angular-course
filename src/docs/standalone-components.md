Automatic migration:
ng generate @angular/core:standalone

> Convert all components, directives, and pipes in the current project to standalone Angular elements.

Manual migration  :
- Add `standalone: true,` to each decorator of the component, directive, or pipe.
- then delete them from exports and declarations in the module file.
- If needed add import: [] to the standalone component decorator like so:
```typescript
  imports: [
    NgIf
  ],
```
  - Could also import CommonModule, FormsModule, etc. but in general better to only import components that are needed.
- In `main.ts` Bootstrap the application with AppComponent instead of AppModule.
- Add providers array with functions like so:
```typescript
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ],
})
  .catch(err => console.log(err));
```

