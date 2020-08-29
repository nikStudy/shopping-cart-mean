import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendActivationLinkComponent } from './resend-activation-link.component';

describe('ResendActivationLinkComponent', () => {
  let component: ResendActivationLinkComponent;
  let fixture: ComponentFixture<ResendActivationLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendActivationLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendActivationLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
