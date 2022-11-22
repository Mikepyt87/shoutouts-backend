import { ObjectId } from "mongodb";

export default interface Shoutout {
  _id?: ObjectId;
  to: string;
  from: string;
  text: string;
  upvotes: number;
  profilePic: string;
}
