import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialErrorComponent } from './social-error.component';

describe('SocialErrorComponent', () => {
  let component: SocialErrorComponent;
  let fixture: ComponentFixture<SocialErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
