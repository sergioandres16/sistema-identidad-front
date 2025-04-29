import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return 'hace unos segundos';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }

    const years = Math.floor(months / 12);
    return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }
}
