import { ObjectId } from "mongodb";
// testing testing
export default interface Shoutout {
  _id?: ObjectId;
  to: string;
  from: string;
  text: string;
  upvotes: number;
  profilePic: string;
}
