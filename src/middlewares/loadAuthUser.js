export default function makeLoadAuthUser(userModel) {
  return async function loadAuthUser(req, res, next) {
    try {
      if (req.session.user_handle) {
        const user = await userModel.get(req.session.user_handle);
        res.locals.authUser = user;
      }
    } catch (e) {
      console.log(e);
    } finally {
      next();
    }
  };
}
