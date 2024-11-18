import Token from "#models/token";

class PushNotificationService {

  async registerToken(token: string) {
    console.log("register token", token)
    const exist = await Token.query().where('token', token)
    if (!exist) {
      await Token.create({
        token
      })
    }
    return true;
  }

  
}

export default new PushNotificationService()