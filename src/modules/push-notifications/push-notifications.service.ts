import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);
  private expo = new Expo({
    useFcmV1: true,
  });

  /**
   * Envía notificaciones push a los tokens especificados
   * @param toTokens - Array de tokens de Expo a los que enviar la notificación
   * @param title - Título de la notificación
   * @param body - Cuerpo del mensaje
   * @param data - Datos adicionales opcionales
   * @returns Resultado del envío
   */
  async sendNotification(
    toTokens: string[],
    title: string,
    body: string,
    data?: Record<string, any>,
  ) {
    // Validar que todos los tokens sean válidos de Expo
    const areExpoTokens = toTokens.every((token) =>
      Expo.isExpoPushToken(token),
    );

    if (!areExpoTokens) {
      throw new BadRequestException('Invalid expo push tokens');
    }

    // Construir los mensajes
    const messages: ExpoPushMessage[] = toTokens.map((token) => ({
      to: token,
      sound: 'default',
      body,
      title,
      data: data || {},
    }));

    // Dividir en chunks para el envío
    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    // Enviar cada chunk
    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        this.logger.log(`Sent ${chunk.length} notifications successfully`);
      } catch (error) {
        this.logger.error('Error sending push notification chunk:', error);
        throw new InternalServerErrorException(
          'Error sending push notification chunks',
        );
      }
    }

    return {
      success: true,
      totalSent: toTokens.length,
      tickets,
    };
  }

  /**
   * Envía una notificación de cambio de estado de evento
   */
  async sendEventStatusNotification(
    toTokens: string[],
    eventoNombre: string,
    nuevoEstado: string,
  ) {
    const title = 'Estado de Evento Actualizado';
    const body = `El evento "${eventoNombre}" cambió a estado: ${nuevoEstado}`;

    return this.sendNotification(toTokens, title, body, {
      type: 'event-status-change',
      eventoNombre,
      estado: nuevoEstado,
    });
  }

  /**
   * Envía una notificación cuando se sube un archivo a un evento
   */
  async sendFileUploadedNotification(
    toTokens: string[],
    eventoNombre: string,
    eventoId: number,
  ) {
    const title = 'Archivo Subido';
    const body = `Se subió un archivo al evento "${eventoNombre}"`;

    return this.sendNotification(toTokens, title, body, {
      type: 'file-uploaded',
      eventoId,
      eventoNombre,
    });
  }
}
