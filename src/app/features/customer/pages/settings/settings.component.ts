import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

interface LanguageOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputSwitchModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  darkMode: boolean = false;
  emailNotifications: boolean = true;
  language: string = 'es';
  languages: LanguageOption[] = [
    { label: 'Español', value: 'es' },
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
  ];

  saveSettings() {
    console.log({
      darkMode: this.darkMode,
      emailNotifications: this.emailNotifications,
      language: this.language,
    });
  }
}
