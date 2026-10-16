import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BOOKS_API_URL } from './infrastructure/config/api.config';
import { App } from './app';

describe('App', () => {
  it('debe renderizar la página de libros y consultar el catálogo', () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-books')).not.toBeNull();
    TestBed.inject(HttpTestingController).expectOne(BOOKS_API_URL).flush([]);
  });
});
