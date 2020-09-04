import { HTTPError } from '../lib/errors';

export default function errorHandler(error, req, res, next) {
  console.log('handler', error, error instanceof HTTPError);
  if (error instanceof HTTPError) {
    res.status(error.status).json({ message: error.message });
    return;
  }
  res.status(500).send('Internal Server Error');
}
