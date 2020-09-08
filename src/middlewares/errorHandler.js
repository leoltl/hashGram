import { HTTPError, DOAError } from '../lib/errors';

export default function errorHandler(error, req, res, next) {
  console.log(error);
  if (error instanceof DOAError) {
    res.status(400).json({ message: error.message });
    return;
  }
  if (error instanceof HTTPError) {
    res.status(error.status).json({ message: error.message });
    return;
  }
  res.status(500).send('Internal Server Error');
}
