const Todo = require("./models/Todo");
const express = require("express");
const router = express.Router();

// TYPE: GET ROUTE
// DESC: GET ALL TODOS
router.get("/todos", async (req, res, next) => {
  const todos = await Todo.find().sort({ date: -1 });

  res.status(200).json({
    message: "all todos fetched",
    todos: todos
  });
});

//TYPE: GET ROUTE
// DESC: GET A SINGLE TODO
router.get("/todos/:id", async (req, res, next) => {
  const todo = await Todo.findOne({ _id: req.params.id });

  res.status(200).json({
    todo: todo
  });
});

//TYPE: POST ROUTE
//DESC: CREATE A TODO
router.post("/todos", (req, res, next) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
    editing: false,
    date: Date.now()
  });

  todo.save();

  res.status(200).json({
    message: "todo added successfully",
    todo: todo
  });
});

//TYPE: POST DELETE
//DESC: DELETE A TODO

router.delete("/todos/:id", async (req, res, next) => {
  const todo = await Todo.deleteOne({ _id: req.params.id });

  res.status(201).json({
    message: "post successfully deleted",
    todo: todo
  });
});

//TYPE: POST ROUTE
//DESC: CHECK ALL TODOS AS COMPLETED
router.post("/todos/allCompleted", (req, res, next) => {
  Todo.updateMany({}, { $set: { completed: req.body.checked } })
    .then(result => {
      res.json({ allChecked: true });
    })
    .catch(error => {
      console.log(error);
    });
});

//TYPE: POST ROUTE
//DESC: CHECK A SINGLE TODO AS COMPLETED
router.post("/todo/:id/completed", (req, res, next) => {
  Todo.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { completed: req.body.checked } }
  )
    .then(data => {
      //console.log("everything was ok")
    })
    .catch(error => {
      console.log(error);
    });
});

//TYPE: PUT ROUTE
//DESC: UPDATE A SINGLE TODO
router.put("/todo/:id", (req, res, next) => {

  const todo = new Todo({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description
  })


  Todo.updateOne({_id: req.params.id}, todo).then(result => {
    console.log(result);
    res.status(200).json({message: "todo successfully updated"})
  })
});


module.exports = router;
