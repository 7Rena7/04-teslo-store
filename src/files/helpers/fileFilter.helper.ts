export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    return callback(null, true);
  }

  callback(null, false);
};
