<script>
  import { onMount } from "svelte"; // onMount life cycle method
  import Navbar from "./layouts/Navbar.svelte";
  import { fly } from "svelte/transition";
  import { crossfade } from "svelte/transition"; // importing the Svelte transitions
  import { flip } from "svelte/animate";


  let todos = [];
  let newTodo = "";
  let currentFilter = "all";
  let allChecked = false;

  $: filteredTodos =
    currentFilter === "all"
      ? todos
      : currentFilter === "completed"
      ? todos.filter(todo => todo.completed)
      : todos.filter(todo => !todo.completed);

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/todos");
    const result = await res.json();

    todos = result.todos;

  });

  async function addTodo(event) {
    if (event.which === 13) {
      const todo = {
        title: newTodo,
        description: "",
        completed: false
      };

      const res = await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo)
      });
      const result = await res.json();
      todos.unshift(result.todo);
      todos = todos;
      newTodo = "";
    }
  }

  async function checkAllTodos() {

    const checkCompleted = {
      checked: event.target.checked
    }

    todos.forEach(todo => todo.completed = event.target.checked);
    todos = todos;

    const result = await fetch('http://localhost:3000/api/todos/allCompleted', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkCompleted)
    });

  }

  function updateFilter(filter) {
    currentFilter = filter;
  }

  async function deleteTodo(id) {
    await fetch(`http://localhost:3000/api/todos/${id}`, { method: "DELETE" });

    todos = todos.filter(todo => todo._id != id);
  }

  async function setCompleted(id) {

    const checkCompleted = {
      checked: event.target.checked
    }

    await fetch(`http://localhost:3000/api/todo/${id}/completed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkCompleted)
    });
  }

  async function editTodo(todo) {

    todo.editing = true;

    todos = todos;

}

async function doneEdit(todo) {

  todo.editing = false;

  await fetch(`http://localhost:3000/api/todo/${todo._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo)
      });

  todos = todos;

}

function doneEditKeydown(todo, event) {

  if(event.which === 13){
    doneEdit(todo);
  }
}

</script>
<!-- if should be better to create a separate file for the styling-->
<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 80%;
    text-align: center;
    margin-top: 20px;
  }

  .logo {
    display: block;
    margin: 20px auto;
    height: 75px;
  }

  .todo-input {
    width: 100%;
    padding: 10px 18px;
    font-size: 18px;
    margin-bottom: 16px;
  }
  .todo-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation-duration: 0.3s;
  }
  .remove-item {
    cursor: pointer;
    margin-left: 14px;
  }
  .todo-item-left {
    display: flex;
    align-items: center;
  }
  .todo-item-label {
    padding: 10px;
    border: 1px solid white;
    margin-left: 12px;
  }
  .todo-item-edit {
    font-size: 24px;
    color: #2c3e50;
    margin-left: 12px;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
  }
  .completed {
    text-decoration: line-through;
    color: grey;
  }
  .extra-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    border-top: 1px solid lightgrey;
    padding-top: 14px;
    margin-bottom: 14px;
  }
  button {
    font-size: 14px;
    background-color: white;
    appearance: none;
  }

  button:hover {
    background: lightblue;
    cursor: pointer;
  }
  .active {
    background: lightblue;
  }

  .todos {
    margin-bottom: 20px;
    margin-right: 20px;
  }
</style>

<Navbar />

<div class="container">

  <div class="row">

    <div class="col-md-12">

      <h2>Add a new Todo</h2>
      <input
        type="text"
        class="todo-input"
        placeholder="Type what needs to be done"
        bind:value={newTodo}
        on:keydown={addTodo} />

      <div class="extra-container">
        <div>
          <button
            on:click={() => updateFilter('all')}
            class:active={currentFilter === 'all'}>
            All
          </button>
          <button
            on:click={() => updateFilter('pending')}
            class:active={currentFilter === 'pending'}>
            Active
          </button>
          <button
            on:click={() => updateFilter('completed')}
            class:active={currentFilter === 'completed'}>
            Completed
          </button>
        </div>

        <div>
          <label>
            <input type="checkbox" bind:checked={allChecked} on:change={($event) => checkAllTodos($event)} />
            Check All
          </label>
        </div>

      </div>
    </div>

    {#each filteredTodos as todo}
      <div class="todos" transition:fly="{{ y: 25, duration: 1000}}">
        <div class="card" style="width: 18rem;">
          <div class="card-body">
          {#if !todo.editing}
            <h4 on:dblclick={() => editTodo(todo)} class="card-title" class:completed={todo.completed}>
               {todo.title}
            </h4>
          {:else}
          	<input class="todo-item-edit" type="text" bind:value={todo.title} on:blur={() => doneEdit(todo)} on:keydown={() => doneEditKeydown(todo, event)} autofocus>
            
            {/if}

            <p
              class="card-subtitle mb-2 text-muted"
              class:completed={todo.completed}>
              {todo.title}
            </p>
            <input
              type="checkbox"
              bind:checked={todo.completed}
              on:change={$event => setCompleted(todo._id, $event)} />
            Completed
            <button
              class="btn btn-outline-danger"
              on:click={() => deleteTodo(todo._id)}>
              delete note
            </button>
            <!--<a href="#" class="card-link">Another link</a>-->
          </div>
        </div>

      </div>
    {/each}

  </div>
</div>
