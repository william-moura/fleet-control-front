import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Se estiver vazio, a validação de "obrigatório" cuida disso
    }

   const dateReversed = value.split('/').reverse().join('-');
    const today = new Date();
    if (new Date(dateReversed) < today) {
      return { minDate: true };
    }

    // Verifica formato AAAA-MM-DD (padrão do <input type="date">)
    /*
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return { invalidDateFormat: true };
    }

    // Verifica se a data realmente existe no calendário (evita 31/02)
    const parts = value.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Meses no JS começam em 0
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return { invalidDate: true };
    }

    */

    return null;
  };
}


export function maxDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const dateReversed = value.split('/').reverse().join('-');
    const today = new Date();
    if (new Date(dateReversed) > today) {
      return { maxDate: true };
    }

    return null;
  };
}