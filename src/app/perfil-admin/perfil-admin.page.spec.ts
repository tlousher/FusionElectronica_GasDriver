import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PerfilAdminPage } from './perfil-admin.page';

describe('PerfilAdminPage', () => {
  let component: PerfilAdminPage;
  let fixture: ComponentFixture<PerfilAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
