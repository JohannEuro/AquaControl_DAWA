import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarParametroDialog } from './editar-parametro-dialog';

describe('EditarParametroDialog', () => {
  let component: EditarParametroDialog;
  let fixture: ComponentFixture<EditarParametroDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarParametroDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarParametroDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
