import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private supabase: SupabaseClient;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    this.bucketName =
      this.configService.get<string>('SUPABASE_BUCKET') || 'avales';

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error(
        'Supabase credentials not found in environment variables',
      );
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized');
  }

  /**
   * Sube un archivo a Supabase Storage
   * @param file - Archivo a subir (Express.Multer.File)
   * @param folder - Carpeta donde se guardará el archivo
   * @returns URL pública del archivo subido
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'eventos',
  ): Promise<string> {
    try {
      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const filePath = `${folder}/${fileName}`;

      // Subir archivo a Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        this.logger.error(`Error uploading file: ${error.message}`);
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      // Obtener URL pública del archivo
      const { data: publicUrlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      this.logger.log(`File uploaded successfully: ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    } catch (error) {
      this.logger.error(`Upload error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Elimina un archivo de Supabase Storage
   * @param fileUrl - URL del archivo a eliminar
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extraer el path del archivo de la URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split(`${this.bucketName}/`);
      if (pathParts.length < 2) {
        throw new Error('Invalid file URL');
      }
      const filePath = pathParts[1];

      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        this.logger.error(`Error deleting file: ${error.message}`);
        throw new Error(`Failed to delete file: ${error.message}`);
      }

      this.logger.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      this.logger.error(`Delete error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reemplaza un archivo existente (elimina el anterior y sube el nuevo)
   * @param oldFileUrl - URL del archivo anterior
   * @param newFile - Nuevo archivo a subir
   * @param folder - Carpeta donde se guardará el archivo
   * @returns URL pública del nuevo archivo
   */
  async replaceFile(
    oldFileUrl: string | null,
    newFile: Express.Multer.File,
    folder: string = 'eventos',
  ): Promise<string> {
    // Si hay archivo anterior, eliminarlo
    if (oldFileUrl) {
      try {
        await this.deleteFile(oldFileUrl);
      } catch (error) {
        this.logger.warn(`Could not delete old file: ${error.message}`);
      }
    }

    // Subir el nuevo archivo
    return this.uploadFile(newFile, folder);
  }
}
