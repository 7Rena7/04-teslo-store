import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const fileExtention = file.originalname.split('.').pop();
  const fileName = `${uuid()}.${fileExtention}`;

  callback(null, fileName);
};
