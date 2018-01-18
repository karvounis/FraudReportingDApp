import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBountyComponent } from './create-bounty.component';

describe('CreateBountyComponent', () => {
  let component: CreateBountyComponent;
  let fixture: ComponentFixture<CreateBountyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBountyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
