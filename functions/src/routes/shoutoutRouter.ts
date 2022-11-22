import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Shoutout from "../models/Shoutout";

const shoutoutRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

shoutoutRouter.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const cursor = client.db().collection<Shoutout>("shoutouts").find();
    const results = await cursor.toArray();
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});
// get all shoutouts
shoutoutRouter.get("/:name", async (req, res) => {
  const name: string = req.params.name;
  try {
    const client = await getClient();
    const cursor = client
      .db()
      .collection<Shoutout>("shoutouts")
      .find({ $or: [{ to: name }, { from: name }] });
    const results = await cursor.toArray();
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

shoutoutRouter.post("/", async (req, res) => {
  const newShoutout: Shoutout = req.body;
  try {
    const client = await getClient();
    await client.db().collection<Shoutout>("shoutouts").insertOne(newShoutout);
    res.status(201).json(newShoutout);
  } catch (err) {
    errorResponse(err, res);
  }
});

shoutoutRouter.put("/:id", async (req, res) => {
  // what to update
  const id: string = req.params.id;
  // how to update
  const updatedShoutout: Shoutout = req.body;
  // delete id (v2) - so that we dont get 2 ids
  delete updatedShoutout._id;
  try {
    const client = await getClient();
    // v1: (updateOne)
    // const result = await client
    //   .db()
    //   .collection<Shoutout>("shoutouts")
    //   .updateOne({ _id: new ObjectId(id) }, { $inc: { upvotes: 1 } });
    // ------------------------
    // v2: preferred (replaceOne)
    const result = await client
      .db()
      .collection<Shoutout>("shoutouts")
      .replaceOne({ _id: new ObjectId(id) }, updatedShoutout);
    if (result.modifiedCount) {
      // something was modified
      // updatedShoutout.upvotes++; (used for version 1 - with updateOne)
      // only for v2 - add back in _id:
      updatedShoutout._id = new ObjectId(id);
      res.status(200).json(updatedShoutout);
    } else {
      // not modified (not found)
      res.status(404).json({ message: "Shoutout not found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

shoutoutRouter.delete("/:id", async (req, res) => {
  const idToDelete: string = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Shoutout>("shoutouts")
      .deleteOne({ _id: new ObjectId(idToDelete) });
    if (result.deletedCount > 0) {
      // something was deleted
      res.sendStatus(204);
    } else {
      // didn't delete anything (not found)
      res.status(404).json({ message: "Shoutout not found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default shoutoutRouter;
