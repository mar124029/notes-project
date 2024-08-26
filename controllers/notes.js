const notesRouter = require("express").Router();
const Note = require("../models/note");

// Find All
notesRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

// Find By Id
notesRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        return res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

notesRouter.put("/:id", (req, res, next) => {
  const body = req.body;

  const newNoteInfo = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, newNoteInfo, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => {
      next(error);
    });
});

notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Note not found" });
      }
    })
    .catch((error) => next(error));
});

notesRouter.post("/", (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.status(201).json(savedNote);
    })
    .catch((err) => next(err));
});

module.exports = notesRouter;
