import installAuthControllers from './Auth/auth.controller';
import installUserControllers from './User/user.controller';
import { installPostControllers, installFeedController } from './Post/post.controller';
import installStorageRoute from './Storage/storage.controller';

export {
  installAuthControllers,
  installUserControllers,
  installPostControllers,
  installFeedController,
  installStorageRoute,
};
