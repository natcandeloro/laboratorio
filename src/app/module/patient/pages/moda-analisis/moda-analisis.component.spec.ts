import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaAnalisisComponent } from './moda-analisis.component';

describe('ModaAnalisisComponent', () => {
  let component: ModaAnalisisComponent;
  let fixture: ComponentFixture<ModaAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaAnalisisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModaAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
