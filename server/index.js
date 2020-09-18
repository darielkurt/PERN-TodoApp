const express = require("express");
const app = express();
const cors = require("cors");

const pool = require("./db");

const port = 5000;

app.use(cors());
app.use(express.json());

// ROUTES //

// Create a To Do
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo(description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// Get all To Dos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    // res.render('/todos')
    res.json(allTodos.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// Get a To Do
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);

    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// Update a To Do
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { updated } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [updated, id]
    );

    res.json("To do was updated")
  } catch (error) {
    console.log(error);
  }
});

// Delete a To Do
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])
        
        res.json("To do was deleted")
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
  console.log(`Server currently listening on port ${port}...`);
});
