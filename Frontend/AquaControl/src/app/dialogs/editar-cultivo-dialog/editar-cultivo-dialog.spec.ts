import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCultivoDialog } from './editar-cultivo-dialog';

describe('EditarCultivoDialog', () => {
  let component: EditarCultivoDialog;
  let fixture: ComponentFixture<EditarCultivoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCultivoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCultivoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
