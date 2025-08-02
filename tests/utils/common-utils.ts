import mongoose from 'mongoose';

export class CommonUtils {
  static async getNonExistingObjectId(
    model: mongoose.Model<any>,
  ): Promise<string> {
    let objectId: string;
    do {
      objectId = new mongoose.Types.ObjectId().toHexString();
    } while (await model.exists({ _id: objectId }));
    return objectId;
  }
}
