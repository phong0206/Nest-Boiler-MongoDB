import { Injectable } from '@nestjs/common';
import { Storage } from '../nest-storage/storage';
import { getPathStorage } from '../nest-storage/helpers/extensions';
import { IImageUploadService } from '@repository/imageService.interface';
import { ImageUpload } from 'src/infrastructure/models/image.model';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class DatabaseImageUploadRepository extends IImageUploadService {
  notFoundMessage = 'Image not found';

  constructor(
    @InjectModel(ImageUpload.name)
    private readonly imageEntityRepository: Model<ImageUpload>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(imageEntityRepository);
  }

  async uploadFile(file: Express.Multer.File) {
    const imagePath = `${getPathStorage()}images/${file.filename}`;
    await Storage.disk().put(imagePath, file.buffer);
    const dataUpload = {
      file_name: file.filename,
      path: imagePath,
    };
    return this.imageEntityRepository.create(dataUpload);
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const filesUploaded = [];
      for (const file of files) {
        const filePath = `${getPathStorage()}images/${file.originalname}`;
        await Storage.disk().put(filePath, file.buffer);
        const image = await this.imageEntityRepository.create(
          [
            {
              file_name: file.filename,
              path: filePath,
            },
          ],
          { session },
        );
        filesUploaded.push(image[0]); // `create` returns an array, so we access the first element
      }

      // Commit the transaction if all files are saved successfully
      await session.commitTransaction();
      return filesUploaded;
    } catch (err) {
      // Rollback the transaction in case of error
      await session.abortTransaction();
      throw err;
    } finally {
      // End the session
      session.endSession();
    }
  }
}
