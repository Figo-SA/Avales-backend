import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeportistasService {
  constructor(private readonly httpService: HttpService) {}

  async getDeportistaFromExternalApi(id: number) {
    try {
      // Ejemplo: llamar a una API externa
      const response = await firstValueFrom(
        this.httpService.get(`https://api.ejemplo.com/deportistas/${id}`),
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          'Deportista no encontrado en la API externa',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Error al consultar API externa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
